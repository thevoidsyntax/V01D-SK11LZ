# V01D-SK11LZ — Panduan Claude Code

Repo ini adalah **ekosistem skill** untuk Claude Code (12 skill; tiap subfolder level atas berisi `SKILL.md`). Claude Code memuat skill ini otomatis dari `~/.claude/skills` — repo ini memang di-clone ke sana.

## Cara kerja

- **`autor`**: health scan proyek, wizard proyek baru, dan rekomendasi pipeline persona.
- **Mulai project**: `/autor new` → PRD (`/satria`, berhenti untuk approval) → scaffold → deteksi stack → rekomendasi pipeline. Scaffold dan deteksi dikerjakan autor sendiri, tanpa skill tambahan.
- **Pipeline 6 persona** (`/agents`): Satria (PM) → Athena (Architect) → Hexa (Coder) → Dina (QA/Security) → Frans (DevOps) → Vika (Writer). Tiap fase dijalankan sebagai **subagent dengan model sendiri** (Opus utk Athena/Dina; Sonnet utk Satria/Hexa/Frans; Haiku utk Vika) lewat Agent tool — persona tetap skill di repo, handoff via berkas artefak (`specs/*`, `src/*`, `docs/*`).
- **Handoff log**: tiap fase menambah entri ke `specs/HANDOFF.md` di proyek target; `/agents` memeriksa entri itu ada. Persona tidak pernah memanggil persona berikutnya sendiri — hanya `/agents` atau user.
- **Persona**: `/satria` (PM), `/athena` (System Architect), `/hexa` (Feature Coder), `/dina` (QA + Security), `/frans` (DevOps), `/vika` (Technical Writer).
- **Pendukung**: `/audit` (dipakai Dina), `/ponytail` (sebelum menulis kode), `/anti-slop` (teks), `/impeccable` (UI tanpa tampilan template AI; checklist dijalankan Hexa, buktinya dicek Dina).

## Konvensi repo

- **Aturan pertahankan:** skill baru hanya ditambah kalau mengubah perilaku default model (proses atau selera user). Pengetahuan stack/domain tidak dijadikan skill; konvensi proyek masuk `CLAUDE.md`/ADR proyek. Skill lama ada di tag `skills-v1-full` (`git checkout skills-v1-full -- <nama>`).
- Isi repo = skill + `README.md` + `CHANGELOG.md` + `CLAUDE.md`. **Tidak ada installer/skrip otomatis** — pasang = clone, sync = git biasa.
- Sebelum commit: `README.md`, `CLAUDE.md`, dan `CHANGELOG.md` sudah diperbarui sesuai perubahan.
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
