<h1 align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/f/f1/Vitejs-logo.svg" width="55" height="55" alt="Aptiv Logo" />
  <br>Aptiv
</h1>

<p align="center">
  <strong>Enterprise-Grade AI-Powered Bulk Resume Screening Platform</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" alt="Clerk" />
  <img src="https://img.shields.io/badge/Framer_Motion-10-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
</p>

---

## 🎯 Executive Overview

**Aptiv** is an AI-driven screening pipeline engineered for rapid talent acquisition. It automates high-volume resume evaluation, transforming raw candidate data into structured analytics to accelerate hiring pipelines from days to minutes.

    📁 Job Description + 📄 Bulk CVs (PDF)
               │
               ▼
       ⚙️ n8n Orchestration
               │
               ▼
     📊 Ranked Analytical Report ──► [ Fit Scores | Core Gaps | Actionable Selection ]

---

## ✨ Core Capabilities

* **🔒 Enterprise Security:** Unified authentication powered by Clerk via Google OAuth and RBAC frameworks.
* **⚡ High-Throughput Ingestion:** Concurrent processing for 50+ candidate profiles per session with live evaluation states.
* **📊 Multi-Dimensional Analytics:** Deep-learning fit scoring (0-10), automated gap analysis, and programmatic hiring recommendations.
* **💎 Premium Interface:** Immersive UI featuring cursor-reactive gradients and high-fidelity Framer Motion transitions.

---

## 🛠️ Technology Stack

| Layer | Architecture |
| :--- | :--- |
| **Frontend Framework** | Next.js 14 (App Router) |
| **Language & Styling** | TypeScript & Tailwind CSS |
| **Authentication** | Clerk Auth |
| **State Management** | React Query + Context API |
| **Orchestration & AI** | n8n Webhooks & Groq AI Engine (gpt-oss-120b) |
| **Data Topology** | Google Drive Ecosystem & Google Sheets API |
| **Deployment** | Vercel Edge Network |

---

## 🏗️ System Architecture

    ┌─────────────────────────────────────────────────────────┐
    │                    Next.js Frontend                     │
    │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
    │  │ Landing UI   │  │ Analytics    │  │ Screening    │   │
    │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │
    │         └─────────────────┼─────────────────┘           │
    │                           ▼                             │
    │                     /api/screen                         │
    └───────────────────────────┬─────────────────────────────┘
                                │ (multipart/form-data)
                                ▼
                   ┌─────────────────────────┐
                   │    n8n Workflow Engine  │
                   └────────────┬────────────┘
                                ▼
       ┌────────────────────────┼────────────────────────┐
       ▼                        ▼                        ▼
    ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
    │ Google Drive │     │   Groq AI    │     │Google Sheets │
    │  (Storage)   │     │ (Evaluation) │     │ (Analytics)  │
    └──────────────┘     └──────────────┘     └──────────────┘

---

## 🚀 Deployment

### Prerequisites
* Node.js 18+
* NPM / Yarn Package Manager

### Installation

    git clone https://github.com/JunaidAhmed13/Aptiv.git
    cd Aptiv
    npm install
    npm run dev

---

## 📊 Integration API

### Request Specification
`POST /api/screen` (Content-Type: `multipart/form-data`)

| Parameter | Data Type | Requirement |
| :--- | :--- | :--- |
| `JD` | File (`.pdf`) | Single Source Job Specification |
| `CV*` | File (`.pdf`) | Array of Target Candidate Profiles |

### Response Schema

    {
      "candidates": [
        {
          "full_name": "Jane Doe",
          "email": "jane@example.com",
          "position": "Senior Software Engineer",
          "overall_fit_score": 8.7,
          "recommendation": "Strong recommend — excellent technical alignment",
          "strengths": "Leadership, System Architecture",
          "concerns_or_gaps": "Limited cloud-native experience",
          "submitted_date": "20260625-143022"
        }
      ]
    }

---

## 🧪 Strategic Roadmap

- [ ] Domain multi-tenancy and data isolation.
- [ ] Relational persistence for historic evaluation querying.
- [ ] Automated downstream candidate notification funnels.
- [ ] Specialized analytical reporting exports (PDF/CSV formats).

---

## 👨‍💻 Engineering

**Junaid** — AI Automation & Systems Architecture

<p align="center">
  <sub>Proprietary Software Solutions. All Rights Reserved.</sub>
</p>
