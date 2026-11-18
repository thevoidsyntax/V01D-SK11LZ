---
name: pre-commit-check
description: Checklist otomatis + manual sebelum commit ke repo skill V01D-SK11LZ (cek command fiktif, code fence bersarang, frontmatter tak dikenal, CHANGELOG, test uicheck, sub-command tanpa heading).
when_to_use: Use right before committing any change in this skill repo (V01D-SK11LZ) — folder tempat CLAUDE.md ini berada.
---

# Sebelum commit

Jalankan dari root repo; tidak boleh ada output selain baris `warning:` dari git:

```bash
# cek hanya file yang di-track: folder lokal yang di-ignore (graphify/, synced/) bukan bagian repo ini
FILES=$(git ls-files '*/SKILL.md' 'agents/*.md' 'autor/*.md' 'athena/*.md' 'dina/*.md' 'fool/*.md' 'impeccable/*.md' 'agents/*.sh' 'dina/*.sh' 'dina/*.py')
# 1. setiap /<nama> = folder skill di repo ini atau perintah bawaan Claude Code
# graphify = alat lokal pihak ketiga, skill-nya di ~/.claude/skills/graphify/ (diabaikan git), bukan di repo ini
BUILTIN='code-review|security-review|simplify|init|review|loop|schedule|run|hooks|config|model|help|clear|compact|permissions|plugin|memory|context|login|logout|effort|graphify'
grep -ohE '(^|[ `("])/[a-z][a-z0-9-]+([` ,.:)"]|$)' $FILES | sed -E 's/^[ `("]*\///; s/[` ,.:)"]*$//' | sort -u |
  while read -r n; do [ -d "$n" ] || echo "$n" | grep -qxE "$BUILTIN" || echo "unknown command: /$n"; done
