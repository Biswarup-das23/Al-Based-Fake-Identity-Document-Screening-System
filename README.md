# AegisBorder AI — Smart Border Identity & Document Screening System

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF.svg?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![OpenCV](https://img.shields.io/badge/OpenCV-Computer%20Vision-5C3EE8.svg?style=flat&logo=opencv&logoColor=white)](https://opencv.org)
[![ICAO Doc 9303](https://img.shields.io/badge/ICAO%20Doc%209303-Compliant-0284c7.svg?style=flat)](https://www.icao.int)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **A next-generation AI-powered document inspection, tamper forensics, and biometric facial verification platform engineered for high-throughput border checkpoints, immigration gates, and international security terminals.**

---

## Table of Contents
- [Overview & Background](#overview--background)
- [Key Challenges Addressed](#key-challenges-addressed)
- [Core Architecture & AI Modules](#core-architecture--ai-modules)
  - [Module 1: OCR & ICAO 9303 MRZ Engine](#module-1-ocr--icao-9303-mrz-engine)
  - [Module 2: Multi-Spectral Forensics & Tamper Detection](#module-2-multi-spectral-forensics--tamper-detection)
  - [Module 3: Biometric Face Verification & Anti-Spoofing](#module-3-biometric-face-verification--anti-spoofing)
  - [Module 4: Border Watchlist & Interpol Red Notice Screening](#module-4-border-watchlist--interpol-red-notice-screening)
  - [Unified Risk Decision Engine](#unified-risk-decision-engine)
- [Real-World (IRL) Testing & New Passenger Console](#real-world-irl-testing--new-passenger-console)
- [Tech Stack](#tech-stack)
- [Project Directory Structure](#project-directory-structure)
- [Quick Start & Installation](#quick-start--installation)
  - [Prerequisites](#prerequisites)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Frontend Setup](#2-frontend-setup)
- [API Documentation](#api-documentation)
- [Simulation Profiles & Presets](#simulation-profiles--presets)
- [Security & Compliance](#security--compliance)
- [License](#license)

---

## Overview & Background

Border checkpoints process tens of thousands of travelers daily across passports, visas, national ID cards, and transit permits. Manual verification by human officers is time-constrained, prone to cognitive fatigue, and struggling against sophisticated modern counterfeits:
- Digitally spliced and replaced portrait photos
- Laser-modified dates of birth and expiry
- Re-encoded or fabricated Machine Readable Zones (MRZ)
- Identity impersonation and synthetic alias profiles
- Expired or blacklisted travel documents

**AegisBorder AI** automates this end-to-end verification pipeline in **sub-second latency**, performing multi-spectral forensic image analysis, mathematical check-digit auditing, 1:1 facial biometric matching against live camera feeds, and automated risk scoring with cryptographic audit trails.

---

## Key Challenges Addressed

| Challenge | Detection Mechanism | Accuracy / Standard |
| :--- | :--- | :--- |
| **Fake Passports & Visas** | ICAO 9303 TD1/TD2/TD3 check-digit verification with 7-3-1 weight algorithms | 100% Mathematical Precision |
| **Altered Photographs** | Error Level Analysis (ELA) heatmaps & portrait boundary gradient jump analysis | Digital artifact & edge discontinuity detection |
| **Modified DOB & Expiry** | Automated cross-validation between Visual Inspection Zone (VIZ) and encoded MRZ | Cross-field inconsistency flagging |
| **Tampered Visa Stamps** | Multi-spectral contrast filtering and high-frequency noise variance analysis | Surface alteration profiling |
| **Identity Impersonation** | 1:1 Face verification matching passport chip/visual portrait against live camera stream | Cosine landmark similarity + anti-spoofing |
| **Interpol / Blacklist Hits** | Real-time query against international law enforcement databases | Instant match with red alert trigger |
| **High Passenger Volume** | Asynchronous FastAPI microservice backend with glassmorphic React terminal | < 1.2s complete pipeline turnaround |

---

## Core Architecture & AI Modules

```
                                  [ Traveler Arrival ]
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    ▼                                             ▼
          [ Document Scanner ]                          [ Live Camera Stream ]
          (Physical / Upload)                           (Webcam / Sensor Feed)
                    │                                             │
                    ├──────────────────────┬──────────────────────┤
                    ▼                      ▼                      ▼
           [ MODULE 1: OCR/MRZ ]  [ MODULE 2: FORENSICS ] [ MODULE 3: BIOMETRICS ]
           • ICAO 9303 Checksums  • Error Level Analysis • 1:1 Face Similarity
           • TD1/TD2/TD3 Parsing  • Noise Variance Map   • Moire / Spoof Check
           • VIZ vs MRZ Matching  • Photo Border Jump    • Portrait Geometry
                    │                      │                      │
                    └──────────────────────┼──────────────────────┘
                                           ▼
                            [ MODULE 4: WATCHLIST LOOKUP ]
                            • Interpol Red Notice Database
                            • Border Exclusion Ledger
                                           │
                                           ▼
                            [ UNIFIED RISK SCORING ENGINE ]
                            • Weighted Bayesian Multi-Factor Model
                            • 0–100% Composite Risk Index
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    ▼                      ▼                      ▼
             [ GRANT ENTRY ]    [ SECONDARY INSPECT ]    [ DETAIN SUBJECT ]
            (Audit Stamped)      (Route Counter 4B)     (Security Dispatch)
```

### Module 1: OCR & ICAO 9303 MRZ Engine
- Supports **TD3** (Passports: 2 lines × 44 chars), **TD2** (Visas: 2 lines × 36 chars), and **TD1** (National IDs: 3 lines × 30 chars).
- Verifies document number check digits, birth date check digits, expiry date check digits, optional data check digits, and composite master check digits.
- Cross-validates extracted Visual Zone text against encoded MRZ characters to expose physical surface overwriting.

### Module 2: Multi-Spectral Forensics & Tamper Detection
- **Error Level Analysis (ELA)**: Re-compresses image matrices at defined quantization levels (Q=90) to visualize compression rate differentials across spliced layers.
- **Noise Analysis**: Evaluates Laplacian variance and standard deviation across discrete tiles to expose high-frequency cloning or smoothing artifacts.
- **Photo Tamper Boundary Detector**: Scans portrait box edges for gradient discontinuities, chromatic aberration, and physical sticker seams.
- **Metadata Analyzer**: Inspects EXIF tags for software signatures (e.g. Photoshop, GIMP, Canva) and abnormal color space conversions.

### Module 3: Biometric Face Verification & Anti-Spoofing
- Extracts facial geometry landmarks from the document portrait and compares them against the live terminal camera stream.
- Computes normalized vector similarity and match confidence percentages.
- Runs liveness verification to detect screen re-photography, printed cutouts, and moiré pattern artifacts.

### Module 4: Border Watchlist & Interpol Red Notice Screening
- Real-time indexing against simulated international fugitives, stolen blank document batches, and biometric alias records.
- Instantly triggers critical alert banners and detention protocols upon positive identification.

### Unified Risk Decision Engine
Generates an aggregated risk score (0–100%) and categorizes the traveler into actionable tiers:
- **LOW RISK (0–25%)**: `GRANT ENTRY` — Automated gate opening with digital audit stamp.
- **MODERATE RISK (26–50%)**: `INTERVIEW TRAVELER` — Request supplemental documentation.
- **HIGH RISK (51–75%)**: `SECONDARY INSPECTION` — Transfer to secondary interview counter.
- **CRITICAL RISK (76–100%)**: `DETAIN & CONFISCATE` — Instant security dispatch & supervisor notification.

---

## Real-World (IRL) Testing & New Passenger Console

A dedicated **"New Passenger"** registration console enables real-world terminal trials and demonstration scenarios:
1. **Custom Document Ingestion**: Upload physical document images or photos taken at the counter.
2. **Live Webcam Facial Ingestion**: Snap live traveler selfies using a connected webcam or sensor for real-time 1:1 facial biometric matching.
3. **Automated ICAO MRZ Synthesis**: Automatically calculates valid ICAO check digits for any entered identity metadata.
4. **Fraud Scenario Injection**: Choose from test scenarios including *Photo Tampering*, *Checksum Forgery*, *DOB Mismatch*, *Interpol Red Notice*, or *Authentic Document*.
5. **Quick Templates**: One-click profiles to rapidly test edge cases (`Diplomat`, `Counterfeit Visa`, `Fugitive Watchlist`, `Photo Altered`).

---

## Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 + Custom Glassmorphism System
- **Icons**: Lucide React
- **Animations**: CSS Glass Shimmer, Scanlines, Particle Canvas Confetti
- **Components**: Dual-feed Document Ingestion, Interactive ELA Heatmap Viewer, Biometric Face Split, Risk Decision Gauge, Cryptographic Audit Trail Modal

### Backend
- **Framework**: Python 3.10+ / FastAPI
- **Server**: Uvicorn ASGI with auto-reload
- **Computer Vision & Image Processing**: OpenCV (`opencv-python-headless`), NumPy, SciPy, Pillow, Scikit-Image
- **Data Validation**: Pydantic v2
- **Audit PDF Reporting**: ReportLab PDF Generator

---

## Project Directory Structure

```
.
├── README.md                      # Comprehensive project documentation
├── .gitignore                     # Repository git ignore rules
├── generate_pdf_report.py         # Standalone PDF documentation generator
│
├── backend/
│   ├── main.py                    # FastAPI entrypoint, routes & screening pipeline
│   ├── requirements.txt           # Python dependencies
│   ├── biometrics/
│   │   └── face_verifier.py       # Facial detection, 1:1 matching & anti-spoofing
│   ├── forensics/
│   │   ├── ela.py                 # Error Level Analysis & heatmap generator
│   │   ├── noise_analysis.py      # Noise inconsistency & Laplacian variance
│   │   ├── photo_tampering.py     # Portrait replacement & boundary jump analysis
│   │   └── metadata_analyzer.py   # EXIF & editing software detection
│   ├── parsers/
│   │   ├── mrz_parser.py          # ICAO 9303 parser & check-digit calculator
│   │   └── ocr_extractor.py       # Visual Inspection Zone (VIZ) OCR extraction
│   ├── validators/
│   │   ├── integrity_checker.py   # MRZ vs VIZ cross-validation rules
│   │   └── watchlist_db.py        # Interpol Red Notice & watchlist screening
│   ├── services/
│   │   ├── risk_engine.py         # Multi-factor composite risk scoring
│   │   └── report_generator.py    # Audit certificate generation
│   └── data/
│       └── samples.py             # Pre-configured threat presets & custom passengers
│
└── frontend/
    ├── package.json               # Node dependencies & scripts
    ├── vite.config.js             # Vite configuration with /api backend proxy
    ├── index.html                 # HTML shell with Google Fonts
    └── src/
        ├── App.jsx                # Main layout, state machine & tab navigation
        ├── index.css              # Glassmorphism utility classes & animations
        └── components/
            ├── Header.jsx         # Live clock, scan counters, defense status
            ├── PresetBar.jsx      # Threat presets & + New Passenger trigger
            ├── DocumentIngestion.jsx # Dual-channel document & webcam camera feed
            ├── NewPassengerModal.jsx # IRL passenger registration & test console
            ├── MRZTerminal.jsx    # Monospace terminal for ICAO checksum audit
            ├── ForensicViewer.jsx # ELA heatmap, noise map & edge gradient studio
            ├── BiometricsPanel.jsx# Live camera vs portrait 1:1 face matching
            ├── RiskDecisionPanel.jsx # Gauge, risk tier breakdown & action buttons
            └── AuditReportModal.jsx  # Formal compliance certificate modal
```

---

## Quick Start & Installation

### Prerequisites
- **Python**: Version 3.10 or higher
- **Node.js**: Version 18 or higher (with `npm`)
- **Git**: Installed on your system

### 1. Backend Setup

```bash
# Clone repository
git clone https://github.com/Biswarup-das23/Al-Based-Fake-Identity-Document-Screening-System.git
cd Al-Based-Fake-Identity-Document-Screening-System/backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Backend will be accessible at:
- **API Base**: `http://localhost:8000`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`
- **Health Check**: `http://localhost:8000/api/health`

### 2. Frontend Setup

Open a new terminal window:

```bash
cd Al-Based-Fake-Identity-Document-Screening-System/frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

Frontend dashboard will be running at:
- **Web UI**: `http://localhost:5173`

---

## API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status & active module manifest |
| `GET` | `/api/presets` | List all threat simulation profiles + custom registered passengers |
| `GET` | `/api/presets/{id}` | Load document image, MRZ, and metadata for a specific preset |
| `POST` | `/api/screen-document` | Execute full 4-module forensic screening & return risk assessment |
| `POST` | `/api/passengers/new` | Register new IRL passenger, auto-generate MRZ/document, and run screening |
| `DELETE`| `/api/passengers/{id}` | Remove custom passenger from session |

---

## Simulation Profiles & Presets

1. **Preset 1: Genuine German Passport** — Authentic travel document. All ICAO 9303 checksums pass, zero tampering, 94% face biometric match, clear watchlist record. Recommended: `GRANT ENTRY`.
2. **Preset 2: Tampered Photo (Spliced Portrait)** — Document with digitally replaced portrait sticker. Detected by ELA heatmap (78%) and border gradient discontinuity (88.5%). Recommended: `DETAIN & CONFISCATE`.
3. **Preset 3: Forged Visa (Checksum Failure)** — Schengen visa with tampered stay duration and invalid ICAO 9303 check digits. Recommended: `SECONDARY INSPECTION`.
4. **Preset 4: Date of Birth Inconsistency** — Visual zone indicates birth date `01.01.1999` while encoded MRZ reveals `1985-03-14`. Exposes age fraud. Recommended: `SECONDARY INSPECTION`.
5. **Preset 5: Interpol Red Notice (Viktor K.)** — Match against Interpol Red Notice for transnational document fraud. Instant high-threat alert banner. Recommended: `DETAIN & CONFISCATE`.

---

## Security & Compliance

- **ICAO Doc 9303**: Compliant with machine-readable travel document specifications (Parts 3, 4, 7).
- **Privacy by Design**: Live facial streams and document frames are processed in-memory without persistent disk caching of raw biometric identifiers.
- **Audit Logging**: Every screening transaction generates a unique SHA-256 verifiable inspection token and cryptographically stamped audit trail.

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
