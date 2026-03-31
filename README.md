# Enterprise Content Generation Pilot (ECGP)

### *Autonomous Multi-Agent Governance Pipeline*

**Team VicRaptors** · ET GenAI Hackathon
Vinayak Gawade · Aditya Patil · Advait Ithape · Amit Kumar Singh

---

> ECGP is a fully autonomous, self-regulating multi-agent pipeline that decouples creative generation from deterministic compliance enforcement. It replaces the entire manual enterprise content production loop while mathematically guaranteeing brand and regulatory safety at every stage.

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [Solution Overview](#solution-overview)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [The 7-Phase Pipeline](#the-7-phase-pipeline)
- [Agent Roles](#agent-roles)
- [Key Engineering Decisions](#key-engineering-decisions)
- [Team](#team)

---

## Problem Statement

Enterprise content operations remain agency-dependent and manually intensive despite the rapid growth of Generative AI. Three critical gaps define the market:

- **Cost of Manual Workflows** — Traditional pipelines inflate costs to `$500–$1,200+` per campaign and extend cycle times to `14+ days`
- **Governance Deficit** — Foundational LLMs are probabilistic and cannot enforce binary compliance rules, exposing enterprises to regulatory liability
- **No End-to-End Autonomous System** — Existing tools are assistive wrappers with no unified infrastructure for creation, compliance, localization, and publishing in one governed workflow

---

## Solution Overview

ECGP introduces a paradigm shift: **from assistive AI to autonomous, self-regulating infrastructure**.

The core innovation is a strict architectural separation between:
- **Probabilistic AI agents** — handle creativity, drafting, localization, and visual composition
- **Deterministic governance scripts** — enforce brand rules, legal compliance, and pixel-level verification mathematically

Neither layer can override the other. This makes compliance a **mathematical guarantee**, not a probabilistic hope.

### Results

| Metric | Traditional | ECGP |
|---|---|---|
| Time per Campaign | 10–14 days | ~10 minutes |
| Cost per Campaign | $500–$1,200+ | $0.05–$0.15 |
| Human Resources | 4–6 people | 1 reviewer |
| Revision Cycles | 5–8 rounds | 1–2 gates |
| Time-to-Publish | 14+ days | ~15 minutes |

---

## System Architecture

ECGP is structured across **7 layers** with a standalone HITL Gate node. Architecture enforces strict sequential data flow — text is fully approved and cryptographically locked before visual generation begins.

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                       │
│   Workspace Setup · Campaign Studio · HITL Dashboard   │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│               ENTERPRISE KNOWLEDGE LAYER                │
│   Enterprise Persona Store (200-token) ·                │
│   Workspace Config Store (immutable)                    │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│                  ORCHESTRATION LAYER                    │
│  ┌─────────────┐    ┌───────────────────────────────┐   │
│  │ API Gateway │    │     Pipeline Orchestrator     │   │
│  │             │    │    (LangGraph State Machine)  │   │
│  └─────────────┘    └───────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │           GOVERNANCE LAYER (Deterministic)      │    │
│  │   Textual Governor · Regional Governor ·        │    │
│  │   Visual Governor                               │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │           INTELLIGENCE LAYER (LLM Agents)       │    │
│  │   Content Drafting Agent · Localization Agent · │    │
│  │   Visual Composition Agent                      │    │
│  └─────────────────────────────────────────────────┘    │
└──────────────────────────┬──────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
┌─────────▼──────┐ ┌───────▼──────┐ ┌──────▼─────────┐
│ STATE & MEMORY │ │ DATA INGEST. │ │   HITL GATE    │
│ Vector KB      │ │ Ingestion    │ │ Gate 1 · 2 · 3 │
│ Content Store  │ │ Connector    │ │ (Human Review) │
│ Translation    │ └──────────────┘ └────────────────┘
│ Memory         │
└────────────────┘
          │
┌─────────▼──────────────────────────────────────────────┐
│                    PUBLISHING LAYER                    │
│   Publishing Agent (OAuth per channel)                 │
└─────────────────────────┬──────────────────────────────┘
                          │
┌─────────────────────────▼──────────────────────────────┐
│                   OBSERVATION LAYER                    │
│   Performance Analyzer · Strategy Optimizer (OODA)     │
└────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Orchestration & Backend

| Tool | Purpose |
|---|---|
| **FastAPI** | Async backend handling long-running AI tasks without timeouts, managing background tasks |
| **LangGraph** | Cyclic state machine managing multi-agent pipeline, HITL checkpointing, and visual revision loops |
| **LangSmith** | Full observability — every LLM call, token count, and governance rejection is traced |

### AI & Semantic Layer

| Tool | Purpose |
|---|---|
| **OpenAI API (GPT-4o)** | Powers the Content Drafting Agent and Localization/Transcreation Agent |
| **Qdrant** | Vector database storing embedded enterprise knowledge (uploaded assets, campaign briefs) |
| **RAG Pipeline** | Strict fallback retrieval system for injecting hyper-relevant user context |

### Governance Engines

| Tool | Purpose |
|---|---|
| **spaCy + Regex** | Textual Governor: forbidden phrase detection, mandatory disclaimer verification |
| **Pillow (PIL)** | Visual Governor: pixel-level image verification and iterative refinement routing |

### Frontend

| Tool | Purpose |
|---|---|
| **Next.js + TypeScript** | App Router powering the Main Dashboard, Workspace Setup, and Campaign Studio |
| **Tailwind CSS + Glassmorphism** | Highly responsive, modern aesthetic UI with real-time execution states |

### State & Real-Time Sync

| Tool | Purpose |
|---|---|
| **Convex** | Reactive primary database; pushes pipeline state changes from Python backend to Next.js frontend instantly via WebSockets at every HITL gate |

### Visual Generation

| Tool | Purpose |
|---|---|
| **OpenAI DALL-E 3** | Generates high-fidelity visual assets guided by locked master text and brand constraints |

---

## Project Structure

```
ecgp-workspace/
├── frontend/                           # Next.js UI & Convex Database
│   ├── src/
│   │   ├── app/
│   │   │   ├── main/                   # Main Dashboard
│   │   │   ├── workspace/              # Phase 0: Rules, Guidelines, Configs
│   │   │   └── campaigns/              # Phase 1: Initiation & Phase 2–4: Execution
│   │   │       ├── new/                # Campaign Builder
│   │   │       └── [id]/execute/       # Real-time Orchestration UI & HITL Gates
│   │   └── components/ui/              # Shared UI components
│   ├── convex/
│   │   ├── schema.ts                   # Convex table definitions
│   │   ├── campaigns.ts                # Campaign CRUD & state mutations
│   │   └── workspace.ts                # Admin rules CRUD operations
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/                            # FastAPI + LangGraph + AI Agents
│   ├── app/
│   │   ├── api/
│   │   │   └── routes.py               # /initiate, /approve-gate, /stop
│   │   ├── agents/
│   │   │   ├── knowledge_to_content.py # Content Drafting Agent (GPT-4o)
│   │   │   ├── textual_governance.py   # Textual Governor (spaCy + regex)
│   │   │   ├── localization.py         # Localization Agent (GPT-4o)
│   │   │   ├── visual_governance.py    # Visual Governor (Pillow)
│   │   │   └── ...
│   │   ├── workflows/
│   │   │   ├── state.py                # Master campaign state object (TypedDict)
│   │   │   └── main_graph.py           # 6-Node pipeline routing + HITL checkpoints
│   │   ├── models/                     # Pydantic schemas
│   │   ├── services/
│   │   │   └── convex_sync.py          # Async Convex real-time sync
│   │   └── core/                       # Configs & env handlers
│   ├── requirements.txt
│   └── main.py                         # FastAPI entry point
│
├── .gitignore
└── README.md
```

---

## Setup & Installation

### Prerequisites

- Python 3.11+
- Node.js 18+
- API keys: OpenAI, Convex

### 1. Clone the Repository

```bash
git clone https://github.com/adityapro-23/Enterprise-Content-Generation-Pilot.git
cd Enterprise-Content-Generation-Pilot
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
touch .env
# Edit .env with your API keys (see Environment Variables below)

# Start the backend server
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Convex and the Next.js development server
npx convex dev
npm run dev
```

### Environment Variables

**Backend `backend/.env`:**

```env
OPENAI_API_KEY=sk-your_openai_api_key
CONVEX_URL=https://your_convex_deployment_url.convex.cloud
QDRANT_URL=http://localhost:6333
LANGCHAIN_TRACING_V2=false
```

**Frontend `frontend/.env.local`:**

```env
NEXT_PUBLIC_CONVEX_URL=https://your_convex_deployment_url.convex.cloud
```

---

## Usage

### Phase 0 — Admin Workspace Setup

1. Navigate to `/workspace/setup`
2. Define brand identity, primary colors, typography, and target personas
3. Establish strict compliance rules and forbidden phrases
4. Save to secure these rules immutably in Convex

### Phase 1 — Campaign Initiation

1. Navigate to `/campaigns/new`
2. Enter the creative objective and target demographics
3. Toggle **Enable Localization** if regional translation is required
4. Upload reference assets to be embedded as primary context
5. Click **Launch Campaign** — the LangGraph pipeline starts autonomously in the background

### HITL Review — Execution Dashboard

The system automatically routes you to `/campaigns/[id]/execute` and pauses at three distinct gates:

| Gate | What to Review | Action |
|---|---|---|
| **Gate 1 — Text Audit** | GPT-4o master draft + Textual Governance audit log | Approve to lock the string |
| **Gate 2 — Localization** | Localized translations per target language | Approve or regenerate with feedback |
| **Gate 3 — Visual Assets** | Final DALL-E 3 generated assets | Approve or use "Regenerate with Feedback" to loop back |

---

## The 7-Phase Pipeline

```
Phase 0: Enterprise Onboarding
    └── Ingest brand rules → store in Workspace Config Store
    └── Configure immutable governance boundaries (forbidden phrases, disclaimers)

Phase 1: Campaign Initiation
    └── Marketer submits brief + objective + uploaded files
    └── State payloads serialized and sent to LangGraph Orchestrator

Phase 2: Content Drafting & Textual Governance
    └── Content Drafting Agent synthesizes prompt and fallback assets (GPT-4o)
    └── Textual Governor runs deterministic audit against forbidden phrases
    └── [HITL Gate 1] Human reviews, applies feedback, and locks master text

Phase 3: Localization & Regional Compliance
    └── Localization Agent adapts tone/spelling or transcreates (GPT-4o)
    └── Regional Governor audits adaptation
    └── [HITL Gate 2] Human reviews and locks localized strings

Phase 4: Visual Generation & Pixel Verification
    └── Visual Composition Agent generates media (DALL-E 3)
    └── Visual Governor runs pixel/format verification
    └── Auto-loop up to 3 iterations if brand constraints fail
    └── [HITL Gate 3] Human reviews final visual assets

Phase 5: Publishing  *(Future Scope)*
    └── Publishing Agent routes assets to channels via OAuth
    └── Immutable publish audit log recorded

Phase 6: OODA Self-Optimization  *(Future Scope)*
    └── Performance Analyzer pulls live engagement telemetry
    └── Strategy Optimizer updates orchestrator weights for next campaign
```

---

## Agent Roles

| Agent | Type | Responsibility |
|---|---|---|
| **Pipeline Orchestrator** | Orchestration (LangGraph) | Central state machine; routes all inter-agent communication, tracks iterations, manages checkpoints |
| **Content Drafting Agent** | Intelligence (GPT-4o) | Synthesizes brief, constraints, and file assets into master text draft |
| **Textual Governor** | Governance (Python) | Deterministic forbidden phrase detection and compliance auditing |
| **Localization Agent** | Intelligence (GPT-4o) | Transcreates or regionally adapts English content based on toggle flags |
| **Regional Governor** | Governance (Python) | Audits the output of the localization engine |
| **Visual Composition Agent** | Intelligence (DALL-E 3) | Generates high-fidelity images based on cryptographically locked text and brief |
| **Visual Governor** | Governance (Python + Pillow) | Validates asset generation and triggers iteration loops if constraints fail |

> **Communication rule:** No agent calls another directly. All routing goes through the Pipeline Orchestrator via structured `TypedDict` payloads synced to the Convex database.

---

## Key Engineering Decisions

**Deterministic Governance over LLM Self-Checking**  
A second LLM used as a compliance reviewer is still probabilistic — it can be "convinced" by a clever generation. A strict Python-based governance script cannot. Brand compliance is a mathematical guarantee, not a second opinion.

**Strict Knowledge Fallback Strategy**  
If vector database retrieval fails or is empty, the LLM is fenced completely via system prompts to rely only on explicitly uploaded session files — eliminating external hallucination risks.

**Non-Blocking FastAPI with Background Tasks**  
Because AI generation and LangGraph cycles are long-running, pipeline invocation is pushed to `asyncio` background tasks. This prevents server lockups and allows Convex to push real-time loading states directly to the UI.

**In-Memory Graph State Checkpointing**  
LangGraph uses `MemorySaver` to natively pause the entire execution pipeline, allowing human reviewers at Gates 1, 2, and 3 to inject feedback without breaking the execution flow or losing prior generative work.

**Bounded Visual Auto-Loop with Forced Escalation**  
The Visual Governor loop has a strict max retry threshold (`visual_iteration`). After 3 failures, the orchestrator pauses and routes the asset directly to the HITL gate — ensuring the pipeline never deadlocks or drains excessive API credits.

---

## Team

| Name | Role |
|---|---|
| **Vinayak Gawade** | Architecture & Backend |
| **Aditya Patil** | Frontend & Convex |
| **Advait Ithape** | AI Agents & LangGraph |
| **Amit Kumar Singh** | Governance & Infrastructure |

---

*ET GenAI Hackathon · Team VicRaptors · 2026*