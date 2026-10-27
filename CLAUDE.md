# V01D-SK11LZ — Panduan Claude Code

Repo ini adalah **ekosistem skill** untuk Claude Code (14 skill; tiap subfolder level atas berisi `SKILL.md`). Claude Code memuat skill ini otomatis dari `~/.claude/skills` — repo ini memang di-clone ke sana.

## Cara kerja

- **`autor`**: health scan proyek, wizard proyek baru, dan rekomendasi pipeline persona.
- **Mulai project**: `/autor new` → PRD (`/satria`, berhenti untuk approval) → scaffold → deteksi stack → rekomendasi pipeline. Scaffold dan deteksi dikerjakan autor sendiri, tanpa skill tambahan.
- **Pipeline 6 persona** (`/agents`): Satria (PM) → Athena (Architect) → Hexa (Coder) → Dina (QA/Security) → Frans (DevOps) → Vika (Writer). Tiap fase dijalankan sebagai **subagent dengan model sendiri** (Opus utk Athena; Sonnet utk Satria/Hexa/Frans/Dina; Haiku utk Vika) lewat Agent tool — persona tetap skill di repo, handoff via berkas artefak (`specs/*`, `src/*`, `docs/*`). Dina naik ke Opus untuk kode concurrency/uang/auth dan untuk putaran setelah `REJECTED`.
- **Rute**: `/agents` memilih rute terpendek (fitur baru = 6 fase; bugfix = Hexa → Dina; infra = Frans → Dina; docs = Vika; epic roadmap = Athena → Hexa → Dina → Frans → Vika) dan mencetaknya sebelum mulai. Kode berubah → Dina selalu ikut.
- **Jeda & commit**: berhenti untuk approval user setelah fase desain (PRIBADI: setelah Athena; KLIEN: setelah Satria dan Athena), pass akhir Dina atas hasil Frans/Vika, lalu commit hanya setelah user setuju. Di `main`/`master` rute bertanya branch dulu (KLIEN wajib branch); setelah commit `/agents` menawarkan push + PR (`/code-review` pada PR, tanpa merge otomatis). Push selalu minta approval (hook global).
- **CHANGELOG**: rute tanpa Vika tetap menulis baris `[Unreleased]` dari HANDOFF.
- **Hooks user-level**: `cache-guard.js`, `ask-on-git-push.js`, dan `changelog-on-commit.js` ada di `hooks/` (sumber, bukan skill). Hook global `changelog-on-commit` **menolak** (deny, berlaku juga di auto mode) commit `feat`/`fix`/breaking, tanpa tipe, atau yang menyentuh Dockerfile/compose/`migrations/` tidak menyertakan `CHANGELOG.md` (di repo yang punya CHANGELOG); `SKIP_CHANGELOG=1` hanya setelah user setuju. `docs`/`test`/`chore`/`ci` dikecualikan. Hook push menolak push yang memakai opsi global git (`-C`, `-c`) supaya ask rule `git push` selalu menanyai user.
- **Handoff log**: tiap fase menambah entri ke `specs/HANDOFF.md` di proyek target; `/agents` memeriksa entri itu ada. Persona tidak pernah memanggil persona berikutnya sendiri — hanya `/agents` atau user.
- **Roadmap mode**: untuk produk besar Satria memecahnya jadi epik — `specs/ROADMAP.md` (tabel epik, milestone, dependensi, status), satu PRD per epik di `specs/prd/<epic>.md`, dan `specs/PRD.md` jadi index produk. `/agents` mengerjakan satu epik per jalan (Satria dilewati, PRD epik sudah ada) dan menandai epik `done` setelah audit terakhir; `/autor scan` melaporkan progres roadmap. Tanpa roadmap, `specs/PRD.md` tetap PRD penuh seperti sebelumnya.
- **Release**: `/autor release` memotong blok `[Unreleased]` jadi versi baru — bump semver dari commit sejak tag `v*` terakhir, catatan rollback wajib, tag `v<x.y.z>`, lalu push. Setiap langkah yang menulis/menag/push minta approval.
- **`CLAUDE.md` proyek**: dibuat saat scaffold (`Scale:`, stack, perintah, layout); Athena menambah bagian Conventions dari ADR. Persona membaca konvensi stack dari sana.
- **Persona**: `/satria` (PM), `/athena` (System Architect), `/hexa` (Feature Coder), `/dina` (QA + Security), `/frans` (DevOps), `/vika` (Technical Writer).
- **Pendukung**: `/audit` (dipakai Dina), `/ponytail` (sebelum menulis kode), `/tdd` (test-first: test yang gagal ditulis lebih dulu; checklist dijalankan Hexa, buktinya dicek Dina), `/anti-slop` (teks), `/impeccable` (UI tanpa tampilan template AI; checklist dijalankan Hexa, buktinya dicek Dina), `/uicheck` (UI dirender di browser sungguhan: overflow 360px, error konsol, label input, alt gambar; baris `uicheck:` di HANDOFF dicek Dina).

## Konvensi repo

- **Aturan pertahankan:** skill baru hanya ditambah kalau mengubah perilaku default model (proses atau selera user). Pengetahuan stack/domain tidak dijadikan skill; konvensi proyek masuk `CLAUDE.md`/ADR proyek. Skill lama ada di tag `skills-v1-full` (`git checkout skills-v1-full -- <nama>`).
- Isi repo = skill + `README.md` + `CHANGELOG.md` + `CLAUDE.md` + `hooks/`. **Tidak ada installer/skrip otomatis** — pasang = clone, sync = git biasa. Folder `hooks/` hanya menyimpan sumber hook user-level (bukan skill, tidak dimuat Claude Code) supaya tidak hilang; pasangnya manual ke `~/.claude/hooks/`.
- Skill yang diambil dari repo luar ditulis ulang sampai mandiri: tidak boleh membawa perintah, sub-perintah (`/x init`), skrip, atau rujukan skill yang tidak ada di repo ini. Dulu `impeccable`, `ponytail`, dan `anti-slop` membawa perintah fiktif seperti itu.

