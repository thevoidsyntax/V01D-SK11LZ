# Checklist sync ke mesin baru

Bukan skill, tidak dimuat Claude Code — referensi langkah seperti `settings.reference.json` di folder ini. Dipakai di **awal sesi di mesin lain** sebelum menyentuh apa pun, supaya jelas sisi mana yang boleh ditimpa (fast-forward) dan mana yang harus direkonsiliasi dulu. Perintah pasang/update dasar ada di `CLAUDE.md` bagian "Pasang & sync".

## 1. Baca state dulu, jangan ubah apa pun

```bash
cd ~/.claude/skills
git status -sb
git stash list
git log --oneline -3
git fetch origin --prune --tags
git rev-list --left-right --count HEAD...origin/main   # "<lokal-saja> <remote-saja>"
git log --oneline origin/main..HEAD                     # commit yang belum sampai ke origin dari mesin ini
git log --oneline HEAD..origin/main                      # commit baru dari mesin lain yang belum ditarik
git status --porcelain                                   # '??' = file/skill baru yang hanya ada di mesin ini
git diff --stat
git diff --ignore-cr-at-eol --stat                        # kosong = bedanya cuma EOL, bukan isi beneran
```

## 2. Putuskan tindakan dari hasil di atas

| lokal-saja | worktree | tindakan |
|---|---|---|
| 0 | bersih | `git pull --ff-only` |
| 0 | cuma beda EOL | `git config core.autocrlf true`, lalu `git stash push -m eol`, `git pull --ff-only`, cek, `git stash drop` |
| 0 | ada isi nyata | baca `git diff` dulu, `git stash push -u -m pc-wip`, `git pull --ff-only`, `git stash pop`, selesaikan konflik, commit |
| > 0 | apa saja | `git branch backup/pc-$(date +%Y%m%d)` dulu, stash kalau kotor, `git rebase origin/main`, selesaikan konflik (`git diff --name-only --diff-filter=U`), jalankan checklist "Sebelum commit" di `CLAUDE.md`, lalu `git push` |

`git reset --hard`, clone ulang, atau menimpa folder secara manual **bukan langkah pertama** — itu hanya boleh dilakukan setelah isi unik mesin itu terbukti sudah ter-push atau sudah sengaja dibuang. Kalau `pull.ff only` belum pernah di-set di mesin ini (lihat blok "Sekali per mesin" di `CLAUDE.md`), pasang dulu supaya `pull` biasa tidak diam-diam membuat merge commit.

## 3. Lapisan di luar git: hook aktif vs sumber repo

`~/.claude/hooks/*.js` adalah salinan **aktif** yang benar-benar dijalankan Claude Code; `~/.claude/skills/hooks/*.js` adalah sumbernya di repo ini. `git pull` tidak pernah menyentuh yang aktif, jadi kalau isinya beda, salah satu sisi punya perubahan yang belum ikut tersinkron:

```bash
for f in ask-on-git-push changelog-on-commit destructive-guard gitleaks-guard cache-guard claude-resume-on-sessionstart; do
  cmp -s ~/.claude/skills/hooks/$f.js ~/.claude/hooks/$f.js || echo "BEDA/TIDAK ADA: $f.js"
done
```

Untuk tiap file yang beda, `diff -u ~/.claude/skills/hooks/$f.js ~/.claude/hooks/$f.js` dulu. Kalau salinan **aktif** punya perubahan yang belum ada di repo, commit itu ke repo dulu; baru setelah itu salin dari repo ke folder aktif — jangan arah sebaliknya, supaya repo tetap sumber kebenarannya.

`claude-resume-on-precompact.ps1` dan `_lib.ps1` tidak ikut dicek di atas: keduanya milik ekstensi VSCode "Claude Notifier" yang terpisah, bukan bagian repo ini, dan tidak pernah tersinkron lewat `git pull`. Kalau mesin baru itu juga menjalankan ekstensi itu, bandingkan manual.

## 4. Setelah hook tersinkron

- Merge `hooks/settings.reference.json` ke `settings.json` mesin itu dengan tangan (atau tempel isinya ke Claude Code dan minta tolong di-merge).
- Pasang gitleaks kalau belum (`winget install --id Gitleaks.Gitleaks` di Windows) — tanpa itu `gitleaks-guard.js` fail-open.
- `node --test "$HOME/.claude/skills/hooks/_tests/*.test.js"` — harus 81 lolos.
- Restart Claude Code supaya `settings.json` dan hook baru benar-benar terbaca.
