---
name: reticle
description: Local webcam vision with GPU face tracking and Person-of-Interest reticle. Includes face detection, tracking, presence gate, and two-camera runner.
when_to_use: Use for computer vision projects requiring real-time face tracking, presence detection, or camera-based interaction systems.
version: 1.0.0
priority: low
phase: any
platform: linux
author: TheVoidSyntax
source: github.com/Lasimeri/optical-079
---

# Reticle - Local Webcam Vision

Local webcam vision for Claude Code with GPU face tracking and Person-of-Interest reticle.

## Overview

Reticle provides local webcam vision capabilities including:
- GPU face tracking
- Person-of-Interest (POI) reticle
- Two-camera runner
- Presence gate

## Features

### Face Tracking
- Real-time face detection
- GPU-accelerated tracking
- Multiple face support

### Person-of-Interest (POI) Reticle
- Customizable reticle overlay
- Color and style options
- Target highlighting

### Presence Gate
- Detects person presence
- Triggers actions based on detection
- Configurable sensitivity

### Two-Camera Runner
- Simultaneous dual-camera support
- Independent stream processing
- Synchronized tracking

## Installation

```bash
# Clone repository
git clone https://github.com/Lasimeri/optical-079.git
cd optical-079

# Build
chmod +x build.sh
./build.sh
```

## Usage

```bash
# Single camera with face tracking
./cam079 --camera 0 --face-track

# Dual camera mode
./lapcams.sh

# With POI reticle
./cam079 --camera 0 --reticle --poi-tracking
```

## Filter Styles

Available visual styles:
- `cam-style-admin.filter` - Admin console aesthetic
- `cam-style-color.filter` - Color overlay style
- `cam-style-machine.filter` - Machine/industrial look
- `cam-style-nexpo.filter` - Neon expo style
- `cam-style-night.filter` - Night vision mode

## Integration with Claude Code

Reticle can be invoked for:
- Vision-related projects
- Face detection requirements
- Real-time camera tracking

```
Invoke Reticle for webcam vision tasks
Expected: Camera streams with tracking
```

---

**Repository:** Lasimeri/optical-079
**License:** MIT
