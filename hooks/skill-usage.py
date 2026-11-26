"""Skill usage report from Claude Code transcripts. Not a hook: run it by hand or from a scheduler.

    python -I skill-usage.py [--days 30] [--root ~/.claude/projects] [--skills ~/.claude/skills] [--all] [--out FILE]

Counts a skill when a transcript has a Skill tool call for it or a typed `<command-name>/x</command-name>`,
in main and subagent files alike. Installed skills (folders with SKILL.md) that were never used are listed
first: that is the evidence for dropping one.
"""
import argparse
import json
import os
import re
import sys
from datetime import date, timedelta
from pathlib import Path

COMMAND = re.compile(r"<command-name>/?([A-Za-z0-9:_-]+)</command-name>")


def names_in(entry):
    msg = entry.get("message") if isinstance(entry, dict) else None
    if not isinstance(msg, dict):
        return
    content = msg.get("content")
    if isinstance(content, str):
        if msg.get("role") == "user":
            yield from COMMAND.findall(content)
        return
    if not isinstance(content, list):
        return
    for block in content:
        if not isinstance(block, dict):
            continue
        if block.get("type") == "tool_use" and block.get("name") == "Skill":
            name = (block.get("input") or {}).get("skill")
            if name:
                yield name
        elif block.get("type") == "text" and msg.get("role") == "user":
            yield from COMMAND.findall(block.get("text") or "")


def collect(root, skills_dir, days, today, only_installed=True):
    cutoff = (today - timedelta(days=days)).isoformat()
    stats = {}
    for name in os.listdir(skills_dir) if os.path.isdir(skills_dir) else []:
        if os.path.isfile(os.path.join(skills_dir, name, "SKILL.md")):
            stats[name] = {"name": name, "total": 0, "recent": 0, "last": "-"}
    for dirpath, _, files in os.walk(root):
        for fname in files:
            if not fname.endswith(".jsonl"):
                continue
            try:
                fh = open(os.path.join(dirpath, fname), encoding="utf-8", errors="replace")
            except OSError:
                continue
            with fh:
                for raw in fh:
                    if '"skill"' not in raw and "<command-name>" not in raw:
                        continue
                    try:
                        entry = json.loads(raw)
                    except ValueError:
                        continue
                    day = (entry.get("timestamp") or "")[:10] if isinstance(entry, dict) else ""
                    for name in names_in(entry):
                        if only_installed and name not in stats:
                            continue
                        row = stats.setdefault(name, {"name": name, "total": 0, "recent": 0, "last": "-"})
                        row["total"] += 1
                        if day >= cutoff:
                            row["recent"] += 1
                        if day > row["last"] or row["last"] == "-":
                            row["last"] = day
    return list(stats.values())


def render(rows, days, today):
    ordered = sorted(rows, key=lambda r: (r["total"] > 0, r["last"], r["name"]))
    lines = [
        f"# Skill usage, {today.isoformat()}",
        "",
        f"Last {days} days = since {(today - timedelta(days=days)).isoformat()}. Never-used skills come first.",
        "",
        "| skill | total | last period | last use |",
        "|---|---|---|---|",
    ]
    lines += [f"| {r['name']} | {r['total']} | {r['recent']} | {r['last']} |" for r in ordered]
    return "\n".join(lines) + "\n"


def main():
    home = Path.home() / ".claude"
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--days", type=int, default=30)
    ap.add_argument("--root", default=str(home / "projects"))
    ap.add_argument("--skills", default=str(home / "skills"))
    ap.add_argument("--all", action="store_true", help="also count names that are not installed skills (built-in commands, removed skills)")
    ap.add_argument("--out")
    a = ap.parse_args()
    today = date.today()
    text = render(collect(a.root, a.skills, a.days, today, only_installed=not a.all), a.days, today)
    if a.out:
        Path(a.out).parent.mkdir(parents=True, exist_ok=True)
        Path(a.out).write_text(text, encoding="utf-8")
    else:
        sys.stdout.write(text)


if __name__ == "__main__":
    main()
