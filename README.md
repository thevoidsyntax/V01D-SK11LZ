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

## Isi (12 skill)

Tiap subfolder level atas = satu skill (berisi `SKILL.md`).

```text
/autor       Analisis proyek yang sudah ada (health check + rekomendasi)
/autor new   Mulai proyek baru (PRD → scaffold → deteksi stack → rekomendasi pipeline)
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
/ponytail    Tulis kode sesedikit mungkin: cek perlu, yang sudah ada, stdlib, native
/anti-slop   Teks tanpa gaya AI: copy UI, dokumentasi, komentar
/impeccable  UI tanpa tampilan template AI: keputusan dari brief produk + checklist
```

Tiap fase menambah satu entri ke `specs/HANDOFF.md` di proyek target: input, output, keputusan, isu terbuka, fase berikutnya. Vika menyusun CHANGELOG dan README dari log itu.

Cara `/agents` berjalan:

- **Rute.** Perubahan kecil tidak melewati 6 fase. Bugfix: Hexa → Dina. Infra: Frans → Dina. Docs: Vika. Rute dicetak sebelum mulai dan bisa diganti ("pipeline penuh", "mulai dari Athena").
- **Jeda.** Pipeline berhenti untuk persetujuanmu setelah fase desain: proyek PRIBADI setelah Athena, proyek KLIEN setelah Satria dan setelah Athena. Bilang "tanpa jeda" untuk melewatinya.
- **Pass akhir.** Kalau Frans atau Vika ikut, Dina memeriksa hasil mereka (migration, Dockerfile, CI, OpenAPI) sebelum selesai.
- **Docker.** Frans hanya memakai Docker kalau Docker Desktop sudah menyala. Kalau mati, verifikasi ditandai "not verified" di HANDOFF.
- **Commit.** Commit diusulkan di akhir dengan `Co-Authored-By: <persona>` dan baru dijalankan setelah kamu setuju. Push selalu minta approval.
- **Branch dan PR.** Di `main`/`master`, pipeline menawarkan branch `feat|fix|chore|docs/<slug>` sebelum mulai (proyek KLIEN wajib). Setelah commit, kamu bisa memilih push + PR: isi PR dari HANDOFF dan CHANGELOG, lalu `/code-review` dijalankan pada PR. Pipeline tidak pernah merge.
- **Roadmap.** Untuk produk besar, Satria memecahnya jadi epik: `specs/ROADMAP.md` berisi tabel epik, milestone, dependensi, dan status; tiap epik punya PRD sendiri di `specs/prd/<epic>.md`; `specs/PRD.md` jadi index produk plus penunjuk epik aktif. `/agents` mengerjakan satu epik per jalan (rute Athena → Hexa → Dina → Frans → Vika, Satria dilewati karena PRD epik sudah ada), dan menandai epik `done` di roadmap setelah audit terakhir. `/autor scan` melaporkan progres roadmap.

Saat scaffold, `/autor new` membuat `CLAUDE.md` proyek (skala, stack, perintah, layout). Athena menambahkan konvensi dari ADR ke file itu, dan persona membaca konvensi stack dari sana.

### Kenapa hanya 12

Sebuah skill hanya dipertahankan kalau mengubah perilaku default model:

- **proses**: urutan persona, gate, kapan berhenti;
- **selera**: kode minimal, teks dan UI yang tidak berbau AI.

Pengetahuan stack, security, testing, dan git sudah dikuasai model. Konvensi proyek ditaruh di `CLAUDE.md` dan ADR proyek itu sendiri. Pada 2026-10-21 repo dipangkas dari 139 skill: 73 belum pernah dipanggil, dan daftar skill yang terpotong membuat ~60 skill tampil tanpa deskripsi.

Semua skill lama ada di tag `skills-v1-full`. Untuk memulihkan satu skill:

```powershell
git -C $HOME\.claude\skills checkout skills-v1-full -- react-pro
```
