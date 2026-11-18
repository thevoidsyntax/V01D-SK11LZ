# Hooks user-level

Lima hook Claude Code untuk user-level (`~/.claude/hooks/`). Repo ini menyimpan sumbernya supaya tidak hilang; masih tidak ada installer. Pasang manual.

| Hook | Event | Fungsi |
|---|---|---|
| `cache-guard.js` | `UserPromptSubmit` | Menandai prompt sebagai cache miss ketika konteks besar atau model berganti, supaya biayanya tidak disamarkan sebagai prompt murah |
| `ask-on-git-push.js` | `PreToolUse` (Bash\|PowerShell) | Menolak `git push` yang memakai opsi global (`-C`, `-c`, `--git-dir`) dan meminta `git push` biasa |
| `changelog-on-commit.js` | `PreToolUse` (Bash\|PowerShell) | Menolak commit `feat`/`fix`/breaking tanpa `CHANGELOG.md`, dan commit yang menyentuh Dockerfile, compose, atau `migrations/` |
| `destructive-guard.js` | `PreToolUse` (Bash\|PowerShell) | Minta konfirmasi untuk `git reset --hard`, `git clean -f`, `git branch -D`, `git checkout --`/`git restore` yang membuang perubahan worktree, `gh repo delete`, `rm -rf`, dan setara PowerShell-nya (`Remove-Item`/`ri`/`rd`/... `-Recurse -Force`); menolak kalau dibungkus opsi global git (`-C`, `-c`, ...) yang bisa diam-diam mengganti target |
| `gitleaks-guard.js` | `PreToolUse` (Bash\|PowerShell) | Menjalankan `gitleaks protect --staged` sebelum `git commit`; menolak commit kalau ketemu secret, fail-open kalau gitleaks tidak terpasang atau errornya bukan temuan leak |

## Pasang manual

Salin ke `~/.claude/hooks/`, lalu daftarkan di `~/.claude/settings.json`:

```json
{
  "hooks": {
    "UserPromptSubmit": [{ "hooks": [{ "type": "command", "command": "node ~/.claude/hooks/cache-guard.js" }] }],
    "PreToolUse": [
      { "matcher": "Bash|PowerShell", "hooks": [
        { "type": "command", "command": "node ~/.claude/hooks/ask-on-git-push.js" },
        { "type": "command", "command": "node ~/.claude/hooks/changelog-on-commit.js" },
        { "type": "command", "command": "node ~/.claude/hooks/destructive-guard.js" },
        { "type": "command", "command": "node ~/.claude/hooks/gitleaks-guard.js" }
      ]}
    ]
  }
}
```

`cache-guard.js` menulis penanda di `~/.claude/hooks/cache-guard.d/`. Lokasi itu bisa diganti lewat env `CACHE_GUARD_DIR`.

`gitleaks-guard.js` butuh binary [gitleaks](https://github.com/gitleaks/gitleaks) terpasang (mis. `winget install --id Gitleaks.Gitleaks`); tanpa itu hook fail-open (tidak memblokir commit apa pun).

`destructive-guard.js` dan `ask-on-git-push.js` adalah lapisan "ask" lunak (auto mode menentukan sendiri). Konfirmasi manusia yang sesungguhnya datang dari `permissions.ask` di `settings.json` untuk ejaan literal yang umum (`Bash(git reset --hard*)`, `Bash(rm -rf *)`, `PowerShell(Remove-Item * -Recurse -Force*)`, dst).

## Tes

```bash
node --test "$HOME/.claude/hooks/_tests/*.test.js"
```

Node 22 butuh glob, bukan nama folder. 77 kasus (pipe test: JSON hook input, bukan perintah shell).
