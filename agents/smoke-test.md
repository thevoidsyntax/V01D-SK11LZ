# Smoke-test `/agents`

Untuk manusia; tidak dimuat otomatis.

Full route, in an interactive session:

> **"Buat endpoint health-check kecil, proyek KLIEN. Mulai pipeline."**

```text
[RUTE] Fitur baru (KLIEN): Satria → Athena → Hexa → Dina → Frans → Vika
[FASE 1/6] Satria (Opus) mulai — baca permintaan user
[HANDOFF] Satria → Athena selesai: specs/PRD.md (ada)
[FASE 2/6] Athena (Sonnet) mulai — baca specs/PRD.md
[HANDOFF] Athena → Hexa selesai: specs/ADR.md (ada)
(pause: summary + Lanjut / Revisi PRD / Revisi ADR / Stop)
```

Short routes: **"Perbaiki SQL injection di /users/search. Mulai pipeline."** → `[RUTE] Bugfix: Hexa → Dina`. **"Proyek PRIBADI: <spesifikasi dengan kriteria penerimaan>. Mulai pipeline."** → `[RUTE] Fitur baru (PRIBADI): Hexa → Dina`.

Passing = every artifact of the route exists, `specs/HANDOFF.md` has the `[RUTE]` entry and one entry per phase, Dina's last `STATUS:` is `APPROVED`, the commit was offered, and on `main`/`master` the branch question was asked (a `[BRANCH]` entry if approved) and the push/PR offer followed the commit. If a phase produces no artifact, stop and inspect that phase rather than continuing.
