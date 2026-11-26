"""Tests for hooks/skill-usage.py: python -I -m unittest hooks/_tests/test_skill_usage.py"""
import importlib.util
import json
import os
import tempfile
import unittest
from datetime import date, timedelta
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent.parent / "skill-usage.py"
spec = importlib.util.spec_from_file_location("skill_usage", SCRIPT)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

TODAY = date(2026, 11, 26)


def line(day, content, role="assistant"):
    return json.dumps({"timestamp": f"{day}T10:00:00Z", "message": {"role": role, "content": content}})


def skill_call(name):
    return [{"type": "tool_use", "name": "Skill", "input": {"skill": name}}]


class SkillUsage(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        root = Path(self.tmp.name)
        self.projects = root / "projects"
        self.skills = root / "skills"
        (self.projects / "p1" / "sess" / "subagents").mkdir(parents=True)
        for name in ("audit", "hexa", "ghost"):
            (self.skills / name).mkdir(parents=True)
            (self.skills / name / "SKILL.md").write_text("---\nname: x\n---\n")
        (self.skills / "notes").mkdir()  # no SKILL.md: not a skill

    def write(self, rel, *lines):
        path = self.projects / rel
        path.write_text("\n".join(lines) + "\n", encoding="utf-8")

    def report(self, days=30):
        return mod.collect(str(self.projects), str(self.skills), days, TODAY)

    def test_counts_tool_calls_and_typed_commands_in_main_and_subagent_files(self):
        recent = (TODAY - timedelta(days=3)).isoformat()
        old = (TODAY - timedelta(days=90)).isoformat()
        self.write("p1/a.jsonl",
                   line(recent, skill_call("audit")),
                   line(old, skill_call("audit")),
                   line(recent, "<command-name>/hexa</command-name>", role="user"))
        self.write("p1/sess/subagents/b.jsonl", line(recent, skill_call("audit")))
        rows = {r["name"]: r for r in self.report()}
        self.assertEqual((rows["audit"]["total"], rows["audit"]["recent"]), (3, 2))
        self.assertEqual(rows["audit"]["last"], recent)
        self.assertEqual((rows["hexa"]["total"], rows["hexa"]["recent"]), (1, 1))

    def test_installed_skills_with_no_use_are_listed_and_folders_without_skill_md_are_not(self):
        self.write("p1/a.jsonl", line(TODAY.isoformat(), skill_call("audit")))
        rows = {r["name"]: r for r in self.report()}
        self.assertEqual((rows["ghost"]["total"], rows["ghost"]["last"]), (0, "-"))
        self.assertNotIn("notes", rows)

    def test_names_that_are_not_installed_skills_only_show_with_all(self):
        self.write("p1/a.jsonl",
                   line(TODAY.isoformat(), "<command-name>/cd</command-name>", role="user"),
                   line(TODAY.isoformat(), skill_call("removed-skill")))
        self.assertNotIn("cd", {r["name"] for r in self.report()})
        everything = {r["name"] for r in mod.collect(str(self.projects), str(self.skills), 30, TODAY, only_installed=False)}
        self.assertTrue({"cd", "removed-skill", "audit"} <= everything)

    def test_garbage_lines_and_unreadable_files_do_not_stop_the_report(self):
        self.write("p1/a.jsonl", "not json {", line(TODAY.isoformat(), skill_call("audit")), '{"message": null}')
        rows = {r["name"]: r for r in self.report()}
        self.assertEqual(rows["audit"]["total"], 1)

    def test_markdown_table_sorts_never_used_first_then_by_last_use(self):
        self.write("p1/a.jsonl", line(TODAY.isoformat(), skill_call("audit")))
        text = mod.render(self.report(), 30, TODAY)
        order = [ln.split("|")[1].strip() for ln in text.splitlines() if ln.startswith("| ") and "---" not in ln][1:]
        self.assertEqual(order[0], "ghost")
        self.assertEqual(order[-1], "audit")
        self.assertIn("2026-11-26", text)


if __name__ == "__main__":
    unittest.main()
