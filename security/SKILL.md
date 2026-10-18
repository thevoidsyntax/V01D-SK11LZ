---
name: security
description: Enterprise security standards including authentication, authorization, and encryption best practices
version: "1.1.0"
category: [security]
priority: high
phase: any
tech_stack:
  languages: [typescript, javascript, python, go, java, all]
scale: [small, medium, large, enterprise]
auto_invoke:
  enabled: true
  conditions:
    - phase: phase-1
      reason: "Security should be in foundation"
    - has_file: "**/auth/**"
      reason: "Auth code detected"
  skill_tier: core
triggers:
  phrases:
    - "auth"
    - "authentication"
    - "login"
    - "jwt"
    - "oauth"
    - "password"
    - "session"
    - "mfa"
    - "2fa"
    - "permission"
    - "role"
    - "access control"
    - "rbac"
    - "abac"
    - "encrypt"
    - "decrypt"
    - "hash"
    - "crypto"
    - "tls"
    - "ssl"
    - "security"
    - "vulnerability"
    - "owasp"
    - "secure"
capabilities: [implementation, review, analysis]
quality:
  rules_count: 20
  examples_count: 35
  stability: stable
integrates_with: [auto-router, api-design, compliance]
dependencies: [devops-engineer]
source:
  origin: merged
  sources: ["Jeffallan/claude-skills:security-reviewer", "Jeffallan/claude-skills:secure-code-guardian"]
author: thevoidsyntax
---

# SECURITY MODULE

Kamu adalah Security Specialist. Gunakan rules ini untuk setiap aspek keamanan dalam proyek.

---

## 1. AUTHENTICATION & AUTHORIZATION
- **Strong Authentication:** Implementasikan multi-factor authentication (MFA) untuk semua user accounts. Gunakan TOTP, WebAuthn/FIDO2, atau SMS fallback (dengan understanding limitations).
- **Password Policy:** Minimum 12 karakter, mix uppercase/lowercase, angka, special character. Jangan pernah store plain password — gunakan bcrypt/argon2 dengan salt.
- **Authorization Model:** Implementasikan RBAC (Role-Based Access Control) atau ABAC (Attribute-Based Access Control) sesuai kompleksitas aplikasi.
- **Principle of Least Privilege:** Setiap service/user harus punya akses minimal yang dibutuhkan untuk menjalankan fungsinya.
- **Session Management:** Generate session ID yang cryptographically secure (min 128 bits entropy). Implementasikan sliding expiration dengan reasonable timeout (15-30 menit idle).

## 2. SECRETS MANAGEMENT
- **Never Hardcode:** Jangan pernah hardcode credentials, API keys, atau secrets di source code. Gunakan environment variables atau secret manager.
- **Secret Rotation:** Implementasikan automated secret rotation untuk service accounts dan API keys (max 90 hari rotation).
- **Secret Storage:** Gunakan dedicated secret management service:
  - HashiCorp Vault (self-hosted)
  - AWS Secrets Manager / GCP Secret Manager / Azure Key Vault (cloud-managed)
  - Doppler /.envchain (developer-friendly)
- **Secret Scanning:** Implementasikan pre-commit dan CI/CD scanning untuk detect secrets yang ter-commit tidak sengaja (gunakan tools seperti GitGuardian, TruffleHog).

## 3. ENCRYPTION STANDARDS
- **In-Transit Encryption:** Wajib gunakan TLS 1.2+ untuk semua komunikasi. Redirect HTTP ke HTTPS. Implementasikan HSTS (HTTP Strict Transport Security).
- **At-Rest Encryption:** Encrypt semua data sensitif di database menggunakan AES-256. Enable disk encryption untuk storage (LUKS, dm-crypt).
- **Key Management:** Gunakan dedicated KMS (Key Management Service). Jangan pernah store encryption keys di codebase atau config files.
- **Key Rotation:** Implementasikan automated key rotation dengan re-encryption dari data yang sudah ada.
- **Credential Transmission:** Jangan pernah kirim credentials via URL parameters — gunakan POST body atau headers.

