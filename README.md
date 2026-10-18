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

## Opsional — plugin claude-mem (memory)

Bukan bagian dari skill; pasang sekali per mesin kalau ingin fitur memory (butuh `bun`):

```powershell
npm install -g bun
claude plugin marketplace add thedotmack/claude-mem --scope user
claude plugin install claude-mem@thedotmack --scope user -y
claude plugin update claude-mem@thedotmack
```

## Isi

Tiap subfolder level atas = satu skill (berisi `SKILL.md`), kecuali `infrastructure/` (kode referensi TypeScript, bukan skill). Beberapa pintasan:

```
/autor      Analisis proyek, auto-load skill inti
/satria     Project Manager   /athena  Software Engineer
/dina       QA + Security      /frans   DevOps
```

Lihat tiap folder untuk detail skill-nya.
