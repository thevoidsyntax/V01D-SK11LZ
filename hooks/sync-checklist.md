# Checklist sync ke mesin baru

Bukan skill, tidak dimuat Claude Code — referensi langkah seperti `settings.reference.json` di folder ini. Dipakai di **awal sesi di mesin lain** sebelum menyentuh apa pun, supaya jelas sisi mana yang boleh ditimpa (fast-forward) dan mana yang harus direkonsiliasi dulu. Perintah pasang/update dasar ada di `CLAUDE.md` bagian "Pasang & sync".

## 1. Baca state dulu, jangan ubah apa pun

Baris pertama `git status -sb` sudah bilang branch mana yang aktif dan tracking-nya — baca itu dulu sebelum lanjut, karena langkah 2 di bawah hanya berlaku untuk branch **ini sendiri** vs upstream-nya sendiri, bukan selalu `main`.

```bash
cd ~/.claude/skills
git status -sb
git stash list
git log --oneline -3
git fetch origin --prune --tags
BR=$(git branch --show-current)
git rev-list --left-right --count HEAD...origin/$BR   # "<lokal-saja> <remote-saja>" vs upstream BRANCH INI SENDIRI
git log --oneline origin/$BR..HEAD                      # commit yang belum sampai ke origin dari mesin ini
git log --oneline HEAD..origin/$BR                       # commit baru dari mesin lain yang belum ditarik, branch ini
git status --porcelain                                   # '??' = file/skill baru yang hanya ada di mesin ini
git diff --stat
git diff --ignore-cr-at-eol --stat                        # kosong = bedanya cuma EOL, bukan isi beneran
```

**Kalau `BR` bukan `main`**, baris-baris di atas sudah cukup untuk menilai branch ini sendiri. Untuk tahu seberapa jauh ketinggalan dari `main` (tanpa checkout, tanpa menyentuh WIP):

```bash
git rev-list --left-right --count HEAD...origin/main
```

Angka `<remote-saja>` di sini **wajar besar dan bukan sinyal masalah** — itu cuma histori `main` yang belum di-merge ke branch fitur ini, bukan divergensi yang perlu "diperbaiki" seperti pada tabel langkah 2 (tabel itu untuk kasus branch ini vs upstream-nya sendiri). Kalau mesin ini juga butuh hook/`permissions.deny` terbaru dari `main` sementara masih ada WIP belum commit di branch ini, lanjut ke bagian **3b**, bukan tabel di bawah.

## 2. Putuskan tindakan dari hasil di atas (branch ini vs upstream-nya sendiri)

| lokal-saja | worktree | tindakan |
|---|---|---|
| 0 | bersih | `git pull --ff-only` |
| 0 | cuma beda EOL | `git config core.autocrlf true`, lalu `git stash push -m eol`, `git pull --ff-only`, cek, `git stash drop` |
| 0 | ada isi nyata | baca `git diff` dulu, `git stash push -u -m pc-wip`, `git pull --ff-only`, `git stash pop`, selesaikan konflik, commit |
| > 0 | apa saja | `git branch backup/pc-$(date +%Y%m%d)` dulu, stash kalau kotor, `git rebase origin/main`, selesaikan konflik (`git diff --name-only --diff-filter=U`), jalankan skill `pre-commit-check`, lalu `git push` |

`git reset --hard`, clone ulang, atau menimpa folder secara manual **bukan langkah pertama** — itu hanya boleh dilakukan setelah isi unik mesin itu terbukti sudah ter-push atau sudah sengaja dibuang. Kalau `pull.ff only` belum pernah di-set di mesin ini (lihat blok "Sekali per mesin" di `CLAUDE.md`), pasang dulu supaya `pull` biasa tidak diam-diam membuat merge commit.

## 3. Lapisan di luar git: hook aktif vs sumber repo