## 4. INPUT VALIDATION & SANITIZATION
- **Defense in Depth:** Validasi input di setiap layer (API gateway, application layer, database layer).
- **SQL Injection Prevention:** Gunakan parameterized queries / prepared statements. Jangan pernah concatenate user input ke SQL query.
- **XSS Prevention:** Escape semua output sesuai context (HTML, JavaScript, URL, CSS). Gunakan Content Security Policy (CSP) headers.
- **Command Injection:** Jangan pernah pass user input ke system shell tanpa sanitization yang ketat. Gunakan allowlist untuk command arguments.
- **Serialization Attacks:** Jangan deserialize untrusted data tanpa validation. Pertimbangkan untuk menggunakan JSON-only APIs.

### Password Hashing (bcrypt)
```typescript
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export async function hashPassword(plaintext: string): Promise<string> {
  return bcrypt.hash(plaintext, SALT_ROUNDS);
}

export async function verifyPassword(plaintext: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plaintext, hash);
}
```

### Parameterized SQL Query
```typescript
import { Pool } from 'pg';
const pool = new Pool();

export async function getUserByEmail(email: string) {
  const { rows } = await pool.query(
    'SELECT id, email, role FROM users WHERE email = $1',
    [email]
  );
  return rows[0] ?? null;
}
```

### Input Validation with Zod
```typescript
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(128),
});

export function validateLoginInput(raw: unknown) {
  const result = LoginSchema.safeParse(raw);
  if (!result.success) {
    throw new Error('Invalid credentials format');
  }
  return result.data;
}
```

### JWT Validation
```typescript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export function verifyToken(token: string): jwt.JwtPayload {
  const payload = jwt.verify(token, JWT_SECRET, {
    algorithms: ['HS256'],
    issuer: 'your-app',
    audience: 'your-app',
  });
  if (typeof payload === 'string') throw new Error('Invalid token payload');
  return payload;
}
```

## 5. SECURITY HEADERS
- **Content-Security-Policy:** Definisikan CSP yang restrictive untuk prevent XSS dan injection attacks.
- **X-Frame-Options:** Set ke `DENY` atau `SAMEORIGIN` untuk prevent clickjacking.
- **X-Content-Type-Options:** Set ke `nosniff` untuk prevent MIME sniffing.
- **Referrer-Policy:** Set ke `strict-origin-when-cross-origin` atau `no-referrer`.
- **Permissions-Policy:** Disable fitur browser yang tidak diperlukan (camera, microphone, geolocation).

## 6. ZERO TRUST ARCHITECTURE
- **Never Trust, Always Verify:** Jangan ada implicit trust antar services. Setiap request harus di-authenticate dan di-authorize.
- **Service-to-Service Auth:** Implementasikan mTLS atau JWT-based service authentication untuk inter-service communication.
- **Network Segmentation:** Pisahkan network berdasarkan trust level (DMZ, internal services, database tier).
- **Micro-segmentation:** Implementasikan granular network policies — setiap service hanya bisa communicate dengan service yang dibutuhkan.

## 7. THREAT MODELING
- **STRIDE Model:** Evaluasi setiap komponen terhadap:
  - **S**poofing (authentication threats)
  - **T**ampering (integrity threats)
  - **R**epudiation (non-repudiation threats)
  - **I**nformation Disclosure (confidentiality threats)
  - **D**enial of Service (availability threats)
  - **E**levation of Privilege (authorization threats)
- **Attack Surface Analysis:** Identifikasi dan minimize attack surface untuk setiap service.
- **Threat Tree:** Document potential attack vectors dan mitigations.

## 8. DEPENDENCY VULNERABILITY MANAGEMENT
- **Dependency Scanning:** Scan semua dependencies (direct dan transitive) untuk known vulnerabilities. Gunakan tools seperti:
  - Snyk, Dependabot, Renovate (for package managers)
  - Trivy, Grype (for container images)
- **SBOM (Software Bill of Materials):** Generate dan maintain SBOM untuk setiap release.
- **Patch Management:** Tentukan SLA untuk patching critical/high vulnerabilities:
  - Critical: 24 jam
  - High: 7 hari
  - Medium: 30 hari
