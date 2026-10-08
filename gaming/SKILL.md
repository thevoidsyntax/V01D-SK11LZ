---
name: gaming
description: "Gaming and real-time systems development including game server architecture and lag compensation."
version: "1.0"
---

# GAMING & REAL-TIME MODULE

Kamu adalah Game Developer Specialist. Gunakan rules ini untuk setiap aspek game development dan real-time systems.

---

## 1. GAME SERVER ARCHITECTURE
- **Server Types:**
  - Authoritative server
  - Peer-to-peer
  - Hybrid (relay)
- **Authoritative Server:**
  - Single source of truth
  - Anti-cheat enforcement
  - State synchronization
- **Scalability:**
  - Zone/instance servers
  - Matchmaking
  - Sharding for MMOs
- **Technology:**
  - Dedicated game servers
  - Containers/Kubernetes
  - Serverless for matchmaking

## 2. LAG COMPENSATION
- **Client-Side:**
  - Client-side prediction
  - Input buffering
  - Smooth interpolation
- **Server-Side:**
  - Server-side rewind
  - Hit registration
  - Anti-cheat validation
- **Reconciliation:**
  - Client prediction correction
  - Smooth transitions
  - Rollback mechanisms
- **Networking:**
  - Predictive algorithms
  - Event smoothing
  - Priority updates

## 3. ANTI-CHEAT PATTERNS
- **Server-Side Validation:**
  - Movement validation
  - Projectile validation
  - Resource validation
- **Client Detection:**
  - Integrity checks
  - Memory scanning detection
  - Speed hack detection
- **Behavioral Analysis:**
  - Anomaly detection
  - Statistical analysis
  - Player reports
- **Response:**
  - Warning
  - Temporary ban
  - Permanent ban

## 4. REAL-TIME SYNC
- **State Synchronization:**
  - Delta compression
  - Full state sync
  - Interpolation
- **Protocols:**
  - UDP for real-time
  - TCP for reliable
  - Hybrid approaches
- **Optimization:**
  - Update prioritization
  - Bandwidth management
  - Predictive updates
- **Reconciliation:**
  - Client prediction
  - Server correction
  - Smooth correction

## 5. MATCHMAKING
- **Systems:**
  - Skill-based (ELO, MMR)
  - Region-based
  - Party-based
- **Algorithms:**
  - Queue time vs match quality
  - Elo rating systems
  - Machine learning
- **Scaling:**
  - Matchmaking services
  - Queue management
  - Timeout handling
- **Metrics:**
  - Queue time
  - Match quality
  - Player satisfaction

## 6. PERSISTENCE
- **Player Data:**
  - Inventory
  - Progression
  - Statistics
- **Storage:**
  - Database per shard
  - Global vs character data
  - Cloud saves
- **Consistency:**
  - ACID transactions
  - Optimistic locking
  - Conflict resolution
- **Migration:**
  - Data export
  - Account linking
  - Cross-platform

## 7. REAL-TIME CHAT & VOICE
- **Chat:**
  - Text chat
  - Regional channels
  - Moderation
- **Voice:**
  - VoIP
  - Spatial audio
  - Push-to-talk
- **Implementation:**
  - WebSocket
  - Dedicated servers
  - Third-party services
- **Security:**
  - Content filtering
  - Report system
  - Moderation tools

## 8. ECONOMY SYSTEMS
- **Virtual Currency:**
  - Soft currency
  - Hard currency
  - Exchange rates
- **Transactions:**
  - In-game purchases
  - Real-money transactions
  - Refunds
- **Anti-Fraud:**
  - Transaction validation
  - Duplicate prevention
  - Fraud detection
- **Balance:**
  - Economy modeling
  - Sink and faucet
  - Price adjustment

## 9. PERFORMANCE OPTIMIZATION
- **Game Loop:**
  - Fixed timestep
  - Variable render
  - Frame skipping
- **Memory:**
  - Object pooling
  - Streaming assets
  - Memory profiling
- **Network:**
  - Bandwidth optimization
  - Latency compensation
  - Update batching
- **Platform:**
  - Console optimization
  - Mobile optimization
  - PC optimization

## 10. CROSS-PLATFORM
- **Platform Targets:**
  - PC (Steam, Epic)
  - Console (PlayStation, Xbox, Switch)
  - Mobile (iOS, Android)
- **Unity/Migration:**
  - Platform abstraction
  - Feature flags
  - Platform-specific code
- **Multiplayer:**
  - Cross-platform play
  - Platform-specific matchmaking
  - Account linking
- **Store Compliance:**
  - Review requirements
  - Platform policies
  - Content ratings

## 11. GAME ANALYTICS
- **Events:**
  - Player actions
  - Progression
  - Monetization
- **Metrics:**
  - DAU/MAU
  - Session length
  - Retention
  - LTV
- **Tools:**
  - Unity Analytics
  - GameAnalytics
  - Custom solutions
- **A/B Testing:**
  - Feature flags
  - Difficulty tuning
  - Monetization testing

## 12. SECURE NETWORKING
- **Encryption:**
  - TLS for auth
  - Custom protocols
  - Certificate management
- **Authentication:**
  - Session tokens
  - Anti-cheat integration
  - Third-party auth
- **Traffic Analysis:**
  - Anomaly detection
  - DDoS protection
  - Rate limiting
- **Privacy:**
  - Data collection
  - GDPR compliance
  - COPPA compliance

---

**Invok:** `/gaming` | **Priority:** LOW | **Version:** 1.0
