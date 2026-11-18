# V01D-SK11LZ — Panduan Claude Code

Repo ini adalah **ekosistem skill** untuk Claude Code (15 skill; tiap subfolder level atas berisi `SKILL.md`). Claude Code memuat skill ini otomatis dari `~/.claude/skills` — repo ini memang di-clone ke sana.

## Cara kerja

- **`autor`**: health scan proyek, wizard proyek baru, dan rekomendasi pipeline persona.
- **Mulai project**: `/autor new` → PRD (`/satria`, berhenti untuk approval) → scaffold → deteksi stack → rekomendasi pipeline. Scaffold dan deteksi dikerjakan autor sendiri, tanpa skill tambahan.
- **Pipeline 6 persona** (`/agents`): Satria (PM) → Athena (Architect) → Hexa (Coder) → Dina (QA/Security) → Frans (DevOps) → Vika (Writer). Tiap fase dijalankan sebagai **subagent dengan model sendiri** (Opus utk Satria; Haiku utk Vika; Athena/Hexa/Dina/Frans Sonnet dengan effort high) lewat Agent tool — persona tetap skill di repo, handoff via berkas artefak (`specs/*`, `src/*`, `docs/*`). Satu-satunya eskalasi ke Opus: setelah Dina `REJECTED` dua kali, putaran berikutnya (Hexa + Dina) memakai Opus effort high.
- **Rute**: `/agents` memilih rute terpendek (fitur baru KLIEN = 6 fase; fitur baru PRIBADI = Hexa → Dina, persona lain hanya bila perlu atau diminta; bugfix = Hexa → Dina; kode lama tanpa spec = Athena (legacy mode) → Hexa → Dina; infra = Frans → Dina; upgrade dependensi/framework = Frans → Hexa → Dina; docs = Vika; epic roadmap KLIEN = Athena → Hexa → Dina → Frans → Vika, PRIBADI = Hexa → Dina) dan mencetaknya sebelum mulai. Kode berubah → Dina selalu ikut.
- **Jeda & commit**: berhenti untuk approval user setelah fase desain (PRIBADI: setelah Athena; KLIEN: setelah Satria dan Athena) dan di tiap fase yang tidak hijau (test merah, jumlah test turun, keputusan terbuka, Dina `REJECTED`; fase hijau lanjut sendiri dan mencetak `[PROGRES]`), pass akhir Dina atas hasil Frans/Vika, lalu commit hanya setelah user setuju. Di `main`/`master` rute bertanya branch dulu (KLIEN wajib branch); setelah commit `/agents` menawarkan push + PR (`/code-review` pada PR, tanpa merge otomatis). Push selalu minta approval (hook global).
- **CHANGELOG**: rute tanpa Vika tetap menulis baris `[Unreleased]` dari HANDOFF.
- **Hooks user-level**: `cache-guard.js`, `ask-on-git-push.js`, dan `changelog-on-commit.js` ada di `hooks/` (sumber, bukan skill). Hook global `changelog-on-commit` **menolak** (deny, berlaku juga di auto mode) commit `feat`/`fix`/breaking, tanpa tipe, atau yang menyentuh Dockerfile/compose/`migrations/` tidak menyertakan `CHANGELOG.md` (di repo yang punya CHANGELOG); `SKIP_CHANGELOG=1` hanya setelah user setuju. `docs`/`test`/`chore`/`ci` dikecualikan. Hook push menolak push yang memakai opsi global git (`-C`, `-c`) supaya ask rule `git push` selalu menanyai user. Hook `ask-on-git-push` dan `changelog-on-commit` dipasang sebagai matcher `Bash` **dan** `PowerShell`; persetujuan push datang dari aturan `permissions.ask` (`Bash(git push *)`, `PowerShell(git push *)`), bukan dari hook.
- **Scope Hexa**: entri HANDOFF Hexa membawa baris `Files:`; orchestrator membandingkan baris itu dengan `git status` sebelum dan sesudah fase — berkas yang berubah di luar daftar mengembalikan fase ke Hexa sebelum Dina. Di batch paralel, daftar file milik unit yang jadi acuan (satu mekanisme, tidak dua).
- **Handoff log**: tiap fase menambah entri ke `specs/HANDOFF.md` di proyek target; `/agents` memeriksa entri itu ada. Persona tidak pernah memanggil persona berikutnya sendiri — hanya `/agents` atau user. Tiap fase juga memperbarui dokumen progres lewat `agents/progress.md` (posisi dan tabel pipeline di `specs/ROADMAP.md`, kartu `specs/RESUME.md`, baris `[Unreleased]`, baris status README), supaya posisi proyek terbaca tanpa membaca seluruh log.
- **Roadmap mode**: untuk produk besar Satria memecahnya jadi epik — `specs/ROADMAP.md` (tabel epik, milestone, dependensi, status), satu PRD per epik di `specs/prd/<epic>.md`, dan `specs/PRD.md` jadi index produk. `/agents` mengerjakan satu epik per jalan (Satria dilewati, PRD epik sudah ada) dan memperbarui tabel pipeline epik di ROADMAP setelah tiap fase serta menandai epik `done` setelah audit terakhir; saat epik ditutup, entri HANDOFF epik itu dipindahkan ke `specs/handoff/<epic>.md` supaya `specs/HANDOFF.md` hanya memuat epik yang sedang berjalan. `/autor scan` dan `/autor status` melaporkan posisi dan pipeline itu, dan menandai DEFICIENT epik `done` yang entri HANDOFF-nya belum diarsipkan. Tanpa roadmap, `specs/PRD.md` tetap PRD penuh seperti sebelumnya.
- **Release**: `/autor release` memotong blok `[Unreleased]` jadi versi baru — bump semver dari commit sejak tag `v*` terakhir, catatan rollback wajib, tag `v<x.y.z>`, lalu push. Setiap langkah yang menulis/menag/push minta approval.
- **`CLAUDE.md` proyek**: dibuat saat scaffold (`Scale:`, stack, perintah, layout); Athena menambah bagian Conventions dari ADR. Persona membaca konvensi stack dari sana.
- **Persona**: `/satria` (PM), `/athena` (System Architect), `/hexa` (Feature Coder), `/dina` (QA + Security), `/frans` (DevOps), `/vika` (Technical Writer).
- **Pendukung**: `/audit` (dipakai Dina), `/ponytail` (sebelum menulis kode), `/tdd` (test-first: test yang gagal ditulis lebih dulu; checklist dijalankan Hexa, buktinya dicek Dina), `/anti-slop` (teks), `/impeccable` (UI tanpa tampilan template AI; checklist dijalankan Hexa, buktinya dicek Dina), `/uicheck` (UI dirender di browser sungguhan: overflow 360px, error konsol, label input, alt gambar, house style, dan dengan `--a11y` jalur Tab serta fokus terlihat; baris `uicheck:` dan `a11y:` di HANDOFF dicek Dina), `/fool` (menguji rencana/desain sebelum dibangun: 5 mode, tidak memblokir, tidak menulis ke proyek; bisa dipakai di jeda desain `/agents`).

