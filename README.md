# V01D-SK11LZ

> Kumpulan skill untuk Claude Code — ekosistem agent untuk development yang terstruktur & efisien.

## Pasang

Claude Code otomatis membaca skill dari `~/.claude/skills`. Jadi cukup clone ke sana:

```powershell
git clone https://github.com/thevoidsyntax/V01D-SK11LZ.git $HOME\.claude\skills
```

Lalu **restart Claude Code**. Tidak ada installer — hanya clone.

> Kalau `~/.claude/skills` sudah ada tapi bukan clone repo ini, pindahkan dulu:
> `Rename-Item $HOME\.claude\skills skills.old` — lalu clone.

## Update & sync antar-mesin (git biasa)

```powershell
# ambil update terbaru
git -C $HOME\.claude\skills pull

# kirim perubahan
git -C $HOME\.claude\skills add -A
git -C $HOME\.claude\skills commit -m "update"
git -C $HOME\.claude\skills push
```

> Sekali per mesin: GitHub menolak push yang memuat email privat, jadi set email **noreply**:
>
> ```powershell
> git -C $HOME\.claude\skills config user.name  "thevoidsyntax"
> git -C $HOME\.claude\skills config user.email "323514556+thevoidsyntax@users.noreply.github.com"
> ```

## Isi (15 skill)

Tiap subfolder level atas = satu skill (berisi `SKILL.md`).

```text
/autor       Analisis proyek yang sudah ada (health check + rekomendasi)
/autor new   Mulai proyek baru (PRD → scaffold → deteksi stack → rekomendasi pipeline)
/autor release  Potong versi dari CHANGELOG (bump semver, catatan, tag, push)
/agents      Jalankan pipeline 6 persona (plan → design → code → QA → deploy → docs)

Persona:
/satria   Product Manager      → specs/PRD.md
/athena   System Architect     → specs/ADR.md, specs/contracts.*
/hexa     Feature Coder        → src/*, tests/*
/dina     QA + Security        → specs/AUDIT.md + STATUS (gate)
/frans    Platform & DevOps    → Dockerfile, migrations/*, ci.yml
/vika     Technical Writer     → docs/openapi.*, CHANGELOG.md, README

Pendukung:
/audit       Audit repo: tool dulu, review terarah, baseline inkremental (dipakai Dina)
/ponytail    Tulis kode sesedikit mungkin: cek perlu, yang sudah ada, stdlib, native; edit harus surgical
/tdd         Test-first: tulis test yang gagal dulu, catat bukti red → green
/anti-slop   Teks tanpa gaya AI: copy UI, dokumentasi, komentar
/impeccable  UI tanpa tampilan template AI: keputusan dari brief produk + checklist
/uicheck     Verifikasi UI di browser sungguhan: overflow 360px, error konsol, label input, house style, jalur keyboard dan fokus
/fool        Uji rencana sebelum dibangun: 5 mode (asumsi, kontra-argumen, failure mode, red team, audit bukti)
```

Tiap fase menambah satu entri ke `specs/HANDOFF.md` di proyek target: input, output, keputusan, isu terbuka, fase berikutnya. Vika menyusun CHANGELOG dan README dari log itu. Tiap fase juga memperbarui dokumen progres (`agents/progress.md`): posisi dan tabel pipeline di `specs/ROADMAP.md`, kartu `specs/RESUME.md`, baris `[Unreleased]`, dan baris status README, supaya posisi proyek terbaca dalam satu layar.

Cara `/agents` berjalan:

