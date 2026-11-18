# Hooks user-level

Enam hook Claude Code untuk user-level (`~/.claude/hooks/`). Repo ini menyimpan sumbernya supaya tidak hilang; masih tidak ada installer. Pasang manual.

| Hook | Event | Fungsi |
|---|---|---|
| `cache-guard.js` | `UserPromptSubmit` | Menandai prompt sebagai cache miss ketika konteks besar atau model berganti, supaya biayanya tidak disamarkan sebagai prompt murah |
| `ask-on-git-push.js` | `PreToolUse` (Bash\|PowerShell) | Menolak `git push` yang memakai opsi global (`-C`, `-c`, `--git-dir`) dan meminta `git push` biasa |
| `changelog-on-commit.js` | `PreToolUse` (Bash\|PowerShell) | Menolak commit `feat`/`fix`/breaking tanpa `CHANGELOG.md`, dan commit yang menyentuh Dockerfile, compose, atau `migrations/` |
| `destructive-guard.js` | `PreToolUse` (Bash\|PowerShell) | Minta konfirmasi untuk `git reset --hard`, `git clean -f`, `git branch -D`, `git checkout --`/`git restore` yang membuang perubahan worktree, `gh repo delete`, `rm -rf`, dan setara PowerShell-nya (`Remove-Item`/`ri`/`rd`/... `-Recurse -Force`); menolak kalau dibungkus opsi global git (`-C`, `-c`, ...) yang bisa diam-diam mengganti target |
| `gitleaks-guard.js` | `PreToolUse` (Bash\|PowerShell) | Menjalankan `gitleaks protect --staged` sebelum `git commit`; menolak commit kalau ketemu secret, fail-open kalau gitleaks tidak terpasang atau errornya bukan temuan leak |
| `claude-resume-on-sessionstart.js` | `SessionStart` (matcher `compact`) | Setelah context di-compact, kasih tahu sesi baru file resume mana yang harus diupdate: `specs/RESUME.md` kalau proyek pakai konvensi pipeline `/agents`, kalau tidak `RESUME.md` di root proyek |

`claude-resume-on-precompact.ps1` (chime + instruksi singkat ke summarizer compaction) **bukan bagian repo ini** — itu dikelola ekstensi VSCode "Claude Notifier" terpisah (dot-source `_lib.ps1`-nya) dan hanya ada di `~/.claude/hooks/`. Perubahan di situ tidak ikut sync lewat `git pull` repo ini; sinkronkan manual, dan sadari update ekstensinya bisa menimpa balik edit manual itu.

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
      { "matcher": "Bash|PowerShell", "hooks": [
        { "type": "command", "command": "node ~/.claude/hooks/ask-on-git-push.js" },
        { "type": "command", "command": "node ~/.claude/hooks/changelog-on-commit.js" },
        { "type": "command", "command": "node ~/.claude/hooks/destructive-guard.js" },
        { "type": "command", "command": "node ~/.claude/hooks/gitleaks-guard.js" }
      ]}
    ],
    "SessionStart": [
      { "matcher": "compact", "hooks": [
        { "type": "command", "command": "node ~/.claude/hooks/claude-resume-on-sessionstart.js" }
      ]}
    ]
  }
}
```

Blok `permissions.ask` wajib: `ask-on-git-push.js` hanya menolak push yang memakai opsi global git. Persetujuan push datang dari aturan izin itu, bukan dari hook.

`cache-guard.js` menulis penanda di `~/.claude/hooks/cache-guard.d/`. Lokasi itu bisa diganti lewat env `CACHE_GUARD_DIR`.

`gitleaks-guard.js` butuh binary [gitleaks](https://github.com/gitleaks/gitleaks) terpasang (mis. `winget install --id Gitleaks.Gitleaks`); tanpa itu hook fail-open (tidak memblokir commit apa pun).

`destructive-guard.js` dan `ask-on-git-push.js` adalah lapisan "ask" lunak (auto mode menentukan sendiri). Konfirmasi manusia yang sesungguhnya datang dari `permissions.ask` di `settings.json` untuk ejaan literal yang umum (`Bash(git reset --hard*)`, `Bash(rm -rf *)`, `PowerShell(Remove-Item * -Recurse -Force*)`, dst).

`settings.json` sendiri bukan bagian repo ini (konfigurasi user-level per mesin). `settings.reference.json` di folder ini berisi fragmen `permissions.deny`, `permissions.ask`, dan `hooks.PreToolUse` yang perlu di-merge manual ke `settings.json` di mesin baru setelah pull/clone, plus langkah-langkahnya.

`permissions.deny` adalah lapisan defense-in-depth terpisah dari hook-hook di atas: menolak `Read`/`Edit`/`Write` pada `.env*` (kecuali `.env.example`, sengaja tidak masuk daftar) dan `.credentials.json` di mana pun lokasinya, berlaku lebih dulu daripada `allow`/`ask`/`defaultMode` dan tidak bisa dilewati. Ini hanya menutup jalur baca file lewat tool bawaan Claude Code (`Read`, dan `Bash` input-redirect `< .env` sejak Claude Code v2.1.257) — `Bash(cat .env)` dkk. tetap tidak ditutup karena deny rule untuk `Bash` cuma cocok teks literal, bukan batas keamanan sungguhan (lihat dokumentasi Claude Code sendiri).

## Tes

```bash
node --test "$HOME/.claude/skills/hooks/_tests/*.test.js"
```

Tes menguji salinan di repo ini (`__dirname/..`), bukan salinan aktif di `~/.claude/hooks/` — path itu, bukan `~/.claude/hooks/_tests/`, yang sebenarnya ada. Node 22 butuh glob, bukan nama folder. 81 kasus (pipe test: JSON hook input, bukan perintah shell).