- **Bahasa artifact**: semua artefak engineering yang ditulis skill ke proyek target (PRD, ADR, HANDOFF, ROADMAP, RESUME, docs, commit message, isi PR) dalam Bahasa Inggris; copy UI mengikuti `UI language:` proyek. Token yang bocor ke artifact (blok posisi ROADMAP, marker `UI: yes|no`, blok `[ROUTE]`, heading body PR) sudah dibersihkan. Proyek lama tidak dirombak: kalau sebuah file sudah memakai bahasa lain, ikuti bahasa file itu. Dokumen repo ini sendiri tetap Bahasa Indonesia. Gate bahasa diukur di `dina/eval.md` (tiga fixture, headless), bukan hanya ditulis — dan eval itu bisa dijalankan ulang dari repo: `dina/eval-fixture.sh` (membangun fixture), `dina/eval-run.sh` (menjalankan Dina lalu menilai), `dina/eval-verify.py` (skor per kasus). Fixture harus dibangun di luar `~/.claude/`: sandbox harness menolak tulis di sana dan persona akan mengulang sampai budget habis.
- **Smoke test `/agents` punya builder fixture**: `agents/smoke-fixture.sh` (varian `clean`, `planted`, `units`) membangun fixture yang `agents/smoke-test.md` pakai, jadi tidak perlu menulis ulang dari prosa. Sama seperti eval bahasa, bangun di luar `~/.claude/`.
- **Prinsip kerja** (dari `andrej-karpathy-skills`, MIT): think before coding (sebut asumsi, stop kalau ambigu), surgical changes (hanya ubah yang diminta, jangan perbaiki kode sebelahnya), goal-driven (sukses = terverifikasi). Prinsip lengkap ada di `/ponytail` dan global `CLAUDE.md` §1.

