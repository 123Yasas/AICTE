# AICTE SmartVerify AI

**Intelligent Application Validation, Document Authentication & Regulatory Compliance Platform**  
Designed for the All India Council for Technical Education (AICTE) and technical education institutions across India.

---

## 🏛️ Project Overview

**AICTE SmartVerify AI** is an advanced AI-powered regulatory platform built to streamline the scrutiny of technical institution approval applications under the **AICTE Approval Process Handbook (APH 2026-27)**.

The system empowers both **Institutional Applicants** (Principals / Registrars) and **AICTE Scrutiny Officers**:
- Automates preliminary completeness and statutory ratio validation (Cadre 1:15, Land norms, Built-up area).
- Extracts structured key-value pairs from complex legal certificates via deep OCR.
- Detects potential anomalies, duplicate file hashes (SHA-256), and metadata divergence.
- Queries authorized external repositories (State Fire Services, University Portals, Bhulekh Land Records, Digilocker/NAD).
- Tracks deficiencies through structured replacement workflows and revalidations.
- Enforces strict human-in-the-loop regulatory ethics: **AI acts as a decision-support copilot and never automatically declares fraud or rejects institutions.**

---

## 🚀 Key Features & Modules

1. **National Landing Portal**:
   - Hero section, dynamic live metrics computed from real demo datasets, 8 interactive feature highlights, and a 6-step horizontal workflow.
2. **Main Application Dashboard**:
   - 6 colorful interactive statistic cards with trend markers.
   - Status distribution Donut Chart, Application Intake timeline Area Chart, Verification Outcomes Bar Chart, Deficiencies by Category Bar Chart.
   - Recent applications table with real-time search, filters, pagination, and quick review links.
3. **5-Step Application Creation Wizard**:
   - Step 1: Institutional Identity & Coordinates
   - Step 2: Regulatory Category & Academic Norms (Intake, Faculty, Land)
   - Step 3: Document Staging & Category Tagging
   - Step 4: Pre-flight AI Rules Check
   - Step 5: Review & Statutory Confirmation (with confetti trigger)
4. **Interactive Document Upload & Management**:
   - Drag-and-drop file uploader, category selector, file size calculator, and mandatory APH checklist status tags.
5. **OCR Extraction Workspace**:
   - Side-by-side view with visual document canvas, highlighted extracted fields, OCR confidence score, and interactive field correction tools.
6. **Intelligent Validation Engine**:
   - Automated rules engine checking completeness, expiry dates, institutional name mismatch (Levenshtein distance), and faculty ratios.
7. **Forensic Anomaly & Tamper Scanner**:
   - Duplicate file hash detection, metadata inspection, and visual bounding box overlays with "Potential Anomaly Detected — Verification Required" tags.
8. **Document Authentication Centre**:
   - 7-step verification workflow with adapters for State Fire Services, State Land Portals, University Registries, and QR Code Digital Signatures.
9. **Regulatory Compliance Checker**:
   - Compliance matrix evaluating applications against APH Handbook rules (e.g. Fire Safety, Cadre ratios, Built-up space, NBA/NAAC accreditation).
10. **Infrastructure Evidence Review**:
    - Computer vision assisted analysis of uploaded classroom, computer lab, library, and mechanical workshop photographs.
11. **Smart Deficiency Tracking**:
    - Deficiency lifecycle management with replacement document upload modals and instant revalidation triggers.
12. **AICTE Officer Workspace**:
    - Split-screen review cockpit: left document viewer with zoom/page controls and right scrutiny decision tools (Confirm Discrepancy, Dismiss Flag, Recommend Physical Inspection, Sign Observations).
13. **Reports & Printable Dossiers**:
    - Official AICTE formatted printable summary dossier (`window.print()`) and full CSV export generator.
14. **Audit Trail & Transparency**:
    - Immutable chronological event logging tracking all uploads, OCR parses, rule evaluations, and officer actions.
15. **Rule Configuration Console**:
    - Admin rule manager to add, edit, version, and enable/disable APH regulatory formulas.

---

## 👥 Demo Access & User Roles

Switch roles instantly using the **Demo Mode switcher** in the top navigation bar or user profile dropdown:

| Role | Demo Persona | Capabilities |
| :--- | :--- | :--- |
| **College / Institution** | Dr. Ramesh Kumar (Principal) | File new applications, upload statutory documents, review deficiencies, upload replacements, export dossiers. |
| **AICTE Reviewing Officer** | Smt. Ananya Sharma (Regional Scrutiny Officer) | Split-screen officer review desk, adjudicate findings, confirm discrepancies, dismiss flags, request physical inspections. |
| **Administrator** | Dr. Vivek Swaminathan (Director of Approvals) | Configure APH regulatory rules, manage user roles and institutions, inspect audit trails, adjust system retention. |

---

## 💻 Tech Stack

- **Framework**: React 19 (TypeScript) + Vite
- **Styling**: Tailwind CSS (Light-blue & navy government-tech aesthetic)
- **Icons**: Lucide React
- **Charts**: Recharts (Pie/Donut, Area, Bar, Horizontal Bar)
- **Effects**: canvas-confetti
- **State & Storage**: React Context with reactive local persistence

---

## 🛠️ Local Development Setup

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or bun

### 2. Installation
```bash
npm install
```

### 3. Running the Development Server
```bash
npm run dev
```
The application will launch on `http://localhost:3000`.

### 4. Building for Production
```bash
npm run build
```

---

## ⚖️ Regulatory Disclaimer

*This platform is an AI-assisted decision-support system developed for educational and hackathon demonstration purposes. Findings and observations generated by AI models are advisory and subject to verification by competent AICTE regulatory authorities. Official statutory approvals, rejections, and inspections remain with the competent AICTE councils and state directorates.*
