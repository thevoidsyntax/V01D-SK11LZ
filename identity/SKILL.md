---
name: identity
description: Identity and access management (IAM) including OAuth2, OIDC, SAML, MFA, and session management
version: "1.0.0"
category: [security]
priority: high
phase: phase-1
tech_stack:
  frameworks: [auth0, okta, keycloak]
scale: [small, medium, large]
auto_invoke:
  enabled: true
  conditions:
    - has_file: "**/auth/**"
      reason: "Auth code detected"
    - has_file: "**/identity/**"
      reason: "Identity code detected"
  skill_tier: context
capabilities: [implementation, review]
quality:
  rules_count: 15
  examples_count: 25
  stability: stable
integrates_with: [security, api-design]
dependencies: [security]
source:
  origin: local
author: thevoidsyntax
---

# IDENTITY & ACCESS MANAGEMENT MODULE

Kamu adalah IAM Specialist. Gunakan rules ini untuk setiap aspek authentication dan authorization.

---

## 1. OAUTH2 & OPENID CONNECT
- **Flow Selection:** Pilih OAuth2 flow yang tepat sesuai use case:
  - **Authorization Code + PKCE:** Untuk SPAs dan mobile apps (recommended)
  - **Authorization Code:** Untuk server-side apps
  - **Client Credentials:** Untuk service-to-service communication
  - **Device Flow:** Untuk CLI tools dan smart devices
  - **Avoid:** Implicit flow dan Resource Owner Password Credentials grant
- **PKCE Implementation:** Wajib gunakan PKCE (Proof Key for Code Exchange) untuk public clients.
- **State Parameter:** Validasi `state` parameter untuk CSRF protection.
- **Token Validation:** Validasi token signature, expiration, issuer, dan audience di setiap request.
- **Scope Management:** Define granular scopes. Jangan expose admin scopes ke public clients.

## 2. IDENTITY PROVIDER (IDP) INTEGRATION
- **Managed IDP:** Gunakan established identity providers (Auth0, Okta, Keycloak, Azure AD) daripada build custom auth.
- **Social Login:** Jika support social login, gunakan standard protocols (OAuth2/OIDC) — jangan store credentials.
- **Federation:** Implementasikan SAML 2.0 atau OIDC Federation untuk enterprise SSO.
- **User Federation:** Siapkan mekanisme untuk import/sync users dari external directories (LDAP, AD).

## 3. TOKEN MANAGEMENT
- **Access Token Lifetime:** Short-lived tokens (5-15 menit untuk web apps, 1 jam max untuk trusted clients).
- **Refresh Token:** Implementasikan refresh token rotation untuk enhanced security:
  - Invalidasi old refresh token saat new token issued
  - Detect token reuse attacks
- **Token Storage (Client-Side):**
  - **Web:** HttpOnly, Secure cookies (preferred)
  - **Mobile:** Platform-native secure storage (Keychain/Keystore)
  - **Avoid:** localStorage/sessionStorage untuk sensitive tokens
- **Token Revocation:** Implementasikan token revocation endpoint dan blacklist mechanism.
- **JWT Security:** Jika gunakan JWT:
  - Strong signing algorithm (RS256, ES256 — avoid HS256 untuk shared secrets)
  - Short expiration (max 1 jam)
  - Include `jti` claim untuk replay protection

## 4. MULTI-FACTOR AUTHENTICATION (MFA)
- **MFA Enforcement:** Wajib aktifkan MFA untuk:
  - Admin accounts
  - Accounts dengan akses ke sensitive data
  - First-time login dari new device
- **MFA Methods:** Support multiple MFA methods:
  - TOTP (Google Authenticator, Authy) — recommended
  - WebAuthn/FIDO2 (hardware keys) — highest security
  - Push notifications — user-friendly
  - SMS (fallback only) — acknowledge SMS vulnerabilities
- **MFA Recovery:** Sediakan backup codes dengan one-time use. Jangan izinkan bypass codes.
- **MFA Bypass Prevention:** Jangan pernah provide full bypass mechanism. Require identity verification untuk disable MFA.

## 5. SESSION MANAGEMENT
- **Session ID Generation:** Use cryptographically secure random number generator (min 128 bits entropy).
- **Session Storage:** Store sessions server-side dengan encrypted session store (Redis dengan TLS, atau encrypted DB).
- **Session Lifecycle:**
  - Creation: authenticated user, log session metadata
  - Idle timeout: 15-30 menit (adjustable based on sensitivity)
  - Absolute timeout: 8-24 jam
  - Logout: invalidate session immediately
