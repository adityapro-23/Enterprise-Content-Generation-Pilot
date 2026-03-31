# ECGP - Enterprise Content Generation Pilot

**Team VicRaptors** · ET GenAI Hackathon Phase 2  
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

- **Cost of Manual Workflows** - Traditional pipelines inflate costs to `$500–$1,200+` per campaign and extend cycle times to `14+ days`
- **Governance Deficit** - Foundational LLMs are probabilistic and cannot enforce binary compliance rules, exposing enterprises to regulatory liability
- **No End-to-End Autonomous System** - Existing tools (Jasper, Copy.ai) are assistive wrappers with no unified infrastructure for creation, compliance, localization, and publishing in one governed workflow

---

## Solution Overview

ECGP introduces a paradigm shift: **from assistive AI to autonomous, self-regulating infrastructure**.

The core innovation is a strict architectural separation between:
- **Probabilistic AI agents** - handle creativity, drafting, localization, and visual composition
- **Deterministic governance scripts** - enforce brand rules, legal compliance, and pixel-level verification mathematically

Neither layer can override the other. This makes compliance a **mathematical guarantee**, not a probabilistic hope.

**Results:**

| Metric | Traditional | ECGP |
|---|---|---|
| Time per Campaign | 10–14 days | ~10 minutes |
| Cost per Campaign | $500–$1,200+ | $0.05–$0.15 |
| Human Resources | 4–6 people | 1 reviewer |
| Revision Cycles | 5–8 rounds | 1–2 gates |
| Time-to-Publish | 14+ days | ~15 minutes |

---

## System Architecture

ECGP is structured across **7 layers** with a standalone HITL Gate node. Architecture enforces strict sequential data flow - text is fully approved and cryptographically locked before visual generation begins.

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                       │
│  Admin Console · Campaign Studio · HITL Interface ·     │
│  Analytics Dashboard                                    │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│               ENTERPRISE KNOWLEDGE LAYER                │
│  Enterprise Persona Store (200-token) ·                 │
│  Workspace Config Store (immutable)                     │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│                  ORCHESTRATION LAYER                    │
│  ┌─────────────┐    ┌───────────────────────────────┐   │
│  │ API Gateway │    │     Pipeline Orchestrator     │   │
│  │             │    │     (LangGraph State Machine) │   │
│  └─────────────┘    └───────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │           GOVERNANCE LAYER (Deterministic)      │    │
│  │  Textual Governor · Regional Governor ·         │    │
│  │  Visual Governor                                │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │           INTELLIGENCE LAYER (LLM Agents)       │    │
│  │  Content Drafting Agent · Localization Agent ·  │    │
│  │  Visual Composition Agent                       │    │
│  └─────────────────────────────────────────────────┘    │
└──────────────────────────┬──────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
┌─────────▼──────┐ ┌───────▼──────┐ ┌──────▼──────────┐
│ STATE & MEMORY │ │ DATA INGEST. │ │  HITL GATE      │
│ Vector KB      │ │ Ingestion    │ │  Gate 1 · 2 · 3 │
│ Content Store  │ │ Connector    │ │  (Human Review) │
│ Translation    │ └──────────────┘ └─────────────────┘
│ Memory         │
└────────────────┘
          │
