# Hooks user-level

Tiga hook Claude Code untuk user-level (`~/.claude/hooks/`). Repo ini menyimpan sumbernya supaya tidak hilang; masih tidak ada installer. Pasang manual.

| Hook | Event | Fungsi |
|---|---|---|
| `cache-guard.js` | `UserPromptSubmit` | Menandai prompt sebagai cache miss ketika konteks besar atau model berganti, supaya biayanya tidak disamarkan sebagai prompt murah |
| `ask-on-git-push.js` | `PreToolUse` (Bash, PowerShell) | Menolak `git push` yang memakai opsi global (`-C`, `-c`, `--git-dir`) dan meminta `git push` biasa |
| `changelog-on-commit.js` | `PreToolUse` (Bash, PowerShell) | Menolak commit `feat`/`fix`/breaking tanpa `CHANGELOG.md`, dan commit yang menyentuh Dockerfile, compose, atau `migrations/` |

## Pasang manual

Salin ke `~/.claude/hooks/`, lalu daftarkan di `~/.claude/settings.json`:

```json
{
  "permissions": {
    "ask": ["Bash(git push *)", "PowerShell(git push *)"]
  },
  "hooks": {
    "UserPromptSubmit": [{ "hooks": [{ "type": "command", "command": "node ~/.claude/hooks/cache-guard.js" }] }],
    "PreToolUse": [
      { "matcher": "Bash", "hooks": [
        { "type": "command", "command": "node ~/.claude/hooks/ask-on-git-push.js" },
        { "type": "command", "command": "node ~/.claude/hooks/changelog-on-commit.js" }
      ]},
      { "matcher": "PowerShell", "hooks": [
        { "type": "command", "command": "node ~/.claude/hooks/ask-on-git-push.js" },
        { "type": "command", "command": "node ~/.claude/hooks/changelog-on-commit.js" }
      ]}
    ]
  }
}
```

Blok `permissions.ask` wajib: `ask-on-git-push.js` hanya menolak push yang memakai opsi global git. Persetujuan push datang dari aturan izin itu, bukan dari hook.

`cache-guard.js` menulis penanda di `~/.claude/hooks/cache-guard.d/`. Lokasi itu bisa diganti lewat env `CACHE_GUARD_DIR`.

## Tes

```bash
node --test "$HOME/.claude/skills/hooks/_tests/*.test.js"
```

Node 22 butuh glob, bukan nama folder. 45 kasus (pipe test: JSON hook input, bukan perintah shell).
