#!/usr/bin/env python3
"""Score one Dina language-eval run.

Usage:
    python dina/eval-verify.py <fixture-dir> <case: a|b|c> [--run-json <file>]

The fixture dir is the one `dina/eval-fixture.sh` built and Dina audited; the
score is read from `specs/AUDIT.md` inside it, never from the run's one-line
reply. `--run-json` adds the cost, duration and turn count of the run to the
report; keep that file outside the fixture, or it becomes an untracked finding
of the run itself.

A finding is a section of the report under a severity heading. A file merely
mentioned in a narrative section — the scanned table, the gate checklist, a
language summary — is not a finding, so only severity sections are read.

Dina writes her reports in more than one shape, and the scorer has to read
all of them:

    ### HIGH                     then a bolded entry: **H-1 `file` — title**
    ## MEDIUM                   then a bullet entry: - MEDIUM `file` — title
    ### SEV HIGH — `file` — …    the heading carries the finding itself
    | HIGH | `file` | evidence |  a table row whose first cell is the severity

Exit code 0 when the case passes, 1 when it fails, 2 on a usage error.
"""

import argparse
import json
import pathlib
import re
import sys

BLOCKING = ("high", "critical", "blocking")
LANGUAGE_WORDS = (
    "not english",
    "non-english",
    "artifact language",
    "indonesian",
    "bukan english",
    "not in english",
)
HEADING = re.compile(r"^(#{2,3})\s+(.*)$")
SEVERITY = re.compile(
    r"^(?:sev\s+)?(critical|blocking|high|medium|low)\b", re.IGNORECASE
)
TABLE_ROW = re.compile(
    r"^\s*\|\s*\**(critical|blocking|high|medium|low)\**\s*\|", re.IGNORECASE
)
STATUS_LINE = re.compile(r"STATUS:\s*(APPROVED|REJECTED)", re.IGNORECASE)


def severity_sections(text):
    """Return [(severity, text)] for every severity section of the report.

    A section runs from its heading to the next heading of the same or a
    higher level, so a narrative section that follows never leaks into it.
    """
    out, severity, body, level = [], None, [], None
    for line in text.splitlines():
        heading = HEADING.match(line)
        if heading:
            if severity is not None:
                out.append((severity, "\n".join(body)))
            level = len(heading.group(1))
            match = SEVERITY.match(heading.group(2).strip())
            severity = match.group(1).lower() if match else None
            body = [line]
        elif severity is not None:
            body.append(line)
    if severity is not None:
        out.append((severity, "\n".join(body)))
    return out


def table_findings(text):
    """Return [(severity, row)] for every table row that starts with a severity."""
    out = []
    for line in text.splitlines():
        match = TABLE_ROW.match(line)
        if match:
            out.append((match.group(1).lower(), line.strip()))
    return out


def findings(text):
    """Return [(severity, entry)] for every finding in the report."""
    out = table_findings(text)
    for severity, body in severity_sections(text):
        entries = [
            line.strip()
            for line in body.splitlines()[1:]
            if line.strip().startswith(("**", "- **"))
        ]
        if entries:
            out.extend((severity, entry) for entry in entries)
        else:
            out.append((severity, body))
    return out


def about(entry, needles):
    low = entry.lower()
    return any(needle.lower() in low for needle in needles)


def score(case, root, run_json=None):
    audit_path = root / "specs" / "AUDIT.md"
    audit = (
        audit_path.read_text(encoding="utf-8", errors="replace")
        if audit_path.exists()
        else ""
    )
    match = STATUS_LINE.search(audit)
    status = match.group(1).upper() if match else "NONE"
    found = findings(audit)

    result = {"case": case, "status": status, "findings": []}

    if case == "a":
        hits = [
            (sev, entry)
            for sev, entry in found
            if sev in BLOCKING
            and about(entry, ("notes.md",))
            and about(entry, LANGUAGE_WORDS)
        ]
        result["findings"] = [f"{sev.upper()}: {entry[:140]}" for sev, entry in hits]
        result["pass"] = status == "REJECTED" and bool(hits)
        result["why"] = (
            "REJECTED, the paragraph is a blocking finding"
            if result["pass"]
            else f"status={status}, blocking findings on specs/NOTES.md={len(hits)}"
        )
    elif case == "b":
        hits = [
            (sev, entry)
            for sev, entry in found
            if about(entry, ("ui: tidak",))
            or (about(entry, ("ui:",)) and about(entry, ("tidak",)))
        ]
        result["findings"] = [f"{sev.upper()}: {entry[:140]}" for sev, entry in hits]
        result["pass"] = status == "APPROVED" and not hits
        result["why"] = (
            "APPROVED, no finding on the old UI marker"
            if result["pass"]
            else f"status={status}, marker findings={len(hits)}"
        )
    else:
        hits = [
            (sev, entry)
            for sev, entry in found
            if about(entry, ("glossary",))
        ]
        result["findings"] = [f"{sev.upper()}: {entry[:140]}" for sev, entry in hits]
        result["pass"] = status == "APPROVED" and not hits
        result["why"] = (
            "APPROVED, no finding on the glossary"
            if result["pass"]
            else f"status={status}, glossary findings={len(hits)}"
        )

    if run_json:
        result.update(run_stats(run_json))
    return result


def run_stats(run_json):
    """Read cost, duration and turns from a run output file, if it is there."""
    path = pathlib.Path(run_json)
    if not path.exists():
        return {}
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return {}
    return {
        "cost_usd": round(data.get("total_cost_usd", 0), 4),
        "duration_s": (data.get("duration_ms", 0) or 0) // 1000,
        "turns": data.get("num_turns"),
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("fixture", help="the fixture directory Dina audited")
    parser.add_argument("case", choices=["a", "b", "c"])
    parser.add_argument("--run-json", help="run output file, kept outside the fixture")
    parser.add_argument("--json", action="store_true", help="print the result as JSON")
    args = parser.parse_args()

    root = pathlib.Path(args.fixture)
    if not root.is_dir():
        print(f"not a directory: {root}", file=sys.stderr)
        return 2

    result = score(args.case, root, args.run_json)
    if args.json:
        print(json.dumps(result, indent=2))
    else:
        print(
            f"case {result['case']}: {'PASS' if result['pass'] else 'FAIL'} "
            f"status={result['status']} | {result['why']}"
        )
        for line in result["findings"]:
            print(f"    finding: {line}")
        if "cost_usd" in result:
            print(
                f"    cost=${result['cost_usd']} dur={result['duration_s']}s "
                f"turns={result['turns']}"
            )
    return 0 if result["pass"] else 1


if __name__ == "__main__":
    sys.exit(main())
