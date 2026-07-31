# Prarambh: AI-Assisted Onboarding OS

> **Attribution Note:** This project builds upon the open-source "OnboardEase" project as its foundational base per hackathon rules. We acknowledge and thank the original authors for their open-source contributions. 
> 
> **Prarambh Delta:** We have overhauled the base platform to serve as an enterprise-grade "AI-Assisted Onboarding OS", adding enhanced workflows, security optimizations, deeper AI integrations, and a refined enterprise UI tailored for large-scale deployments.

---

## Overview

**Prarambh** is a comprehensive, enterprise-ready AI-Assisted Onboarding OS designed to streamline the new-hire experience from day one. By unifying HR teams, managers, mentors, and new hires in a single platform, Prarambh leverages advanced AI to auto-generate personalized onboarding task plans, track progress, and provide interactive, real-time tools that accelerate ramp-up time.

---

## Key Features

| Feature | Description |
|---|---|
| **Role-based Dashboards** | Tailored views and controls for New Hires, Mentors, Admins, and HR professionals. |
| **AI Task Builder** | Intelligent onboarding task generation based on job roles, resumes, and enterprise requirements, powered by LangGraph. |
| **Bulk Task Generation** | One-click generation of complete onboarding plans for entire cohorts. |
| **Interactive Code Playground** | Embedded Monaco editor with a real PTY bash terminal via WebSocket for technical onboarding. |
| **AI Context-Aware Chat** | An advanced, GPT-powered onboarding assistant that provides immediate support and answers. |
| **Secure Document Management** | Inline PDF viewing for onboarding documents and policies. |
| **Mentorship & Tracking** | Seamlessly assign mentors, track employee progress, and ensure accountability. |

---

## Tech Stack

### Frontend
- **React 18** + **TypeScript**
- **Vite** — High-performance build tooling & dev server
- **Tailwind CSS** — Utility-first, enterprise-grade styling
- **React Router v6** — Robust client-side routing
- **Monaco Editor & xterm.js** — Integrated IDE and terminal emulator
- **Axios** — Seamless API integrations

### Backend (`onboarding-agent/`)
- **FastAPI** — High-performance REST API + WebSocket server
- **LangGraph & LangChain** — Complex agentic AI workflows and intelligent task orchestration
- **PyPDF2** — Efficient resume and document parsing
- **ptyprocess** — Real PTY shell for the interactive code playground

---

## Project Structure

```
Prarambh/                  # React/Vite frontend
├── src/
│   ├── pages/             # Route-level page components
│   ├── components/        # Reusable UI components and modules
│   ├── context/           # Global application state management
│   └── services/          # API and AI service integrations
├── vite.config.ts         # Vite configuration
└── package.json           # Frontend dependencies

onboarding-agent/          # Python FastAPI backend
├── main.py                # FastAPI app, REST endpoints, WebSocket PTY
├── agent.py               # LangGraph onboarding agent logic
├── models.py              # Data models and schemas
└── requirements.txt       # Backend dependencies
```

---

## Getting Started

### Prerequisites
- Node.js >= 18
- Python >= 3.12
- pip

### Frontend Setup

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

### Backend Setup

```bash
cd onboarding-agent

# Install Python dependencies
pip install -r requirements.txt
```

Create a `.env` file in the `onboarding-agent/` directory:
```env
PORT=3016
```

Start the backend service:
```bash
python main.py
```
*The API will be available at `http://localhost:3016`.*

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | System health check |
| `POST` | `/api/generate` | Generate onboarding tasks from role/context |
| `POST` | `/api/refine` | Refine existing tasks using AI |
| `POST` | `/api/parse-resume` | Extract information from uploaded resumes (PDF/TXT) |
| `WS` | `/ws/pty` | WebSocket PTY terminal session |

---

## Enterprise Roles & Access

| Role | Access Level |
|---|---|
| **New Hire** | Personal task dashboard, AI chat assistant, code playground, and document viewer. |
| **Mentor** | Progress tracking for assigned new-hires and task management. |
| **Admin** | Full system control, employee/mentor management, bulk generation, and analytics. |
| **HR** | Employee records and high-level onboarding progress overviews. |

---

## License

Copyright © 2026 Prarambh. All rights reserved.
Author: divyansh Kumar