`~/.claude/hooks/*.js` adalah salinan **aktif** yang benar-benar dijalankan Claude Code; `~/.claude/skills/hooks/*.js` adalah sumbernya di repo ini. `git pull` tidak pernah menyentuh yang aktif, jadi kalau isinya beda, salah satu sisi punya perubahan yang belum ikut tersinkron:

```bash
for f in $(cd ~/.claude/skills/hooks && ls *.js | sed "s/\.js$//"); do
  cmp -s ~/.claude/skills/hooks/$f.js ~/.claude/hooks/$f.js || echo "BEDA/TIDAK ADA: $f.js"
done
```

Untuk tiap file yang beda, `diff -u ~/.claude/skills/hooks/$f.js ~/.claude/hooks/$f.js` dulu. Kalau salinan **aktif** punya perubahan yang belum ada di repo, commit itu ke repo dulu; baru setelah itu salin dari repo ke folder aktif — jangan arah sebaliknya, supaya repo tetap sumber kebenarannya.

`claude-resume-on-precompact.ps1` dan `_lib.ps1` tidak ikut dicek di atas: keduanya milik ekstensi VSCode "Claude Notifier" yang terpisah, bukan bagian repo ini, dan tidak pernah tersinkron lewat `git pull`. Kalau mesin baru itu juga menjalankan ekstensi itu, bandingkan manual.

### 3b. Branch aktif bukan `main` dan ada WIP belum commit

Jangan `checkout main` kalau worktree-nya kotor — itu memaksa commit/stash WIP duluan padahal yang dibutuhkan cuma file hook dan `settings.reference.json` dari `main`, bukan `main` di-checkout. Pakai worktree sementara di luar `~/.claude/skills` supaya branch aktif dan WIP-nya tidak tersentuh sama sekali:

```bash
cd ~/.claude/skills
git worktree add ~/skills-main origin/main

for f in $(cd ~/skills-main/hooks && ls *.js | sed "s/\.js$//"); do
  cmp -s ~/skills-main/hooks/$f.js ~/.claude/hooks/$f.js || echo "BEDA/BARU: $f.js"
done
# untuk tiap yang BEDA (bukan cuma BARU): diff -u ~/.claude/hooks/$f.js ~/skills-main/hooks/$f.js dulu,
# dan kalau salinan aktif punya perubahan unik, bawa itu ke repo sebelum ditimpa.

for f in $(cd ~/skills-main/hooks && ls *.js | sed "s/\.js$//"); do
  cp ~/skills-main/hooks/$f.js ~/.claude/hooks/
done

cd ~/skills-main/hooks/_tests && node --test *.test.js   # harus 118 lolos
cd - >/dev/null

# merge ~/skills-main/hooks/settings.reference.json ke settings.json manual (lihat bagian 4)

git worktree remove ~/skills-main
git fetch origin main:main   # majukan main lokal tanpa checkout, tetap ff-only
```

Saat branch fitur ini nanti siap digabung: commit WIP dulu, baru `git merge origin/main` (jangan rebase kalau branch itu sudah di-push dan dipakai di lebih dari satu mesin — rebase berarti force-push).

## 4. Setelah hook tersinkron

- Merge `hooks/settings.reference.json` ke `settings.json` mesin itu dengan tangan (atau tempel isinya ke Claude Code dan minta tolong di-merge). Di Windows, tiap command hook pakai path absolut (`C:\\Users\\<kamu>\\.claude\\hooks\\...`), bukan `~/...`.
- Pasang gitleaks kalau belum (`winget install --id Gitleaks.Gitleaks` di Windows) — tanpa itu `gitleaks-guard.js` fail-open.
- Jalankan test dari dalam folder `_tests` dengan glob tak di-quote, bukan path ter-quote dari luar (path ter-quote diam-diam cocok 0 file, hasilnya "0 lolos" tanpa error): `cd ~/.claude/skills/hooks/_tests && node --test *.test.js`. Harus 118 lolos.
- Restart Claude Code supaya `settings.json` dan hook baru benar-benar terbaca.