## Sebelum commit

Jalankan dari root repo; tidak boleh ada output selain baris `warning:` dari git:

```bash
# 1. setiap /nama = folder skill di repo ini atau perintah bawaan Claude Code
BUILTIN='code-review|security-review|simplify|init|review|loop|schedule|run|hooks|config|model|help|clear|compact|permissions|plugin|memory|context|login|logout|effort'
grep -ohE '(^|[ `("])/[a-z][a-z0-9-]+([` ,.:)"]|$)' */SKILL.md | sed -E 's/^[ `("]*\///; s/[` ,.:)"]*$//' | sort -u |
  while read -r n; do [ -d "$n" ] || echo "$n" | grep -qxE "$BUILTIN" || echo "unknown command: /$n"; done
# 2. tidak ada ``` di dalam blok ``` (pakai ~~~ untuk blok luar)
awk 'FNR==1{b=0;t=0} /^[[:space:]]*~~~/{t=!t;next} t{next} /^[[:space:]]*```/{ if(b && $0 ~ /```[A-Za-z]/) print FILENAME":"FNR": nested code fence"; b=!b }' */SKILL.md README.md CLAUDE.md
# 3. frontmatter hanya field yang dibaca Claude Code (version ditaruh di metadata.version)
OK='name|description|when_to_use|effort|metadata|argument-hint|arguments|disable-model-invocation|user-invocable|allowed-tools|disallowed-tools|model|context|agent|background|hooks|paths|shell|license|compatibility'
for f in */SKILL.md; do awk 'NR==1&&!/^---/{exit} NR>1&&/^---/{exit} NR>1&&/^[A-Za-z_-]+:/{sub(/:.*/,"");print}' "$f" | grep -vxE "$OK" | sed "s|^|$f: unknown frontmatter field |"; done
# 4. perubahan skill disertai entri CHANGELOG
git diff HEAD --name-only | grep -q 'SKILL.md' && ! git diff HEAD --name-only | grep -qx 'CHANGELOG.md' && echo "CHANGELOG.md not updated"
# 4b. test skrip uicheck (melewati dirinya sendiri kalau playwright tidak ada)
python -m unittest uicheck/scripts/test_check.py >/dev/null 2>&1 || echo "uicheck tests failed"
# 5. setiap sub-perintah `/skill sub` punya heading sendiri di skill itu, mis. "### `/autor scan`"
grep -ohE '`/[a-z][a-z0-9-]+ [a-z][a-z0-9-]*' */SKILL.md README.md CLAUDE.md | tr -d '`' | sort -u |
  while read -r s sub; do n=${s#/}; [ -d "$n" ] || continue; grep -qE "^#+ .*\`/$n $sub\`" "$n/SKILL.md" || echo "unhandled sub-command: /$n $sub"; done
```

Lalu cek manual yang tidak bisa di-grep:

- `README.md` (daftar skill) dan bagian "Cara kerja" di file ini masih sesuai isi skill.
- Sub-perintah ditulis dalam backtick (`` `/autor scan` ``) dan punya heading sendiri di skill-nya; cek 5 hanya melihat bentuk itu.
- Commit hanya setelah user setuju, dengan `Co-Authored-By: <persona>`.
- Skill **wajib** di `<nama>/SKILL.md` level atas (nama file persis `SKILL.md`). Claude Code tidak memuat folder bersarang seperti `kategori/<nama>/SKILL.md`; dulu 16 skill di `conditional/`, `docs/`, `system/` tidak pernah termuat karena ini.
- Satu skill = satu folder. Jangan simpan salinan skill di folder lain (dulu `core/`, `agents/*-agent/`); salinan tidak dimuat dan cepat basi.
- Tiap skill punya `description` (apa skill-nya) + `when_to_use` (kapan dipakai, pola "Use when…"). Claude Code menampilkan keduanya di daftar skill dan memakainya untuk memilih skill otomatis — jaga keduanya akurat terhadap isi.
- Tidak ada GitHub Actions. Kalau suatu saat menambah workflow: pakai action resmi (`actions/*`) dan permissions seminimal mungkin. Dulu `changelog.yml` merujuk action dari akun yang tidak ada, dengan `contents: write`.
- Jangan commit `node_modules/` atau `synced/` (sudah di-`.gitignore`; `synced/` adalah folder sync milik Claude Code, bukan bagian pack ini).

## Git Commits

- Pakai Conventional Commits: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:`
- Akhiri dengan: `Co-Authored-By: <persona-active>`
- Ganti `<persona-active>` dengan persona yang sedang bekerja (Satria/Athena/Hexa/Dina/Frans/Vika)

**Template commit:**

```text
<subject>

<body>

Co-Authored-By: [PERSONA]
```

## Pasang & sync (git biasa)

```bash
# pasang di mesin baru, lalu restart Claude Code
git clone https://github.com/thevoidsyntax/V01D-SK11LZ.git $HOME/.claude/skills

# update dari mesin lain
git -C $HOME/.claude/skills pull

# kirim perubahan
git -C $HOME/.claude/skills add -A
git -C $HOME/.claude/skills commit -m "update"
git -C $HOME/.claude/skills push
```

Sekali per mesin (agar push tidak ditolak GitHub karena email privat):

```bash
git -C $HOME/.claude/skills config user.name  "thevoidsyntax"
git -C $HOME/.claude/skills config user.email "323514556+thevoidsyntax@users.noreply.github.com"
```
