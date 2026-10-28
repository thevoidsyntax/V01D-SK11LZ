# `/autor new` — wizard proyek baru

Dibaca `autor/SKILL.md` saat `/autor new` dijalankan. Section 4 di sana = rekomendasi pipeline.

**Action:** Start new project workflow:

**Step 1:** Ask project type:
```
📋 What type of project?
1. 🌐 Web Application
2. 📡 REST/GraphQL API
3. 🔧 CLI Tool
4. 📦 NPM Library
5. 📱 Mobile App
6. 🎮 Game
```

**Step 1b:** Ask the UI language with one question: Indonesian, English, or both. The product's language is the user's call. Never ask the code language: it is English by the user's global rules, and only user-facing text follows the UI language.

**Step 2:** Run `/satria` to turn the idea into `specs/PRD.md`, then end your turn: summarize the PRD and its assumptions and ask for approval. For a product with several features, Satria uses roadmap mode and writes `specs/ROADMAP.md` with one PRD per epic — summarize the roadmap and the first epic instead. Plan mode may not hold in a headless or auto session, so the stop is yours to make. Do not run Step 3 or invoke `/athena` in the same turn; Satria's `[HANDOFF]` line is not a trigger here.

**Step 3:** Scaffold the project yourself; there is no scaffolding skill. Use the stack from the approved PRD and the folder layout from the user's global `CLAUDE.md` rules. Create: `git init` if needed, `.gitignore`, `.env.example` (no secrets), a manifest with start/test scripts, one passing test, a README stub, and the **project `CLAUDE.md`**:

```markdown
# <project> — Claude Code guide
Scale: PRIBADI | KLIEN
UI language: <language of labels, messages, and copy, from Step 1b>
Code language: English (identifiers, comments, file names, DB columns, enums, API fields)
Stack: <language + version, framework, database>
Commands: <install>, <run>, <test>, <lint if any>
Layout: <top folders and what lives where>
Conventions: <what is fixed so far; Athena adds the rest from the ADR>
Specs: specs/PRD.md, specs/ADR.md, specs/HANDOFF.md
```

Install nothing from the internet unless the user allowed it. No feature code.

**Step 4:** Detect the stack from the manifests (`package.json`, `*.csproj`, `go.mod`, `pyproject.toml`, ...). Append a `specs/HANDOFF.md` entry for the scaffold: a `## [SCAFFOLD] autor — <UTC time from date -u>` heading, then `Input:`, `Output:`, `Decisions:`, `Open:`, `Next:` lines covering stack, layout, scripts, and what is not verified yet. Never invent a time; write the date only if you cannot run `date`.

**Step 5:** Offer a commit of the scaffold: show `git status --short` and the message (`chore: scaffold <project>` with `Co-Authored-By: Satria`; this persona trailer is the user's attribution rule and replaces Claude Code's default `Co-Authored-By: Claude …` line), then ask **Commit** / **Ubah pesan** / **Lewati**. Commit only on **Commit**; if you cannot ask (headless), leave it uncommitted and say so. Never push.

**Step 6:** End with the persona pipeline recommendation (section 4), then stop. A bare "lanjut" or "continue" only advances the current wizard step; it is never permission to start a persona. Start Athena, Hexa, or any later phase only after the user says "mulai pipeline" or runs `/agents`.