- **Rute.** Perubahan kecil tidak melewati 6 fase. Bugfix: Hexa → Dina. Infra: Frans → Dina. Upgrade dependensi atau framework: Frans → Hexa → Dina, jumlah test tidak boleh turun. Docs: Vika. Kode lama tanpa PRD, ADR, atau tes: Athena (legacy mode) → Hexa → Dina. Fitur baru skala PRIBADI: Hexa → Dina; Satria, Athena, Frans, dan Vika ikut hanya bila permintaan membutuhkannya. Uji banding pemendek URL: 6 fase $6.26, rute pendek satu prompt $1.10, keduanya 29/29 pada cek hitam-kotak.
- **Model.** Satria Opus; Vika Haiku; Athena, Hexa, Dina, Frans Sonnet effort high. Opus effort high hanya untuk putaran gate setelah Dina `REJECTED` dua kali. Rute dicetak sebelum mulai dan bisa diganti ("pipeline penuh", "mulai dari Athena").
- **Jeda.** Pipeline berhenti untuk persetujuanmu setelah fase desain: proyek PRIBADI setelah Athena, proyek KLIEN setelah Satria dan setelah Athena. Bilang "tanpa jeda" untuk melewatinya. Di luar jeda desain, pipeline berhenti di fase yang tidak hijau (test merah, jumlah test turun, keputusan terbuka, Dina `REJECTED`) dan menunggu Lanjut / Revisi / Stop; fase hijau lanjut sendiri dengan baris `[PROGRES]`.
- **Pass akhir.** Kalau Frans atau Vika ikut, Dina memeriksa hasil mereka (migration, Dockerfile, CI, OpenAPI) sebelum selesai.
- **Scope Hexa.** Hexa menulis baris `Files:` di entri HANDOFF, dan orchestrator membandingkannya dengan `git status` sebelum dan sesudah fase. Berkas yang berubah di luar daftar itu mengembalikan fase ke Hexa sebelum Dina. Di batch paralel, daftar file milik unit yang jadi acuan.
- **Docker.** Frans hanya memakai Docker kalau Docker Desktop sudah menyala. Kalau mati, verifikasi ditandai "not verified" di HANDOFF.
- **Commit.** Commit diusulkan di akhir dengan `Co-Authored-By: <persona>` dan baru dijalankan setelah kamu setuju. Push selalu minta approval.
- **Branch dan PR.** Di `main`/`master`, pipeline menawarkan branch `feat|fix|chore|docs/<slug>` sebelum mulai (proyek KLIEN wajib). Setelah commit, kamu bisa memilih push + PR: isi PR dari HANDOFF dan CHANGELOG, lalu `/code-review` dijalankan pada PR. Pipeline tidak pernah merge.
- **Roadmap.** Untuk produk besar, Satria memecahnya jadi epik: `specs/ROADMAP.md` berisi tabel epik, milestone, dependensi, dan status; tiap epik punya PRD sendiri di `specs/prd/<epic>.md`; `specs/PRD.md` jadi index produk plus penunjuk epik aktif. `/agents` mengerjakan satu epik per jalan (KLIEN: Athena → Hexa → Dina → Frans → Vika; PRIBADI: Hexa → Dina, persona lain hanya bila perlu; Satria dilewati karena PRD epik sudah ada), dan memperbarui tabel pipeline epik di roadmap setelah tiap fase serta menandai epik `done` setelah audit terakhir. Saat epik ditutup, entri HANDOFF epik itu pindah ke `specs/handoff/<epic>.md`, jadi `specs/HANDOFF.md` tidak membengkak tanpa batas. `/autor scan` dan `/autor status` melaporkan posisi dan pipeline itu.

Saat scaffold, `/autor new` membuat `CLAUDE.md` proyek (skala, stack, perintah, layout). Athena menambahkan konvensi dari ADR ke file itu, dan persona membaca konvensi stack dari sana.

## Bahasa

Semua artifact engineering ditulis dalam Bahasa Inggris: kode (identifier, komentar, nama file, kolom DB, enum, field API), PRD, ADR, HANDOFF, ROADMAP, RESUME, docs, commit message, dan isi PR. Copy UI mengikuti bahasa produk (`UI language:` di `CLAUDE.md` proyek); jawaban chat mengikuti bahasa user. Proyek lama tidak dirombak — kalau sebuah file sudah memakai bahasa lain, ikuti bahasa file itu.