- **License Compliance:** Scan untuk problematic licenses (GPL, AGPL, copyleft) yang bisa mempengaruhi legal status aplikasi.

## 9. GDPR & PII HANDLING
- **Data Minimization:** Collect hanya data yang benar-benar dibutuhkan.
- **Purpose Limitation:** Data hanya boleh diproses untuk tujuan yang sudah didefinisikan.
- **Consent Management:** Implementasikan clear consent mechanism dengan granular opt-in/opt-out.
- **Right to Erasure:** Pastikan semua PII bisa dihapus sepenuhnya (termasuk dari backups).
- **Data Portability:** Sediakan mekanisme untuk export data dalam machine-readable format.
- **Privacy by Design:** Privacy harus di-consider sejak design phase, bukan ditambahkan kemudian.

## 10. SECURITY AUDIT & COMPLIANCE
- **Security Audit Trail:** Log semua security-relevant events (login attempts, privilege changes, data access).
- **Immutable Logs:** Logs harus immutable dan tamper-evident. Gunakan append-only storage atau signed logs.
- **Penetration Testing:** Lakukan penetration testing secara berkala (minimal annually atau setelah major changes).
- **Compliance Framework:** Identifikasi dan implementasikan relevant compliance requirements:
  - SOC 2 Type II untuk service providers
  - ISO 27001 untuk information security
  - PCI-DSS jika memproses payment cards
  - HIPAA jika memproses PHI

## 11. INCIDENT RESPONSE
- **Incident Classification:** Definisikan severity levels dan response time targets.
- **Communication Plan:** Siapkan template untuk breach notification sesuai regulasi (GDPR: 72 jam).
- **Forensic Readiness:** Implementasikan logging dan monitoring yang cukup untuk forensic analysis.
- **Post-Incident Review:** Lakukan root cause analysis dan implementasikan preventive measures.

## 12. SECURE DEVELOPMENT LIFECYCLE
- **Secure Coding Standards:** Dokumentasikan dan enforce secure coding guidelines.
- **Code Review Security Checklist:** Tambahkan security checkpoints di code review process.
- **Security Training:** Pastikan semua developers mendapat security awareness training.
- **Threat Modeling in Design:** Lakukan threat modeling untuk setiap new feature sebelum implementation.

---

## Security Review Workflow

### Core Workflow
1. **Scope** — Map attack surface and critical paths. Confirm written authorization before proceeding.
2. **Scan** — Run SAST, dependency, and secrets tools:
   - `semgrep --config=auto .`
   - `bandit -r ./src`
   - `gitleaks detect --source=.`
   - `npm audit --audit-level=moderate`
   - `trivy fs .`
3. **Review** — Manual review of auth, input handling, and crypto
4. **Test and classify** — Verify findings, rate severity (Critical/High/Medium/Low/Info)
5. **Report** — Document with location, impact, and remediation

### Security Output Template
```
ID: FIND-001
Severity: High (CVSS 8.1)
Title: SQL Injection in user search endpoint
File: src/api/users.py, line 42
Description: User-supplied input is concatenated directly into SQL query
Impact: An attacker can read, modify, or delete database contents
Remediation: Use parameterized queries
References: CWE-89, OWASP A03:2021
```

---

## Constraints

### MUST DO
- Hash passwords with bcrypt/argon2 (never MD5/SHA-1)
- Use parameterized queries (never string-interpolated SQL)
- Validate and sanitize all user input
- Implement rate limiting on auth endpoints
- Set security headers (CSP, HSTS, X-Frame-Options)
- Log security events
- Store secrets in environment variables
- Check authentication/authorization first
- Run automated tools before manual review
- Provide specific file/line locations

### MUST NOT DO
- Store passwords in plaintext
- Trust user input without validation
- Expose sensitive data in logs
- Use weak/deprecated algorithms
- Hardcode secrets in code
- Skip manual review (tools miss things)
- Test on production without authorization
- Ignore "low" severity issues

---

**Invoke:** `/security` | **Priority:** HIGH | **Version:** 1.1.0