## Konvensi repo

- **Aturan pertahankan:** skill baru hanya ditambah kalau mengubah perilaku default model (proses atau selera user). Pengetahuan stack/domain tidak dijadikan skill; konvensi proyek masuk `CLAUDE.md`/ADR proyek. Skill lama ada di tag `skills-v1-full` (`git checkout skills-v1-full -- <nama>`).
- Isi repo = skill + `README.md` + `CHANGELOG.md` + `CLAUDE.md` + `global-CLAUDE.md` + `hooks/`. **Tidak ada installer/skrip otomatis** — pasang = clone, sync = git biasa. Folder `hooks/` hanya menyimpan sumber hook user-level (bukan skill, tidak dimuat Claude Code) supaya tidak hilang; pasangnya manual ke `~/.claude/hooks/`.
- **`global-CLAUDE.md`**: snapshot dari `~/.claude/CLAUDE.md` (user-level, di luar repo) sebagai jejak audit. File yang hidup tetap di luar repo; kalau hilang atau di-restore dari backup, salinan ini yang jadi rujukan. Perubahan pada file user-level harus disalin ke sini dalam commit yang sama.
- Skill yang diambil dari repo luar ditulis ulang sampai mandiri: tidak boleh membawa perintah, sub-perintah (`/x init`), skrip, atau rujukan skill yang tidak ada di repo ini. Dulu `impeccable`, `ponytail`, dan `anti-slop` membawa perintah fiktif seperti itu.
- **Graphify** (https://github.com/Graphify-Labs/graphify) adalah alat lokal pihak ketiga, dipasang di luar repo ini (`uv tool install graphifyy` + `graphify install`, skill global di `~/.claude/skills/graphify/`). Folder `graphify/` ada di `.gitignore` supaya tidak ikut git, dan `/graphify` masuk daftar `BUILTIN` di cek 1 karena perintahnya ada di mesin, bukan di repo. Athena, Hexa, dan `/autor scan` memakainya hanya bila proyek punya `graphify-out/graph.json`; tanpa itu dilewati dan tidak pernah membangun graf sendiri.

## Sebelum commit

Checklist lengkap (grep/awk otomatis + cek manual) ada di skill `pre-commit-check` (`pre-commit-check/SKILL.md`) — jalankan itu sebelum tiap commit ke repo ini, bukan di sini supaya tidak selalu termuat.

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

Prosedur lengkap kalau mesin itu sudah punya commit/perubahan lokal sendiri (cek diagnostik read-only, tabel keputusan overwrite/merge, cek hook aktif vs sumber repo) ada di `hooks/sync-checklist.md`.

```bash
# pasang di mesin baru, lalu restart Claude Code
git clone https://github.com/thevoidsyntax/V01D-SK11LZ.git $HOME/.claude/skills

# update dari mesin lain
git -C $HOME/.claude/skills pull --ff-only

# kirim perubahan (push lewat -C ditolak oleh hook ask-on-git-push.js sendiri, jadi cd dulu)
git -C $HOME/.claude/skills add -A
git -C $HOME/.claude/skills commit -m "update"
cd $HOME/.claude/skills && git push
```

Sekali per mesin (agar push tidak ditolak GitHub karena email privat, dan `pull` tidak diam-diam membuat merge commit kalau sudah divergen):

```bash
git -C $HOME/.claude/skills config user.name  "thevoidsyntax"
git -C $HOME/.claude/skills config user.email "323514556+thevoidsyntax@users.noreply.github.com"
git -C $HOME/.claude/skills config pull.ff only
```