Gate bahasa diukur, bukan hanya ditulis: `dina/eval.md` menjalankan Dina sendiri (bukan pipeline penuh) pada tiga fixture — paragraf prosa non-Inggris di `specs/*.md` harus ditolak, ejaan lama `UI: tidak` harus diterima, dan `specs/GLOSSARY.md` dengan istilah non-Inggris tidak boleh kena. Eval itu bisa dijalankan ulang dari repo: `dina/eval-fixture.sh` membangun fixture, `dina/eval-run.sh` menjalankan Dina lalu menilai laporannya, `dina/eval-verify.py` memberi verdict per kasus. Smoke test `/agents` punya builder-nya sendiri: `agents/smoke-fixture.sh` (varian `clean`, `planted`, `units`). Bangun fixture di luar `~/.claude/` — sandbox harness menolak tulis di sana.

## Prinsip kerja

Tiga prinsip yang menutup kebiasaan bawaan model, diturunkan dari [andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills):

- **Think before coding** — sebut asumsi, tawarkan interpretasi lain kalau ambigu, stop kalau tidak jelas (`/ponytail`).
- **Surgical changes** — hanya ubah yang diminta; jangan perbaiki kode sebelahnya, jangan refactor yang tidak rusak, ikut style yang ada (`/ponytail`).
- **Goal-driven** — sukses = terverifikasi; tulis langkah lalu cek dengan command (`/tdd`, gate pipeline).

`global-CLAUDE.md` di repo ini adalah snapshot dari `~/.claude/CLAUDE.md` (isi Master Rules, versi 9.6) sebagai jejak audit: file aslinya tinggal di luar repo, jadi kalau hilang atau di-restore dari backup, salinan ini yang jadi rujukan.

## Hooks user-level

Folder `hooks/` menyimpan tiga hook Claude Code yang berjalan di luar skill: `cache-guard.js` (menandai cache miss saat konteks besar atau model berganti), `ask-on-git-push.js` (menolak `git push` dengan opsi global), dan `changelog-on-commit.js` (menolak commit tanpa entri CHANGELOG). Bukan skill dan tidak dimuat otomatis — pasangnya manual ke `~/.claude/hooks/`, caranya di `hooks/README.md`.

### Kenapa hanya 15

Sebuah skill hanya dipertahankan kalau mengubah perilaku default model:

- **proses**: urutan persona, gate, kapan berhenti;
- **selera**: kode minimal, teks dan UI yang tidak berbau AI;
- **kemampuan yang tidak dimiliki model**: `/uicheck` menjalankan browser sungguhan, yang tidak bisa dilakukan model hanya dengan membaca markup.

Pengetahuan stack, security, testing, dan git sudah dikuasai model. Yang belum dikuasai adalah kebiasaannya: disiplin test-first, kode minimal, dan keputusan UI yang tidak berbau AI. Konvensi proyek ditaruh di `CLAUDE.md` dan ADR proyek itu sendiri. Pada 2026-10-21 repo dipangkas dari 139 skill: 73 belum pernah dipanggil, dan daftar skill yang terpotong membuat ~60 skill tampil tanpa deskripsi.

`/uicheck` menambah satu skill pada 2026-10-27, setelah pengukuran: `/impeccable` meminta halaman "bekerja di 360px tanpa scroll horizontal", dan itu fakta tentang render, bukan tentang markup. Pada 2026-10-28 flag `--taste` menambah pengukuran house style di render yang sama (type scale, eyebrow, hairline, gradient), jadi keputusan seleranya pun bisa diukur, bukan hanya diklaim.

Semua skill lama ada di tag `skills-v1-full`. Untuk memulihkan satu skill:

```powershell
git -C $HOME\.claude\skills checkout skills-v1-full -- react-pro
```