- **Concurrent Session Control:** Option untuk limit concurrent sessions per user.
- **Session Fixation Prevention:** Generate new session ID setelah authentication.

## 6. PASSWORD MANAGEMENT
- **Password Requirements:**
  - Minimum 12 karakter
  - Mix character types (uppercase, lowercase, numbers, symbols)
  - Jangan allow commonly used passwords (gunakan haveibeenpwned API)
  - Jangan allow sequential characters atau username sebagai password
- **Password Hashing:** Use bcrypt (cost factor 12+), argon2id, atau scrypt. Jangan gunakan MD5, SHA-1, atau SHA-256.
- **Password Reset Flow:**
  - Generate unique, time-limited reset token (sent via email)
  - Require current password untuk change password
  - Invalidate all sessions setelah password change
  - Notify user via email tentang password change
- **Breached Password Detection:** Check password terhadap known breached password databases secara berkala.

## 7. ACCESS CONTROL (RBAC/ABAC)
- **Role Definition:** Define roles dengan granular permissions:
  - Separation of duties untuk critical operations
  - Role hierarchy dengan clear inheritance
  - No privilege accumulation
- **Permission Model:**
  - **RBAC:** Role-to-permission mapping (simpler, sufficient untuk most apps)
  - **ABAC:** Policy-based dengan attributes (user, resource, environment) untuk complex scenarios
- **Authorization Checks:** Always check authorization di application layer, bukan hanya di presentation layer.
- **Default Deny:** Default policy harus deny. Explicitly grant permissions only when needed.

## 8. SSO & IDENTITY FEDERATION
- **Enterprise SSO:** Implementasikan SAML 2.0 atau OIDC untuk enterprise customers:
  - Support multiple IDPs
  - Just-in-Time (JIT) provisioning
  - Attribute mapping dari IDP ke application roles
- **Cross-Domain Identity:** Gunakan standard protocols untuk cross-domain identity (OIDC Federation, SAML).
- **Session Bridging:** Handle session bridging antar applications dengan shared identity platform.

## 9. FRAUD & ANOMALY DETECTION
- **Login Attempt Limits:** Lock account setelah 5-10 failed attempts (with progressive lockout).
- **Velocity Checks:** Detect suspicious patterns:
  - Multiple failed logins dari different IPs
  - Login dari unusual locations
  - Concurrent logins dari different locations
- **Risk-Based Authentication:** Terapkan additional verification untuk high-risk actions:
  - Login dari new device/location
  - Access ke sensitive data
  - High-value transactions
- **Behavioral Analytics:** Optionally implement ML-based anomaly detection untuk fraud prevention.

## 10. IDENTITY LIFECYCLE MANAGEMENT
- **Provisioning:** Automated user provisioning dari HR systems atau IDP.
- **Deprovisioning:** Automated deprovisioning dengan immediate access revocation saat employee leaves.
- **Access Review:** Periodic access reviews (quarterly atau annually) untuk validate permissions.
- **Privilege Escalation:** Require approval workflow untuk temporary privilege escalation.
- **Service Account Management:** Dedicated identity untuk services dengan automated rotation.

## 11. AUDIT & COMPLIANCE
- **Audit Logging:** Log semua identity events:
  - Authentication attempts (success dan failure)
  - Authorization decisions
  - Permission changes
  - MFA enrollment/disable
  - Password changes
- **Immutable Audit Trail:** Audit logs harus tamper-evident dan retained sesuai compliance requirements.
- **Access Certification:** Automated workflow untuk periodic access certification.
- **Compliance Reporting:** Generate reports untuk SOX, HIPAA, atau compliance framework lainnya.

## 12. MOBILE & BIOMETRIC AUTH
- **Biometric Authentication:** Gunakan platform-native biometric APIs:
  - iOS: LocalAuthentication framework
  - Android: BiometricPrompt API
- **Biometric Security:**
  - Never store biometric templates — use platform keystore
  - Require fallback ke device passcode
  - Implementasikan liveness detection
- **Mobile Credential Storage:** Use Keychain (iOS) atau Keystore (Android) dengan appropriate access controls.

---

**Invoke:** `/identity` | **Priority:** HIGH | **Version:** 1.0
