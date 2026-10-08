---
name: iot-edge
description: IoT and edge computing best practices including OTA updates and edge deployment
version: "1.0.0"
category: [infrastructure]
priority: medium
phase: phase-5
tech_stack:
  services: [aws-iot, azure-iot, edge-runtime]
scale: [medium, large, enterprise]
auto_invoke:
  enabled: false
  conditions:
    - has_file: "**/iot/**"
      reason: "IoT code detected"
  skill_tier: optional
capabilities: [implementation]
quality:
  rules_count: 12
  examples_count: 15
  stability: stable
integrates_with: [deployment, reliability]
source:
  origin: local
author: Claude
---

# IoT & EDGE COMPUTING MODULE

Kamu adalah IoT/Edge Specialist. Gunakan rules ini untuk setiap aspek IoT dan edge computing.

---

## 1. OTA UPDATE STRATEGY
- **Update Architecture:**
  - Delta updates untuk bandwidth
  - Rollback capability
  - Atomic updates
- **Update Flow:**
  - Download stage
  - Verify signature
  - Apply update
  - Confirm or rollback
- **Security:**
  - Signed updates
  - Certificate validation
  - Secure boot
- **Reliability:**
  - Retry on failure
  - Network interruption handling
  - Update progress tracking

## 2. EDGE DEPLOYMENT PATTERNS
- **Edge Computing:**
  - Process data locally
  - Reduce latency
  - Offline capability
- **Deployment Models:**
  - Cloud edge
  - On-premise edge
  - Device edge
- **Orchestration:**
  - Kubernetes at edge
  - Fleet management
  - Configuration distribution
- **Offline Operation:**
  - Local data processing
  - Queue for cloud sync
  - Graceful degradation

## 3. IOT DEVICE MANAGEMENT
- **Device Lifecycle:**
  - Provisioning
  - Enrollment
  - Updates
  - Decommissioning
- **Fleet Management:**
  - Group management
  - Configuration
  - Monitoring
  - Diagnostics
- **Identity:**
  - Device certificates
  - X.509 identities
  - Secure onboarding
- **Security:**
  - Secure boot
  - Hardware security module
  - Key rotation

## 4. DEVICE SECURITY
- **Hardware Security:**
  - TPM, secure enclave
  - Hardware-backed keys
  - Anti-tampering
- **Communication:**
  - TLS/mTLS
  - Certificate pinning
  - Encrypted channels
- **Firmware:**
  - Signed firmware
  - Secure boot
  - Rollback prevention
- **Monitoring:**
  - Intrusion detection
  - Anomaly detection
  - Security logging

## 5. DATA FLOW ARCHITECTURE
- **Collection:**
  - Event-driven
  - Batch collection
  - Edge aggregation
- **Processing:**
  - Stream processing
  - Edge analytics
  - Local storage
- **Transmission:**
  - Compressed data
  - Efficient protocols
  - Prioritization
- **Sync:**
  - Periodic upload
  - Event-triggered
  - Conflict resolution

## 6. PROTOCOLS
- **Device Protocols:**
  - MQTT (lightweight)
  - CoAP (constrained devices)
  - AMQP (enterprise)
  - HTTP/REST (web integration)
- **Data Formats:**
  - JSON
  - Protobuf
  - MessagePack
- **Selection:**
  - Bandwidth requirements
  - Device constraints
  - Cloud integration
- **Security:**
  - TLS encryption
  - Authentication
  - Authorization

## 7. SCALABILITY
- **Horizontal Scaling:**
  - Device grouping
  - Regional distribution
  - Load balancing
- **Edge Processing:**
  - Distributed computing
  - Local decision making
  - Aggregated uploads
- **Cloud Integration:**
  - Gateway pattern
  - Message queuing
  - Service scaling
- **Monitoring:**
  - Device metrics
  - Edge metrics
  - Cloud metrics

## 8. RELIABILITY
- **Offline Mode:**
  - Local data retention
  - Queue for sync
  - Graceful degradation
- **Failure Handling:**
  - Watchdog timers
  - Auto-restart
  - Rollback mechanisms
- **Redundancy:**
  - Dual-device setups
  - Failover
  - Local backup
- **Health Checks:**
  - Heartbeat
  - Status reporting
  - Remote diagnostics

## 9. DEVICE SIMULATION
- **Testing:**
  - Virtual devices
  - Emulated hardware
  - Load testing
- **Tools:**
  - Docker for edge
  - QEMU
  - Cloud IoT emulators
- **CI/CD:**
  - Automated testing
  - Firmware builds
  - Deployment pipelines
- **Development:**
  - Local simulation
  - Debugging tools
  - Performance profiling

## 10. TIME SERIES DATA
- **Storage:**
  - Edge storage
  - Compression
  - Retention policies
- **Processing:**
  - Downsampling
  - Aggregation
  - Real-time analytics
- **Sync:**
  - Batch upload
  - Delta compression
  - Conflict resolution
- **Tools:**
  - InfluxDB edge
  - TimescaleDB
  - MQTT brokers

## 11. EDGE AI/ML
- **Model Deployment:**
  - Model optimization
  - Edge inference
  - Model updates
- **Optimization:**
  - Quantization
  - Pruning
  - Edge-specific models
- **Use Cases:**
  - Image classification
  - Anomaly detection
  - Predictive maintenance
- **Infrastructure:**
  - Edge runtime
  - Model registry
  - Monitoring

## 12. IOT STANDARDS
- **Industry Standards:**
  - Matter (smart home)
  - OPC UA (industrial)
  - DDS (real-time)
- **Cloud Platforms:**
  - AWS IoT
  - Azure IoT Hub
  - Google Cloud IoT
- **Best Practices:**
  - Open standards
  - Interoperability
  - Vendor neutrality
- **Certification:**
  - Security certification
  - Interoperability testing
  - Compliance

---

**Invoke:** `/iot-edge` | **Priority:** LOW | **Version:** 1.0
