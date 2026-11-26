# Hooks user-level

Hook Claude Code untuk user-level (`~/.claude/hooks/`). Repo ini menyimpan sumbernya supaya tidak hilang; masih tidak ada installer. Pasang manual.

| Hook | Event | Fungsi |
|---|---|---|
| `cache-guard.js` | `UserPromptSubmit` | Menandai prompt sebagai cache miss ketika konteks besar atau model berganti, supaya biayanya tidak disamarkan sebagai prompt murah |
| `ask-on-git-push.js` | `PreToolUse` (Bash\|PowerShell) | Menolak `git push` yang memakai opsi global (`-C`, `-c`, `--git-dir`) dan meminta `git push` biasa |
| `changelog-on-commit.js` | `PreToolUse` (Bash\|PowerShell) | Menolak commit `feat`/`fix`/breaking tanpa `CHANGELOG.md`, dan commit yang menyentuh Dockerfile, compose, atau `migrations/` |
| `pre-commit-check-on-commit.js` | `PreToolUse` (Bash\|PowerShell) | Sebelum `git commit` di repo yang punya `pre-commit-check/SKILL.md`, menjalankan blok bash skill itu dari root repo dan menolak commit kalau ada output selain baris `warning:`. Fail-open (tanpa bash, timeout 30 detik, atau SKILL.md tanpa blok). Lepas dengan `PRECOMMIT_CHECK=off` di perintah commit atau di env |
| `destructive-guard.js` | `PreToolUse` (Bash\|PowerShell) | Minta konfirmasi untuk `git reset --hard`, `git clean -f`, `git branch -D`, `git checkout --`/`git restore` yang membuang perubahan worktree, `gh repo delete`, `rm -rf`, dan setara PowerShell-nya (`Remove-Item`/`ri`/`rd`/... `-Recurse -Force`); menolak kalau dibungkus opsi global git (`-C`, `-c`, ...) yang bisa diam-diam mengganti target |
| `gitleaks-guard.js` | `PreToolUse` (Bash\|PowerShell) | Menjalankan `gitleaks protect --staged` sebelum `git commit`; menolak commit kalau ketemu secret, fail-open kalau gitleaks tidak terpasang atau errornya bukan temuan leak |
| `claude-resume-on-sessionstart.js` | `SessionStart` (matcher `compact`) | Setelah context di-compact, kasih tahu sesi baru file resume mana yang harus diupdate: `specs/RESUME.md` kalau proyek pakai konvensi pipeline `/agents`, kalau tidak `RESUME.md` di root proyek |
| `sven-gatekeeper.js` | `PreToolUse` (Bash\|PowerShell\|Write\|Edit\|MultiEdit\|AskUserQuestion) | Menolak aksi tak-terpulihkan yang belum ditangani hook lain (`npm publish`, `docker compose down -v`, `prisma migrate reset`, force push, `vercel --prod`, `railway up`, DROP/TRUNCATE), bertanya sebelum edit file kritis (`.env*`, Dockerfile, compose, schema, migrations, auth/middleware, `CLAUDE.md`, `settings.json`), dan membingkai `AskUserQuestion` sebagai Sven. Pemblokiran dilepas per aksi lewat token `.sven-approved.json` (SHA-256 sesi + tool + target + isi, 5 menit, sekali pakai) |
| `sven-telegram-notify.js` | dipanggil gatekeeper dan skill `/sven` (bukan event hook) | Kirim keputusan ke Telegram lewat Bot API: token dari `~/.claude/channels/telegram/.env`, chat id dari `access.json` plugin resmi; hanya `REJECTED`/`REVISED`/`NEED_USER_DECISION`, dedupe 5 menit, timeout 5 detik, selalu exit 0, kegagalan masuk `~/.claude/logs/sven-decisions.log` |
| `sven-ask.js` | dipanggil skill `/sven` untuk `NEED_USER_DECISION` (bukan event hook) | Tanya user lewat Telegram dengan tombol pilihan, lalu tunggu jawabannya. Daemon h3x4 satu-satunya poller: saat tombol ditekan atau pesan dibalas, ia menulis `<id>.answer.json` ke `~/.claude/hooks/.sven-pending/`, dan hook membacanya. Mencetak satu baris JSON (`button`, `text`, `timeout`, `unavailable`, `invalid`), selalu exit 0; daemon mati atau pesan gagal terkirim → `unavailable`, tanya di terminal. Token plugin harus milik daemon, kalau tidak tombolnya tidak sampai |
| `handover.js` | `Stop`, `SessionStart`, `UserPromptSubmit` | `Stop` menulis snapshot `specs/.state.md` tiap turn (branch, git status, fase dan Next terakhir dari HANDOFF, hasil test terakhir, ukuran context); `SessionStart` mencetaknya supaya sesi baru langsung punya arah; `UserPromptSubmit` memberi satu baris peringatan saat context lewat 150k token (`HANDOVER_CONTEXT_WARN`). Dipakai skill `/handover`. Tanpa `specs/`, snapshot ditulis ke `~/.claude/state/<repo>.md` |

Saklar: `SVEN_ADVISOR=off` mematikan gatekeeper, `SVEN_GATEKEEPER=dryrun` hanya mencatat ke `~/.claude/logs/sven-gatekeeper.log`, `SVEN_TELEGRAM=off` mematikan notifikasi.

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
        { "type": "command", "command": "node ~/.claude/hooks/pre-commit-check-on-commit.js" },
        { "type": "command", "command": "node ~/.claude/hooks/destructive-guard.js" },
        { "type": "command", "command": "node ~/.claude/hooks/gitleaks-guard.js" }
      ]}
    ],
    "SessionStart": [
      { "matcher": "compact", "hooks": [
        { "type": "command", "command": "node ~/.claude/hooks/claude-resume-on-sessionstart.js" }
      ]},
      { "hooks": [{ "type": "command", "command": "node ~/.claude/hooks/handover.js" }] }
    ],
    "Stop": [{ "hooks": [{ "type": "command", "command": "node ~/.claude/hooks/handover.js" }] }]
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

Tes menguji salinan di repo ini (`__dirname/..`), bukan salinan aktif di `~/.claude/hooks/` — path itu, bukan `~/.claude/hooks/_tests/`, yang sebenarnya ada. Node 22 butuh glob, bukan nama folder. 123 kasus (pipe test: JSON hook input, bukan perintah shell).
