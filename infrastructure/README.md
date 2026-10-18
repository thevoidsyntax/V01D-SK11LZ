# Infrastructure

Reference code, **not skills**. Claude Code loads nothing from this folder: it only discovers skills at `<name>/SKILL.md` one level below `~/.claude/skills`.

| Folder | Contents |
|--------|----------|
| `auto-router/` | TypeScript detection engine (pattern, tech, intent and phase detectors, health scorer, recommendation engine) with Vitest tests. `/autor` covers similar detection through the instructions in `autor/SKILL.md`; it does not run this code. |

## Running the TypeScript (optional)

Normal skill use does not need this. Dependencies are not committed.

```powershell
cd infrastructure/auto-router
npm install
npm run test:run
```