# 2. tidak ada ``` di dalam blok ``` (pakai ~~~ untuk blok luar)
awk 'FNR==1{b=0;t=0} /^[[:space:]]*~~~/{t=!t;next} t{next} /^[[:space:]]*```/{ if(b && $0 ~ /```[A-Za-z]/) print FILENAME":"FNR": nested code fence"; b=!b }' $FILES README.md CLAUDE.md global-CLAUDE.md
# 3. frontmatter hanya field yang dibaca Claude Code (version ditaruh di metadata.version)
OK='name|description|when_to_use|effort|metadata|argument-hint|arguments|disable-model-invocation|user-invocable|allowed-tools|disallowed-tools|model|context|agent|background|hooks|paths|shell|license|compatibility'
for f in $(git ls-files '*/SKILL.md'); do awk 'NR==1&&!/^---/{exit} NR>1&&/^---/{exit} NR>1&&/^[A-Za-z_-]+:/{sub(/:.*/,"");print}' "$f" | grep -vxE "$OK" | sed "s|^|$f: unknown frontmatter field |"; done
# 4. perubahan skill disertai entri CHANGELOG
git diff HEAD --name-only | grep -q 'SKILL.md' && ! git diff HEAD --name-only | grep -qx 'CHANGELOG.md' && echo "CHANGELOG.md not updated"
# 4b. test skrip uicheck (melewati dirinya sendiri kalau playwright tidak ada)
python -m unittest uicheck/scripts/test_check.py uicheck/scripts/test_taste_rules.py uicheck/scripts/test_a11y_rules.py >/dev/null 2>&1 || echo "uicheck tests failed"
# 5. setiap sub-perintah `/<skill> <sub>` punya heading sendiri di skill itu, mis. "### `/autor scan`"
grep -ohE '`/[a-z][a-z0-9-]+ [a-z][a-z0-9-]*' $FILES README.md CLAUDE.md global-CLAUDE.md | tr -d '`' | sort -u |
  while read -r s sub; do n=${s#/}; [ -d "$n" ] || continue; grep -qE "^#+ .*\`/$n $sub\`" "$n/SKILL.md" || echo "unhandled sub-command: /$n $sub"; done
# 6. global-CLAUDE.md harus sama dengan file user-level ~/.claude/CLAUDE.md (hanya repo ini; dilewati kalau file live tidak ada)
LIVE="$HOME/.claude/CLAUDE.md"
if [ -f "$LIVE" ]; then
  trim() { awk '{ if ($0 ~ /[^[:space:]]/) buf[++n]=$0 } END { s=1; for(i=1;i<=n;i++) if (buf[i] ~ /[^[:space:]]/) { s=i; break } for(i=s;i<=n;i++) print buf[i] }'; }
  body() { awk 'BEGIN{started=0} { if (!started && /^\*\*/) started=1; if (started) print }'; }
  SNAP=$(body < global-CLAUDE.md | tr -d '\r' | trim)
  CUR=$(awk '/^# graphify/{exit} {print}' "$LIVE" | tr -d '\r' | body | trim)
  [ "$SNAP" = "$CUR" ] || echo "global-CLAUDE.md differs from $LIVE - mirror the change into global-CLAUDE.md in the same commit"
else
  echo "warning: $LIVE not found - global-CLAUDE.md drift check skipped"
fi
# 7. skrip di folder skill harus sintaksnya benar (shell dan python)
for f in $(git ls-files 'agents/*.sh' 'dina/*.sh'); do bash -n "$f" || echo "$f: shell syntax error"; done
for f in $(git ls-files 'dina/*.py'); do python -c 'import ast,sys;ast.parse(open(sys.argv[1],encoding="utf-8").read())' "$f" || echo "$f: python syntax error"; done
```

Lalu cek manual yang tidak bisa di-grep:

- `README.md` (daftar skill) dan bagian "Cara kerja" di `CLAUDE.md` masih sesuai isi skill.
- `global-CLAUDE.md` vs `~/.claude/CLAUDE.md`: cek 6 membandingkannya otomatis (header snapshot dan blok `# graphify` yang ditulis mesin diabaikan). Yang masih manual: pastikan blok `# graphify` tidak ikut ter-copy ke snapshot, dan kalau file user-level berubah, salin ke sini dalam commit yang sama.
- Sub-perintah ditulis dalam backtick (`` `/autor scan` ``) dan punya heading sendiri di skill-nya; cek 5 hanya melihat bentuk itu.
- Commit hanya setelah user setuju, dengan `Co-Authored-By: <persona>`.
- Skill **wajib** di `<nama>/SKILL.md` level atas (nama file persis `SKILL.md`). Claude Code tidak memuat folder bersarang seperti `kategori/<nama>/SKILL.md`; dulu 16 skill di `conditional/`, `docs/`, `system/` tidak pernah termuat karena ini.
- Bagian skill yang hanya dipakai pada kondisi tertentu (rute epik, push/PR, `/autor new`, `/autor release`) boleh dipindah ke berkas `.md` kedua di folder skill yang sama (daftarkan globnya di cek 1 dan 2); `SKILL.md` menyimpan headingnya (cek 5), aturan keras, dan perintah "Read … dan ikuti" yang eksplisit. Jangan pindahkan aturan yang berlaku di semua rute.
- Satu skill = satu folder. Jangan simpan salinan skill di folder lain (dulu `core/`, `agents/*-agent/`); salinan tidak dimuat dan cepat basi.
- Tiap skill punya `description` (apa skill-nya) + `when_to_use` (kapan dipakai, pola "Use when…"). Claude Code menampilkan keduanya di daftar skill dan memakainya untuk memilih skill otomatis — jaga keduanya akurat terhadap isi.
- Tidak ada GitHub Actions. Kalau suatu saat menambah workflow: pakai action resmi (`actions/*`) dan permissions seminimal mungkin. Dulu `changelog.yml` merujuk action dari akun yang tidak ada, dengan `contents: write`.
- Jangan commit `node_modules/` atau `synced/` (sudah di-`.gitignore`; `synced/` adalah folder sync milik Claude Code, bukan bagian pack ini).
