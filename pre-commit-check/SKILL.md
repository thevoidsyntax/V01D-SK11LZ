---
name: pre-commit-check
description: Checklist otomatis + manual sebelum commit ke repo skill V01D-SK11LZ (cek command fiktif, code fence bersarang, frontmatter tak dikenal, CHANGELOG, test uicheck, sub-command tanpa heading).
when_to_use: Use right before committing any change in this skill repo (V01D-SK11LZ) — folder tempat CLAUDE.md ini berada.
---

# Sebelum commit

Jalankan dari root repo; tidak boleh ada output selain baris `warning:` dari git:

```bash
# 1. setiap /nama = folder skill di repo ini atau perintah bawaan Claude Code
BUILTIN='code-review|security-review|simplify|init|review|loop|schedule|run|hooks|config|model|help|clear|compact|permissions|plugin|memory|context|login|logout|effort'
grep -ohE '(^|[ `("])/[a-z][a-z0-9-]+([` ,.:)"]|$)' */SKILL.md agents/*.md autor/*.md athena/*.md fool/*.md impeccable/*.md | sed -E 's/^[ `("]*\///; s/[` ,.:)"]*$//' | sort -u |
  while read -r n; do [ -d "$n" ] || echo "$n" | grep -qxE "$BUILTIN" || echo "unknown command: /$n"; done
# 2. tidak ada ``` di dalam blok ``` (pakai ~~~ untuk blok luar)
awk 'FNR==1{b=0;t=0} /^[[:space:]]*~~~/{t=!t;next} t{next} /^[[:space:]]*```/{ if(b && $0 ~ /```[A-Za-z]/) print FILENAME":"FNR": nested code fence"; b=!b }' */SKILL.md agents/*.md autor/*.md athena/*.md fool/*.md impeccable/*.md README.md CLAUDE.md
# 3. frontmatter hanya field yang dibaca Claude Code (version ditaruh di metadata.version)
OK='name|description|when_to_use|effort|metadata|argument-hint|arguments|disable-model-invocation|user-invocable|allowed-tools|disallowed-tools|model|context|agent|background|hooks|paths|shell|license|compatibility'
for f in */SKILL.md; do awk 'NR==1&&!/^---/{exit} NR>1&&/^---/{exit} NR>1&&/^[A-Za-z_-]+:/{sub(/:.*/,"");print}' "$f" | grep -vxE "$OK" | sed "s|^|$f: unknown frontmatter field |"; done
# 4. perubahan skill disertai entri CHANGELOG
git diff HEAD --name-only | grep -q 'SKILL.md' && ! git diff HEAD --name-only | grep -qx 'CHANGELOG.md' && echo "CHANGELOG.md not updated"
# 4b. test skrip uicheck (melewati dirinya sendiri kalau playwright tidak ada)
python -m unittest uicheck/scripts/test_check.py uicheck/scripts/test_taste_rules.py uicheck/scripts/test_a11y_rules.py >/dev/null 2>&1 || echo "uicheck tests failed"
# 5. setiap sub-perintah `/skill sub` punya heading sendiri di skill itu, mis. "### `/autor scan`"
grep -ohE '`/[a-z][a-z0-9-]+ [a-z][a-z0-9-]*' */SKILL.md README.md CLAUDE.md | tr -d '`' | sort -u |
  while read -r s sub; do n=${s#/}; [ -d "$n" ] || continue; grep -qE "^#+ .*\`/$n $sub\`" "$n/SKILL.md" || echo "unhandled sub-command: /$n $sub"; done
```

Lalu cek manual yang tidak bisa di-grep:

- `README.md` (daftar skill) dan bagian "Cara kerja" di `CLAUDE.md` masih sesuai isi skill.
- Sub-perintah ditulis dalam backtick (`` `/autor scan` ``) dan punya heading sendiri di skill-nya; cek 5 hanya melihat bentuk itu.
- Commit hanya setelah user setuju, dengan `Co-Authored-By: <persona>`.
- Skill **wajib** di `<nama>/SKILL.md` level atas (nama file persis `SKILL.md`). Claude Code tidak memuat folder bersarang seperti `kategori/<nama>/SKILL.md`; dulu 16 skill di `conditional/`, `docs/`, `system/` tidak pernah termuat karena ini.
- Bagian skill yang hanya dipakai pada kondisi tertentu (rute epik, push/PR, `/autor new`, `/autor release`) boleh dipindah ke berkas `.md` kedua di folder skill yang sama (daftarkan globnya di cek 1 dan 2); `SKILL.md` menyimpan headingnya (cek 5), aturan keras, dan perintah "Read … dan ikuti" yang eksplisit. Jangan pindahkan aturan yang berlaku di semua rute.
- Satu skill = satu folder. Jangan simpan salinan skill di folder lain (dulu `core/`, `agents/*-agent/`); salinan tidak dimuat dan cepat basi.
- Tiap skill punya `description` (apa skill-nya) + `when_to_use` (kapan dipakai, pola "Use when…"). Claude Code menampilkan keduanya di daftar skill dan memakainya untuk memilih skill otomatis — jaga keduanya akurat terhadap isi.
- Tidak ada GitHub Actions. Kalau suatu saat menambah workflow: pakai action resmi (`actions/*`) dan permissions seminimal mungkin. Dulu `changelog.yml` merujuk action dari akun yang tidak ada, dengan `contents: write`.
- Jangan commit `node_modules/` atau `synced/` (sudah di-`.gitignore`; `synced/` adalah folder sync milik Claude Code, bukan bagian pack ini).