┌─────────▼──────────────────────────────────────────────┐
│                    PUBLISHING LAYER                    │
│  Publishing Agent (OAuth per channel)                  │
└─────────────────────────┬──────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│                   OBSERVATION LAYER                     │
│  Performance Analyzer · Strategy Optimizer (OODA)       │
└─────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Orchestration & Backend
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![LangGraph](https://img.shields.io/badge/LangGraph-1C3C3C?style=flat&logo=langchain&logoColor=white)
![LangSmith](https://img.shields.io/badge/LangSmith-1C3C3C?style=flat&logo=langchain&logoColor=white)

- **FastAPI** - Async backend handling long-running AI tasks without timeouts
- **LangGraph** - Cyclic state machine managing multi-agent pipeline, HITL checkpointing, and revision loops
- **LangSmith** - Full observability — every LLM call, token count, and governance rejection is traced

### AI & Semantic Layer
![Gemini](https://img.shields.io/badge/Gemini_API-4285F4?style=flat&logo=google&logoColor=white)
![Qdrant](https://img.shields.io/badge/Qdrant-DC244C?style=flat&logo=qdrant&logoColor=white)

- **Gemini API** - Powers Content Drafting Agent and Localization Agent
- **Qdrant** - Vector database storing embedded enterprise knowledge (Jira, SharePoint, CRM)
- **RAG Pipeline** - Retrieval-Augmented Generation for hyper-relevant enterprise context injection

### Governance Engines
![spaCy](https://img.shields.io/badge/spaCy-09A3D5?style=flat&logo=spacy&logoColor=white)
![Pillow](https://img.shields.io/badge/Pillow-Python-blue?style=flat)

- **spaCy + Regex** - Textual Governor: forbidden phrase detection, mandatory disclaimer verification
- **Pillow (PIL)** - Visual Governor: pixel-level RGB hex verification and logo placement analysis

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

- **Next.js + TypeScript** - Admin Console, Campaign Studio, HITL Review Interface, Analytics Dashboard
- **Tailwind CSS + Shadcn UI** - Split-screen text reviewers, masonry asset grids, telemetry charts

### State & Real-Time Sync
![Convex](https://img.shields.io/badge/Convex-EF4444?style=flat&logo=convex&logoColor=white)

- **Convex** - Reactive primary database; pushes pipeline state changes to frontend instantly at every HITL gate without polling

### Visual Generation
![Stable Diffusion](https://img.shields.io/badge/Stable_Diffusion-FF6B6B?style=flat)
![Remotion](https://img.shields.io/badge/Remotion-000000?style=flat)

- **Stable Diffusion (Hugging Face)** - Pixel-level image generation
- **Remotion** - Programmatic video rendering using locked, character-counted text strings

### Infrastructure
![AWS](https://img.shields.io/badge/AWS_EC2-FF9900?style=flat&logo=amazon-aws&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)

---

## Project Structure

```
ecgp-workspace/
├── frontend/                          # Next.js UI & Convex Database
│   ├── src/
│   │   ├── app/
│   │   │   ├── (admin)/               # Phase 0: Workspace Setup UI
│   │   │   ├── (marketing)/           # Phase 1: Campaign Initiation UI
│   │   │   └── (review)/              # HITL Gates 1, 2, 3 UI
│   │   ├── components/
│   │   │   ├── ui/                    # Buttons, Inputs, Modals (Shadcn)
│   │   │   └── ecgp/                  # Split-screen reviewers, masonry grids
│   │   ├── lib/                       # Utility functions & API callers
│   │   └── hooks/                     # Custom React hooks
│   ├── convex/
│   │   ├── schema.ts                  # Convex table definitions
│   │   ├── campaigns.ts               # Campaign CRUD operations
│   │   └── workspace.ts               # Admin rules CRUD operations
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/                           # FastAPI + LangGraph + AI Agents
│   ├── app/
│   │   ├── api/                       # FastAPI endpoints
│   │   │   └── routes/                # /initiate-campaign, /webhooks, etc.
│   │   ├── agents/                    # Isolated AI agent logic
│   │   │   ├── content_drafting.py    # Content Drafting Agent (Gemini)
│   │   │   ├── textual_governor.py    # Textual Governor (spaCy + regex)
│   │   │   ├── localization.py        # Localization Agent (Gemini)
│   │   │   ├── regional_governor.py   # Regional Governor (spaCy + rules)
│   │   │   ├── visual_composition.py  # Visual Composition Agent
│   │   │   └── visual_governor.py     # Visual Governor (Pillow)
│   │   ├── workflows/                 # LangGraph State Machines
│   │   │   ├── state.py               # Master campaign state object
│   │   │   └── main_graph.py          # Pipeline routing + HITL checkpoints
│   │   ├── models/                    # Pydantic schemas (typed payloads)
│   │   │   ├── campaign.py            # Campaign state model
│   │   │   ├── admin_rules.py         # Workspace config model
│   │   │   └── governance.py          # Governance result payload model
│   │   ├── services/                  # External service connectors
│   │   │   ├── gemini_client.py       # Gemini API client
│   │   │   ├── qdrant_client.py       # Qdrant vector DB client
│   │   │   └── convex_sync.py         # Convex real-time sync
│   │   └── core/                      # Config, env vars, LangSmith setup
│   ├── requirements.txt
│   └── main.py                        # FastAPI application entry point
│
├── infrastructure/                    # Deployment configurations
│   ├── docker/
│   │   ├── backend.Dockerfile
│   │   └── docker-compose.yml         # Local Qdrant + FastAPI setup
│   └── aws/
│       └── ec2_setup.sh               # EC2 provisioning scripts
│
├── .gitignore
└── README.md
```

---

## Setup & Installation

### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- AWS account (for EC2 deployment)
- API keys: Gemini, Qdrant Cloud, Convex, Hugging Face

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

# Configure environment variables
cp .env.example .env
# Edit .env with your API keys (see Environment Variables section below)

# Start the backend server
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.local.example .env.local
# Add your Convex deployment URL and other keys

# Run development server
npm run dev
```

### 4. Local Infrastructure (Qdrant + Services)

```bash
cd infrastructure/docker

# Spin up Qdrant vector DB locally
docker-compose up -d
```

### Environment Variables

**Backend `.env`:**
```env
GEMINI_API_KEY=your_gemini_api_key
QDRANT_URL=your_qdrant_cluster_url
QDRANT_API_KEY=your_qdrant_api_key
CONVEX_URL=your_convex_deployment_url
LANGCHAIN_API_KEY=your_langsmith_key
LANGCHAIN_TRACING_V2=true
HUGGINGFACE_API_KEY=your_hf_key
```

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Usage

### Phase 0 - Admin Workspace Setup
1. Navigate to `/admin` in the frontend
2. Configure brand kit: upload SVG logos, set primary/secondary RGB hex codes
3. Define compliance rules: forbidden phrases, mandatory legal disclaimers
4. Set audience definitions: target regions and personas
5. Connect data sources via OAuth (Jira, SharePoint, CRM)
6. Connect publishing channels via OAuth (LinkedIn, CMS, Email)

### Phase 1 - Campaign Initiation (Marketer)
1. Navigate to `/marketing/new-campaign`
2. Enter campaign brief: "We are launching a new Q4 smartwatch"
3. Select pre-approved region and persona from dropdowns
4. Upload product images (optional - if not provided, system generates visuals)
5. Define campaign KPIs and business motive
6. Click **Initialize Campaign** - pipeline starts autonomously

### HITL Review
The system automatically pauses at three gates and notifies the reviewer:
- **Gate 1** `/review/text` - Review master English text + governance audit log
- **Gate 2** `/review/localization` - Review translated strings per language
- **Gate 3** `/review/assets` - Review final visual assets; approve for publishing

### Analytics
Navigate to `/analytics` post-publish to view live engagement telemetry, AI strategy recommendations, and apply OODA loop updates.

---

## The 7-Phase Pipeline

```
Phase 0: Enterprise Onboarding
    └── Ingest 50,000+ lines → distill to 200-token Core Enterprise Persona
    └── Configure immutable workspace rules (hex codes, forbidden phrases, disclaimers)
    └── Connect OAuth data sources and publishing channels

Phase 1: Campaign Initiation
    └── Marketer submits brief + KPIs
    └── Agentic interview loop captures missing context
    └── RAG query over Qdrant retrieves relevant enterprise context

Phase 2: Content Drafting & Textual Governance
    └── Content Drafting Agent synthesizes master text (Gemini + RAG)
    └── Textual Governor runs spaCy + regex (forbidden phrases, disclaimers)
    └── [HITL Gate 1] Human reviews and locks master text

Phase 3: Localization & Regional Compliance
    └── Localization Agent checks Translation Memory → LLM transcreation
    └── Token injection masks legal text before translation
    └── Regional Governor runs LQA, re-injects legal text verbatim
    └── [HITL Gate 2] Human reviews and locks localized strings

Phase 4: Visual Generation & Pixel Verification
    └── Visual Composition Agent receives locked character-counted text
    └── Stable Diffusion (images) + Remotion (video) generation
    └── Visual Governor runs Pillow pixel analysis (RGB hex + logo placement)
    └── Auto-loop until brand compliance passes (no human involved)
    └── [HITL Gate 3] Human reviews final assets

Phase 5: Publishing
    └── Publishing Agent routes assets to LinkedIn, CMS, Email via OAuth
    └── Immutable publish audit log recorded

Phase 6: OODA Self-Optimization
    └── Performance Analyzer pulls live engagement telemetry
    └── Benchmarks against Phase 1 KPI baseline
    └── Strategy Optimizer updates orchestrator weights for next campaign
```

---

## Agent Roles

| Agent | Type | Responsibility |
|---|---|---|
| **Pipeline Orchestrator** | Orchestration (LangGraph) | Central state machine; routes all inter-agent communication exclusively |
| **Content Drafting Agent** | Intelligence (Gemini) | Synthesizes 200-token persona + RAG context into master text draft |
| **Textual Governor** | Governance (spaCy + regex) | Deterministic forbidden phrase detection and disclaimer verification |
| **Localization Agent** | Intelligence (Gemini) | Checks Translation Memory, then transcreates per locale |
| **Regional Governor** | Governance (spaCy + rules) | LQA, GDPR compliance, re-injects legal text at placeholder positions |
| **Visual Composition Agent** | Intelligence (SD + Remotion) | Generates layouts from locked character-counted text |
| **Visual Governor** | Governance (Pillow) | Pixel-level RGB hex and logo placement verification |
| **Publishing Agent** | Execution (OAuth APIs) | Distributes assets to authorized channels, logs audit trail |
| **Performance Analyzer** | Observation | Pulls post-publish telemetry, benchmarks against KPI baseline |
| **Strategy Optimizer** | Observation (OODA) | Updates orchestrator strategy weights based on performance patterns |

**Communication rule:** No agent calls another directly. All routing goes through the Pipeline Orchestrator via structured typed payloads in Convex campaign state.

---

## Key Engineering Decisions

**Deterministic Governance over LLM Self-Checking**  
A second LLM used as a compliance reviewer is still probabilistic - it can be "convinced" by a clever generation. A spaCy regex scanner cannot. Brand compliance is a mathematical guarantee, not a second opinion.

**Token Injection for Legal Disclaimers**  
Legal text is masked as `[DISCLAIMER_EU_GDPR]` before the Localization Agent receives it. The agent cannot paraphrase what it never sees. The Regional Governor re-injects the legally exact text post-translation.

**200-Token Persona over Full RAG on Every Call**  
Full enterprise context retrieval on every agent invocation causes context window saturation and inconsistent retrieval. A single distilled persona ensures every agent call has identical, stable brand grounding.

**Cryptographic Text Locking Between Phases**  
Once text is approved at a HITL gate, it is written to the Content Store with a cryptographic hash and marked immutable. Visual generation receives exact character counts - layouts can never break.

**Single-Bus Communication Architecture**  
All inter-agent communication is routed exclusively through the Pipeline Orchestrator. No agent holds a direct reference to another. This makes every handoff logged, typed, and traceable via LangSmith.

**Bounded Visual Auto-Loop with Forced Escalation**  
The Visual Governor loop has a configurable max retry threshold. After N failures, the orchestrator pauses and routes the asset to HITL with a structured pixel-level failure report - the pipeline cannot deadlock.

---

## Team

Vinayak Gawade
Aditya Patil
Advait Ithape
Amit Kumar Singh

---

*ET GenAI Hackathon Phase 2 · Team VicRaptors · 2026*
