# V01D-SK11LZ — Panduan Claude Code

Repo ini adalah **ekosistem skill** untuk Claude Code (137 skill; tiap subfolder level atas berisi `SKILL.md`, kecuali `infrastructure/`). Claude Code memuat skill ini otomatis dari `~/.claude/skills` — repo ini memang di-clone ke sana.

## Cara kerja

- **`autor`** auto-invoke (selalu aktif): mendeteksi konteks proyek lalu memuat skill & persona yang relevan.
- **Mulai project**: `/autor new` menjalankan urutan nyata — rencana (`/satria`) → scaffold (`/project-init`) → deteksi stack (`/analyze-project`, memuat skill tech-stack & conditional) → build (`/athena`) → QA (`/dina`) → deploy (`/frans`).
- **Persona**: `/satria` (PM), `/athena` (Software Engineer), `/dina` (QA + Security), `/frans` (DevOps).
- Skill lain dipanggil lewat nama foldernya (mis. `/git`, `/security`, `/testing`, `/anti-slop`, `/ponytail`).

## Konvensi repo

- Isi repo = skill + `README.md` + `CHANGELOG.md`. **Tidak ada installer/skrip otomatis** — pasang = clone, sync = git biasa.
- Skill **wajib** di `<nama>/SKILL.md` level atas (nama file persis `SKILL.md`). Claude Code tidak memuat folder bersarang seperti `kategori/<nama>/SKILL.md`; dulu 16 skill di `conditional/`, `docs/`, `system/` tidak pernah termuat karena ini.
- Satu skill = satu folder. Jangan simpan salinan skill di folder lain (dulu `core/`, `agents/*-agent/`); salinan tidak dimuat dan cepat basi.
- `infrastructure/` satu-satunya folder non-skill.
- Tiap skill punya `description` (apa skill-nya) + `when_to_use` (kapan dipakai, pola "Use when…"). Claude Code menampilkan keduanya di daftar skill dan memakainya untuk memilih skill otomatis — jaga keduanya akurat terhadap isi.
- Tidak ada GitHub Actions. Kalau suatu saat menambah workflow: pakai action resmi (`actions/*`) dan permissions seminimal mungkin. Dulu `changelog.yml` merujuk action dari akun yang tidak ada, dengan `contents: write`.
- Jangan commit `node_modules/` atau `synced/` (sudah di-`.gitignore`; `synced/` adalah folder sync milik Claude Code, bukan bagian pack ini).
- `infrastructure/auto-router` memuat kode TypeScript sebagai referensi; dependensinya tidak di-commit. Jalankan `npm install` di folder itu hanya bila ingin mengeksekusi TS-nya — pemakaian skill normal tidak memerlukannya.

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

## Opsional — plugin claude-mem (memory)

Bukan bagian dari skill; pasang sekali per mesin bila ingin fitur memory (butuh `bun`):

```bash
npm install -g bun
claude plugin marketplace add thedotmack/claude-mem --scope user
claude plugin install claude-mem@thedotmack --scope user -y
claude plugin update claude-mem@thedotmack
```
