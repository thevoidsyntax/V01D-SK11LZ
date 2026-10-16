---
name: reticle
description: "Computer vision and image processing pipeline for ML applications"
version: "1.1.0"
category: [ai-ml]
priority: medium
phase: any
auto_invoke:
  enabled: true
  conditions:
    - command: ["/reticle", "/computer-vision"]
      reason: "Computer vision"
    - phrase: ["computer vision", "image processing", "opencv", "object detection"]
      reason: "Vision context"
tech_stack:
  languages: [python, javascript]
scale: [all]
integrates_with: [ml-engineering, ml-pipeline]
capabilities: [implementation]
quality:
  rules_count: 8
  examples_count: 3
  stability: stable
source:
  origin: local
author: thevoidsyntax
---

# Reticle (Computer Vision)

Image processing and computer vision pipeline.

## Usage

```
Use reticle when:
- Processing images for ML
- Object detection tasks
- Image classification
- Visual anomaly detection
```

## Capabilities

- Image preprocessing (resize, normalize, augment)
- Object detection (YOLO, SSD, Faster R-CNN)
- Image segmentation
- Feature extraction
- OCR capabilities

## Framework Support

- PyTorch
- TensorFlow
- OpenCV
- ONNX runtime

## Integrations

Works with: `ml-pipeline`, `rag-architect`
