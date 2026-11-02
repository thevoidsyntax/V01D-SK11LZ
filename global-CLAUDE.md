# Master Rules v9.4 - Streamlined

> Snapshot of the user-level `~/.claude/CLAUDE.md`, version 9.4, taken 2026-11-01.
> The live file stays outside this repo, so this copy is the audit trail: if the live file is lost or restored from a backup, this is what it said.
> The `# graphify` block at the end is written by `graphify install` on the machine and is not part of the maintained rules.

**Token-efficient. Skills sebagai source of truth.**

---

## 🚀 Skills System

15 skill (proses + selera + alat). Pengetahuan stack/security/testing dari model + `CLAUDE.md` proyek.
- `/autor` → health scan, `/autor new` wizard, rekomendasi pipeline
- `/agents` → pipeline 6 persona, handoff log `specs/HANDOFF.md`
- Persona: `/satria` PM · `/athena` SE · `/hexa` Coder · `/dina` QA & Security · `/frans` DevOps · `/vika` Writer
- `/audit` → audit repo (gate Dina)
- `/ponytail` → sebelum menulis kode
- `/anti-slop` → semua teks: copy UI, docs, komentar
- `/impeccable` → semua UI: tidak boleh terlihat template AI
- `/tdd` → test yang gagal ditulis dulu, sebelum implementasi
- `/uicheck` → UI diverifikasi di browser sungguhan (overflow 360px, konsol, label, fokus)
- `/fool` → uji rencana atau desain sebelum dibangun

---

## Essential Rules

### 1. Approach
- Analisis dulu, jangan impulsif
- TDD: Red → Green → Refactor
- Ripple Effect: cek dampak ke file lain
- Think before coding: sebut asumsi eksplisit, tawarkan interpretasi lain kalau ambigu, stop & tanya kalau tidak jelas
- Surgical changes: hanya ubah yang diminta; jangan "perbaiki" kode/komentar di sebelahnya, jangan refactor yang tidak rusak, ikut style yang ada; hapus hanya orphan yang kamu buat
- Goal-driven: sukses = terverifikasi. Tulis langkah → cek (test/command), lalu jalankan sampai hijau

### 2. Project Scale
| Type | Approach |
|------|----------|
| KLIEN | Enterprise, ADR docs, full docs |
| PRIBADI | MVP: fitur minimal, tanpa fitur "untuk nanti"; aturan §3–§5 tetap wajib |

Bahasa artifact mengikuti §3b, bukan skala proyek.

### 3. Code Quality
- Idiomatic per bahasa
- Early Returns, no arrow anti-pattern
- DDD/Clean Architecture
- No hardcoded secrets (env vars)
- Resource cleanup (defer/using/finally)

### 3b. Bahasa (Language)
- **Code & artifacts = English.** Identifier, komentar, nama file, kolom DB, enum, field API, kode galat, commit message, docs, PRD/ADR/HANDOFF/ROADMAP, dan isi PR.
- **UI copy** mengikuti bahasa produk, ditetapkan per proyek (`UI language:` di CLAUDE.md proyek). User-facing text boleh non-Inggris.
- **Chat** (jawaban ke user) mengikuti bahasa user.
- Proyek lama yang sudah pakai bahasa lain tidak dirombak — ikuti bahasa file yang sedang diedit.

### 4. Backend Standards
- **UTC First** - datetime selalu UTC/ISO 8601
- **Idempotency** - POST/PUT/PATCH butuh idempotency key
- **ACID** - multi-table dalam transaction

### 5. API & Breaking Changes
- **Versioning** - /api/v1/, /api/v2/
- **Backward Compat** - field baru dulu, migrate, baru deprecate old
- **Parallel Run** - expand → migrate → contract

### 6. Git Workflow
```
feat: add login | fix: resolve bug | refactor: cleanup
```
- Repo V01D-SK11LZ dan pipeline `/agents`: akhiri dengan `Co-Authored-By: <Persona>`. Repo lain: tanpa trailer. Tidak pernah `Co-Authored-By: Claude`.
- Commit hanya setelah user setuju; push selalu minta approval (hook `ask-on-git-push`)

### 7. Output Style
- No boilerplate comments
- No AI phrases (Certainly!, In conclusion)
- Terse, direct - few words do trick
- PATCH/DIFF untuk code changes
- Jangan print file besar ke chat — tulis ke file, ringkas singkat
- App/website/UI tidak boleh terlihat buatan AI atau template AI → `/impeccable`

### 8. Safety
```
DESTRUCTIVE - KONFIRMASI DULU:
- rm -rf (except /tmp), drop DB, docker prune
DEPENDENCY - EVALUASI DULU:
- native lib cukup? perlu add package?
```

### 9. Performance
- O(N²) → O(N) or O(log N)
- No N+1 queries
- Lazy load, minimize re-renders

### 10. Documentation
- ADR untuk keputusan teknis penting
- CHANGELOG setiap release
- README untuk setup

---

## Anti-Patterns
```
❌ Boilerplate comments
❌ AI phrases
❌ Arrow anti-pattern (nested if)
❌ Hardcoded secrets
❌ God object
❌ Premature optimization
```

---

**Versi:** 9.4
