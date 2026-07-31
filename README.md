# Prarambh — AI-Powered Onboarding OS

> **Live Demo:** [https://prarambh-rouge.vercel.app/](https://prarambh-rouge.vercel.app/)

> **Get every new hire ready from day one.**  
> Prarambh auto-generates role-specific task plans, pairs each hire with an AI mentor, and gives your HR team real-time visibility — all in a single platform.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| **AI Task Builder** | Generates role-specific onboarding plans from any job description in seconds |
| **Smart Buddy Matching** | AI pairs new hires with the right mentor based on role and experience |
| **Document Intelligence** | Upload HR policies & handbooks — AI extracts onboarding tasks automatically |
| **Live Analytics** | Real-time dashboards with completion rates, engagement scores, and risk alerts |
| **Integration Hub** | Auto-provisions Slack, GitHub, Notion and 20+ tools on day one |
| **Compliance Tracking** | Automated tracking of documents, training, and deadlines with audit trails |
| **AI Assistant (24/7)** | Chatbot trained on your company policies — answers questions, escalates issues |
| **Feedback Loops** | Milestone surveys, sentiment analysis, and improvement recommendations |

---

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion (animations)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **AI Backend**: Python (FastAPI) + LangGraph + MongoDB
- **Interactive FX**: Custom canvas DotField component (React Bits)

---

## 🚀 Getting Started

### Prerequisites
- Node.js `>=18`
- npm `>=9`

### Install & Run

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5173`.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── common/        # Navbar, Footer, Logo, AIChatWidget
│   ├── dashboard/     # AdminPanel, HRDashboard, MentorDashboard, NewHireDashboard
│   ├── landing/       # Hero, Features, HowItWorks, Testimonials, Pricing, DotField
│   ├── modals/        # All modal dialogs
│   ├── chat/          # AI chat widgets
│   └── setup/         # Setup wizard
├── pages/             # Route-level pages
├── context/           # AppContext (global state)
├── services/          # AI service layer
└── index.css          # Global styles + Tailwind config
```

---

## 👤 Role Simulation

The portal lets you explore all four perspectives:

| Role | Access |
|---|---|
| **Admin** | Full platform control — employees, mentors, documents, settings |
| **HR Manager** | Onboarding plans, AI task generation, analytics |
| **Mentor / Buddy** | Mentee tracking, task creation, AI personalization |
| **New Hire** | Personal dashboard, task progress, AI assistant |

---

## 🎨 Design System

- **Color palette**: Near-black `#0A0A0F` background · Cyan `#22D3EE` · Purple `#A855F7`
- **Typography**: System font stack, tight tracking, `clamp()` fluid sizes
- **Motion**: Framer Motion blur-in entrance, `AnimatePresence` transitions, spring physics
- **Glassmorphism**: `backdrop-blur` + `rgba` surfaces throughout

---

## 🔧 Environment Variables

Create a `.env` file in the root:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 📄 License

MIT © 2025 Prarambh
