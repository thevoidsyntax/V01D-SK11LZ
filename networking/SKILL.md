---
name: networking
description: Networking best practices including DNS, TLS, load balancer, and WAF configuration
when_to_use: "Use when configuring networking: DNS, TLS, load balancers, or WAF."
version: "1.0.0"
category: [infrastructure]
priority: medium
phase: phase-5
tech_stack:
  services: [aws, gcp, azure, cloudflare]
scale: [medium, large]
auto_invoke:
  enabled: false
  conditions:
    - has_file: "**/network/**"
      reason: "Network config detected"
  skill_tier: optional
capabilities: [implementation, analysis]
quality:
  rules_count: 10
  examples_count: 12
  stability: stable
integrates_with: [deployment, scalability]
source:
  origin: local
author: thevoidsyntax
---

# NETWORKING MODULE

Kamu adalah Networking Specialist. Gunakan rules ini untuk setiap aspek networking dan infrastructure.

---

## 1. DNS MANAGEMENT
- **DNS Architecture:**
  - Internal DNS for services
  - External DNS for public endpoints
  - Split-horizon DNS
- **Record Types:**
  - A/AAAA: IPv4/IPv6 addresses
  - CNAME: Alias records
  - TXT: SPF, DKIM, verification
  - MX: Mail records
- **Health Checks:**
  - Monitoring records
  - Latency-based routing
  - Failover configuration
- **TTL Management:**
  - Low TTL for frequent changes
  - High TTL for stable records
  - A/B testing considerations

## 2. SSL/TLS CERTIFICATE MANAGEMENT
- **Certificate Types:**
  - DV: Domain validation
  - OV: Organization validation
  - EV: Extended validation
- **Certificate Authority:**
  - Let's Encrypt (automated)
  - DigiCert (enterprise)
  - Internal CA (private)
- **Automation:**
  - cert-manager for K8s
  - Auto-renewal (30 days before expiry)
  - DNS validation
- **Security:**
  - TLS 1.2 minimum
  - TLS 1.3 preferred
  - Strong cipher suites
  - HSTS header

## 3. LOAD BALANCING STRATEGIES
- **Algorithms:**
  - Round Robin: Even distribution
  - Least Connections: Route to least busy
  - IP Hash: Session affinity
  - Weighted: Performance-based
- **Health Checks:**
  - TCP check
  - HTTP check
  - Custom check
  - Threshold configuration
- **SSL Termination:**
  - Terminate at load balancer
  - Certificate management
  - Backend encryption
- **High Availability:**
  - Active-passive
  - Active-active
  - Geographic distribution

## 4. WAF CONFIGURATION
- **OWASP Top 10:**
  - SQL injection
  - XSS prevention
  - CSRF protection
  - Rate limiting
- **Rules:**
  - Whitelist vs blacklist
  - Managed rules
  - Custom rules
- **Logging & Monitoring:**
  - Attack detection
  - False positive tuning
  - Alerting
- **Deployment:**
  - Cloud WAF (AWS WAF, Cloudflare)
  - On-premise WAF
  - CDN integration

## 5. CDN CONFIGURATION
- **Cache Rules:**
  - Static asset caching
  - Cache-Control headers
  - Origin shielding
- **Optimization:**
  - Image optimization
  - Brotli/Gzip compression
  - HTTP/2 or HTTP/3
- **Security:**
  - DDoS protection
  - Hotlink protection
  - Geo-blocking
- **Performance:**
  - Edge locations
  - Cache warming
  - Origin failover

## 6. REVERSE PROXY
- **Nginx/HAProxy:**
  - Request routing
  - SSL termination
  - Load balancing
- **Configuration:**
  - Upstream health checks
  - Connection pooling
  - Rate limiting
- **Caching:**
  - Response caching
  - Static file serving
  - Purge strategies
- **Security:**
  - Hide backend servers
  - Request filtering
  - IP blocking

## 7. API GATEWAY
- **Features:**
  - Authentication
  - Rate limiting
  - Request/response transformation
  - Logging
- **Routing:**
  - Path-based
  - Header-based
  - Host-based
- **Security:**
  - OAuth2/JWT validation
  - API key management
  - IP whitelisting
- **Monitoring:**
  - Request metrics
  - Latency tracking
  - Error rates

## 8. VPN & SECURE CONNECTIVITY
- **VPN Types:**
  - Site-to-site VPN
  - Client VPN
  - WireGuard, OpenVPN, IPSec
- **Zero Trust:**
  - No implicit trust
  - Continuous verification
  - Micro-segmentation
- **Private Networking:**
  - VPC/VNet
  - Private subnets
  - Bastion hosts
- **Connection Security:**
  - Encrypted tunnels
  - Certificate-based auth
  - MFA for access

## 9. FIREWALL RULES
- **Default Deny:**
  - Explicit allow rules
  - Least privilege
  - Regular review
- **Rule Organization:**
  - By service
  - By environment
  - Documentation
- **Logging:**
  - Connection logging
  - Alert on anomalies
  - Retention policy
- **Automation:**
  - Infrastructure as code
  - GitOps workflow
  - Drift detection

## 10. NETWORK MONITORING
- **Metrics:**
  - Bandwidth utilization
  - Latency
  - Packet loss
  - Connection counts
- **Tools:**
  - Prometheus exporters
  - Network monitoring tools
  - Flow analysis
- **Alerting:**
  - Threshold-based
  - Anomaly detection
  - Escalation
- **Troubleshooting:**
  - Packet capture
  - Traceroute
  - Netflow analysis

## 11. IPV6
- **Dual Stack:**
  - IPv4 and IPv6 support
  - Address planning
  - DNS configuration
- **Migration:**
  - Gradual rollout
  - Compatibility
  - Testing
- **Security:**
  - Same policies as IPv4
  - ACLs for IPv6
  - Monitoring
- **Considerations:**
  - Address management
  - SLAAC vs DHCPv6

## 12. TRAFFIC ENGINEERING
- **Traffic Analysis:**
  - Flow monitoring
  - Usage patterns
  - Peak identification
- **Optimization:**
  - Route optimization
  - Load balancing
  - Caching strategies
- **Capacity Planning:**
  - Growth projection
  - Headroom
  - Scaling triggers
- **Disaster Recovery:**
  - Failover routing
  - DNS failover
  - Traffic rerouting

---

**Invoke:** `/networking` | **Priority:** MEDIUM | **Version:** 1.0
