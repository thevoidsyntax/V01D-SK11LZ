---
name: mobile
description: Mobile development best practices including offline-first, biometric auth, and push notifications
when_to_use: "Use when building a mobile app with offline-first, biometric auth, or push notifications."
version: "1.0.0"
category: [frontend]
priority: medium
phase: phase-3
tech_stack:
  frameworks: [react-native, flutter, swift, kotlin]
scale: [small, medium, large]
auto_invoke:
  enabled: false
  conditions:
    - has_file: "**/android/**"
      reason: "Android project detected"
    - has_file: "**/ios/**"
      reason: "iOS project detected"
  skill_tier: optional
capabilities: [implementation]
quality:
  rules_count: 12
  examples_count: 15
  stability: stable
integrates_with: [security, api-design]
source:
  origin: local
author: thevoidsyntax
---

# MOBILE DEVELOPMENT MODULE

Kamu adalah Mobile Development Specialist. Gunakan rules ini untuk setiap aspek mobile app development.

---

## 1. OFFLINE-FIRST ARCHITECTURE
- **Local Database:**
  - SQLite (iOS/Android native)
  - Realm, WatermelonDB (cross-platform)
  - Indexed for performance
- **Sync Strategy:**
  - Last-write-wins
  - Conflict resolution
  - Server reconciliation
- **Offline Indicators:**
  - Clear sync status
  - Queue pending changes
  - Manual sync trigger
- **Data Freshness:**
  - Background sync
  - Pull-to-refresh
  - Stale data indicators

## 2. BIOMETRIC AUTHENTICATION
- **Platform Support:**
  - iOS: LocalAuthentication
  - Android: BiometricPrompt
  - Cross-platform: react-native-biometrics
- **Security:**
  - Use platform keystore
  - Fallback to device passcode
  - Liveness detection
- **UX:**
  - Transparent when possible
  - Clear fallback path
  - Graceful degradation
- **Implementation:**
  - Keychain/Keystore storage
  - Encrypted credentials
  - Session management

## 3. PUSH NOTIFICATIONS
- **Push Services:**
  - APNs (iOS)
  - FCM (Android)
  - Cross-platform: OneSignal, Firebase
- **Notification Types:**
  - Push notifications
  - Local notifications
  - Rich notifications
- **Payload Structure:**
  - Title, body, data
  - Action buttons
  - Deep links
- **Best Practices:**
  - Permission request timing
  - Notification grouping
  - Quiet hours
  - Opt-out handling

## 4. APP STORE DEPLOYMENT
- **iOS (App Store):**
  - App Store Connect
  - TestFlight for beta
  - Review guidelines compliance
  - Build signing (Certificates, Profiles)
- **Android (Play Store):**
  - Google Play Console
  - Internal testing
  - Closed/Open testing
  - Play Store policies
- **Submission Checklist:**
  - Screenshots (multiple sizes)
  - App preview videos
  - Descriptions
  - Keywords
  - Privacy policy
- **Release Management:**
  - Versioning (SemVer)
  - Release notes
  - Phased rollout
  - Rollback capability

## 5. MOBILE CI/CD
- **Build Automation:**
  - Fastlane (iOS/Android)
  - Codemagic
  - GitHub Actions
  - Bitrise
- **Pipeline Stages:**
  - Lint/format check
  - Unit tests
  - UI tests
  - Build
  - Deploy
- **Code Signing:**
  - Secure credential storage
  - Automatic provisioning
  - Environment-specific signing
- **Test Distribution:**
  - Firebase App Distribution
  - TestFlight
  - Internal distribution

## 6. DEEP LINKING
- **URL Schemes:**
  - Custom URL scheme: `myapp://`
  - Universal links (iOS)
  - App links (Android)
- **Link Handling:**
  - Route parsing
  - Authentication check
  - Fallback handling
- **Deferred Deep Linking:**
  - Store link pending auth
  - Navigate after auth
- **Analytics:**
  - Link attribution
  - Conversion tracking

## 7. MOBILE PERFORMANCE
- **Startup Optimization:**
  - App signing
  - Splash screen
  - Lazy loading
  - Pre-warming
- **Memory Management:**
  - Image caching
  - List virtualization
  - Memory profiling
- **Battery Optimization:**
  - Background task limits
  - Network batching
  - Location updates
- **Network:**
  - Request batching
  - Compression
  - Retry with backoff

## 8. SECURITY
- **Data Storage:**
  - Keychain (iOS)
  - Keystore (Android)
  - Encrypted shared preferences
- **Network Security:**
  - Certificate pinning
  - TLS 1.2+
  - Secure WebView
- **Code Security:**
  - Obfuscation
  - Root/jailbreak detection
  - Debug detection
- **Privacy:**
  - Permission handling
  - Data minimization
  - Privacy policy

## 9. CROSS-PLATFORM
- **Framework Selection:**
  - React Native: JavaScript, large community
  - Flutter: Dart, custom UI
  - Kotlin Multiplatform: Native components
  - SwiftUI/Compose: Native UI
- **Architecture:**
  - Shared business logic
  - Platform-specific UI
  - Feature flags
- **Testing:**
  - Platform-specific tests
  - Shared test suite
  - Device lab

## 10. MOBILE TESTING
- **Unit Tests:**
  - Jest (React Native)
  - XCTest (iOS)
  - JUnit (Android)
- **UI Tests:**
  - Detox (React Native)
  - XCTest UI (iOS)
  - Espresso (Android)
- **Device Testing:**
  - BrowserStack, Sauce Labs
  - Physical device lab
  - Emulator/simulator
- **Performance Testing:**
  - Startup time
  - Memory usage
  - Battery drain

## 11. MOBILE ANALYTICS
- **Events:**
  - Screen views
  - User actions
  - Errors
- **Metrics:**
  - DAU/MAU
  - Session length
  - Retention
  - Conversion
- **Tools:**
  - Firebase Analytics
  - Amplitude
  - Mixpanel
- **Privacy:**
  - Consent management
  - Anonymization
  - GDPR compliance

## 12. APP ICONS & ASSETS
- **Icon Sizes:**
  - iOS: 1024x1024 (App Store), various sizes
  - Android: Play Store 512x512, adaptive icons
- **Asset Requirements:**
  - App icons
  - Splash screen
  - Placeholder images
  - Push notification icons
- **Design Guidelines:**
  - iOS Human Interface Guidelines
  - Material Design (Android)
  - Accessibility considerations
- **Asset Management:**
  - Asset catalogs
  - Image optimization
  - Vector drawables

---

**Invoke:** `/mobile` | **Priority:** MEDIUM | **Version:** 1.0
