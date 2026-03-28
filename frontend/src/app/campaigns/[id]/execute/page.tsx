'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, use } from 'react';

// ───────────────────────────────────────────────────────────────
// TYPES
// ───────────────────────────────────────────────────────────────
type ExecutionState = 'PROCESSING' | 'GATE_1_TEXT' | 'GATE_2_LOCALIZATION' | 'GATE_4_VISUALS';

interface PipelinePhase {
  id: string;
  label: string;
  description: string;
  status: 'pending' | 'running' | 'done' | 'error' | 'paused';
}

interface FeedbackState {
  open: boolean;
  text: string;
}

// ───────────────────────────────────────────────────────────────
// MOCK DATA
// ───────────────────────────────────────────────────────────────
const MOCK_MASTER_TEXT = {
  headline: 'Stop manually debugging broken PRs.',
  body: 'The AutoHeal Agent is now generally available. Integrating natively with GitHub Actions, it autonomously resolves code repository errors and manages safe deployments to your AWS EC2 infrastructure. Reclaim your engineering hours.',
};

const MOCK_LOCALIZED_TEXT = {
  en_US: {
    headline: 'Stop manually debugging broken PRs.',
    body: 'The AutoHeal Agent is now generally available. Integrating natively with GitHub Actions...',
    char_count: 243,
  },
  es_ES: {
    headline: 'Deje de depurar manualmente los PR rotos.',
    body: 'El AutoHeal Agent ya está disponible. Integrándose de forma nativa con GitHub Actions, resuelve de forma autónoma errores de repositorios...',
    char_count: 261,
  },
  de_DE: {
    headline: 'Schluss mit dem manuellen Debuggen fehlerhafter PRs.',
    body: 'Der AutoHeal Agent ist jetzt allgemein verfügbar. Er integriert sich nativ in GitHub Actions und behebt Repositoryfehler autonom...',
    char_count: 237,
  },
};

const MOCK_VISUAL_ASSETS = [
  { id: 'v1', locale: 'en_US', format: 'LinkedIn Video', url: null, status: 'generating' },
  { id: 'v2', locale: 'es_ES', format: 'LinkedIn Video', url: null, status: 'generating' },
  { id: 'v3', locale: 'en_US', format: 'Email Banner', url: null, status: 'done' },
];

// ───────────────────────────────────────────────────────────────
// PIPELINE PHASES per state
// ───────────────────────────────────────────────────────────────
function getPipelinePhases(state: ExecutionState): PipelinePhase[] {
  const base: PipelinePhase[] = [
    { id: 'orchestrator', label: 'Orchestrator', description: 'Synthesizing workspace rules & campaign brief', status: 'done' },
    { id: 'semantic', label: 'Semantic Retrieval', description: 'Querying Qdrant knowledge base', status: 'done' },
    { id: 'knowledge_gen', label: 'Knowledge-to-Content Agent', description: 'Generating master text draft (GPT-4o)', status: state === 'PROCESSING' ? 'running' : 'done' },
    { id: 'text_gov', label: 'Textual Governance (spaCy)', description: 'Checking for forbidden phrases & disclaimers', status: state === 'PROCESSING' ? 'pending' : 'done' },
    { id: 'hitl_1', label: '🛑 HITL Gate 1 — Master Text', description: 'Awaiting human approval of master copy', status: state === 'GATE_1_TEXT' ? 'paused' : state === 'PROCESSING' ? 'pending' : 'done' },
    { id: 'localization', label: 'Localization Engine', description: 'Transcreating approved text for each locale', status: state === 'GATE_2_LOCALIZATION' || state === 'GATE_4_VISUALS' ? 'done' : state === 'GATE_1_TEXT' ? 'pending' : (state === 'PROCESSING' ? 'pending' : 'done') },
    { id: 'regional_gov', label: 'Regional Governance (LQA)', description: 'Cultural validation & GDPR compliance', status: state === 'GATE_2_LOCALIZATION' || state === 'GATE_4_VISUALS' ? 'done' : 'pending' },
    { id: 'hitl_2', label: '🛑 HITL Gate 2 — Localized Text', description: 'Awaiting human approval of translations', status: state === 'GATE_2_LOCALIZATION' ? 'paused' : state === 'GATE_4_VISUALS' ? 'done' : 'pending' },
    { id: 'liquid_content', label: 'Liquid Content Engine', description: 'Generating visuals via Stable Diffusion & Remotion', status: state === 'GATE_4_VISUALS' ? 'running' : 'pending' },
    { id: 'visual_gov', label: 'Visual Governance (Pillow)', description: 'Verifying hex codes, logo placements, text overflow', status: state === 'GATE_4_VISUALS' ? 'running' : 'pending' },
    { id: 'hitl_3', label: '🛑 HITL Gate 3 — Final Assets', description: 'Final approval before publish', status: 'pending' },
    { id: 'publish', label: 'Multi-Channel Publishing', description: 'Push to LinkedIn, email, CMS', status: 'pending' },
  ];
  return base;
}

// ───────────────────────────────────────────────────────────────
// PHASE STATUS ICON
// ───────────────────────────────────────────────────────────────
function PhaseIcon({ status }: { status: PipelinePhase['status'] }) {
  if (status === 'done') return <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center"><svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>;
  if (status === 'running') return <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" /></div>;
  if (status === 'paused') return <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /></div>;
  if (status === 'error') return <div className="w-5 h-5 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center"><svg className="w-3 h-3 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></div>;
  return <div className="w-5 h-5 rounded-full bg-slate-700/60 border border-slate-600/40 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-slate-600" /></div>;
}

// ───────────────────────────────────────────────────────────────
// LEFT PANEL — Pipeline Monitor
// ───────────────────────────────────────────────────────────────
function PipelinePanel({ state, elapsedMs }: { state: ExecutionState; elapsedMs: number }) {
  const phases = getPipelinePhases(state);
  const runningPhase = phases.find((p) => p.status === 'running' || p.status === 'paused');

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-slate-800/60">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-semibold text-slate-200 text-sm">AI Pipeline — Live Monitor</h2>
          <span className="font-mono text-xs text-slate-500">{(elapsedMs / 1000).toFixed(1)}s</span>
        </div>
        {runningPhase && (
          <div className="flex items-center gap-2 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <p className="text-xs text-indigo-300 truncate">{runningPhase.description}</p>
          </div>
        )}
      </div>

      {/* Phase list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {phases.map((phase, idx) => (
          <div
            key={phase.id}
            className={`flex items-start gap-3 p-2.5 rounded-lg transition-all duration-300
              ${phase.status === 'running' || phase.status === 'paused' ? 'bg-slate-800/60 border border-slate-700/60' : ''}
              ${phase.status === 'paused' ? 'border-amber-500/30 bg-amber-500/5' : ''}
            `}
          >
            <PhaseIcon status={phase.status} />
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-medium truncate ${
                phase.status === 'done' ? 'text-slate-400' :
                phase.status === 'running' ? 'text-indigo-300' :
                phase.status === 'paused' ? 'text-amber-300' :
                'text-slate-600'
              }`}>{phase.label}</p>
              {(phase.status === 'running' || phase.status === 'paused') && (
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">{phase.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Telemetry footer */}
      <div className="p-4 border-t border-slate-800/60">
        <div className="grid grid-cols-2 gap-y-1.5">
          {[
            ['Model', 'gpt-4o'],
            ['Tokens used', '~2,900'],
            ['Est. cost', '$0.021'],
            ['LangSmith', 'Tracing ✓'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-[10px] text-slate-600">{k}</span>
              <span className="text-[10px] text-slate-400 font-mono">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// HITL REVIEW PANEL — Gate 1 (Master Text)
// ───────────────────────────────────────────────────────────────
function Gate1TextReview({ onApprove, onReject, onRegenerate }: {
  onApprove: () => void;
  onReject: () => void;
  onRegenerate: (feedback?: string) => void;
}) {
  const [feedback, setFeedback] = useState<FeedbackState>({ open: false, text: '' });

  return (
    <div className="flex flex-col h-full animate-in">
      <div className="p-5 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_theme(colors.amber.400)]" />
          <h2 className="font-semibold text-amber-200 text-sm">🛑 HITL Gate 1 — Master Text Approval</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1 ml-5">
          The pipeline has paused. Review the AI-generated master copy below. Approve to proceed to localization.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Governance audit passed banner */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/8 border border-emerald-500/20">
          <svg className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          <div>
            <p className="text-xs font-semibold text-emerald-300">Textual Governance Passed</p>
            <p className="text-[10px] text-slate-400 mt-0.5">0 forbidden phrases detected · Mandatory disclaimers: N/A for this region</p>
          </div>
        </div>

        {/* Generated text */}
        <div className="glass-card-sm p-5 space-y-3">
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Headline</span>
            <p className="mt-1 text-lg font-bold text-white">{MOCK_MASTER_TEXT.headline}</p>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Body Copy</span>
            <p className="mt-1 text-sm text-slate-300 leading-relaxed">{MOCK_MASTER_TEXT.body}</p>
          </div>
          <div className="flex items-center gap-3 pt-2 border-t border-slate-700/50">
            <span className="text-[10px] text-slate-500">Character count: <strong className="text-slate-400">243</strong></span>
            <span className="text-[10px] text-slate-500">Model: gpt-4o</span>
          </div>
        </div>

        {/* Feedback panel */}
        {feedback.open && (
          <div className="space-y-2 animate-in">
            <label className="input-label">Regeneration Feedback</label>
            <textarea
              id="gate1-feedback"
              value={feedback.text}
              onChange={(e) => setFeedback((f) => ({ ...f, text: e.target.value }))}
              placeholder="Describe what to change — e.g. Make the tone more technical and less salesy..."
              rows={3}
              className="input-field resize-none"
            />
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="p-5 border-t border-slate-800/60 space-y-3">
        <div className="flex gap-2 flex-wrap">
          <button
            id="btn-gate1-approve"
            onClick={onApprove}
            className="btn-success flex-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m6-.75a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Approve & Lock
          </button>
          <button
            id="btn-gate1-reject"
            onClick={onReject}
            className="btn-danger flex-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Reject
          </button>
        </div>
        <div className="flex gap-2">
          <button
            id="btn-gate1-regenerate"
            type="button"
            onClick={() => { if (feedback.open) { onRegenerate(feedback.text); setFeedback({ open: false, text: '' }); } else { onRegenerate(); } }}
            className="btn-secondary flex-1 text-xs"
          >
            🔄 Regenerate
          </button>
          <button
            id="btn-gate1-feedback-toggle"
            type="button"
            onClick={() => setFeedback((f) => ({ ...f, open: !f.open }))}
            className="btn-secondary flex-1 text-xs"
          >
            {feedback.open ? '✕ Cancel' : '💬 Regenerate with Feedback'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// HITL REVIEW PANEL — Gate 2 (Localization)
// ───────────────────────────────────────────────────────────────
function Gate2LocalizationReview({ onApprove, onReject, onRegenerate }: {
  onApprove: () => void;
  onReject: () => void;
  onRegenerate: (feedback?: string) => void;
}) {
  const locales = Object.entries(MOCK_LOCALIZED_TEXT);
  const [activeLocale, setActiveLocale] = useState(locales[0][0]);
  const [feedback, setFeedback] = useState<FeedbackState>({ open: false, text: '' });
  const active = MOCK_LOCALIZED_TEXT[activeLocale as keyof typeof MOCK_LOCALIZED_TEXT];

  return (
    <div className="flex flex-col h-full animate-in">
      <div className="p-5 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_theme(colors.amber.400)]" />
          <h2 className="font-semibold text-amber-200 text-sm">🛑 HITL Gate 2 — Localized Text Approval</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1 ml-5">
          Transcreated regional content for {locales.length} locales. Review each language for cultural accuracy.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Locale tabs */}
        <div className="flex gap-2 flex-wrap">
          {locales.map(([locale]) => (
            <button
              key={locale}
              id={`locale-tab-${locale}`}
              type="button"
              onClick={() => setActiveLocale(locale)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200
                ${activeLocale === locale ? 'bg-indigo-600 text-white border border-indigo-500' : 'bg-slate-800/60 text-slate-400 border border-slate-700 hover:text-slate-200'}`}
            >
              {locale}
            </button>
          ))}
        </div>

        {/* LQA passed */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/8 border border-emerald-500/20">
          <svg className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          <div>
            <p className="text-xs font-semibold text-emerald-300">Regional Governance (LQA) Passed — {activeLocale}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Idiom check: Valid · GDPR disclaimer appended: ✓ · Currency converted: N/A</p>
          </div>
        </div>

        {/* Locale content */}
        <div className="glass-card-sm p-5 space-y-3">
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Headline ({activeLocale})</span>
            <p className="mt-1 text-lg font-bold text-white">{active.headline}</p>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Body</span>
            <p className="mt-1 text-sm text-slate-300 leading-relaxed">{active.body}</p>
          </div>
          <div className="flex items-center gap-3 pt-2 border-t border-slate-700/50">
            <span className="text-[10px] text-slate-500">
              Character count: <strong className={`${active.char_count > 250 ? 'text-amber-400' : 'text-emerald-400'}`}>{active.char_count}</strong>
              {active.char_count > 250 && <span className="text-amber-400 ml-1">⚠ Near limit</span>}
            </span>
          </div>
        </div>

        {feedback.open && (
          <div className="space-y-2 animate-in">
            <label className="input-label">Feedback for {activeLocale}</label>
            <textarea
              id="gate2-feedback"
              value={feedback.text}
              onChange={(e) => setFeedback((f) => ({ ...f, text: e.target.value }))}
              placeholder="Describe the cultural or tonal issue to fix..."
              rows={3}
              className="input-field resize-none"
            />
          </div>
        )}
      </div>

      <div className="p-5 border-t border-slate-800/60 space-y-3">
        <div className="flex gap-2">
          <button id="btn-gate2-approve" onClick={onApprove} className="btn-success flex-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m6-.75a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Approve All Locales
          </button>
          <button id="btn-gate2-reject" onClick={onReject} className="btn-danger flex-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Reject
          </button>
        </div>
        <div className="flex gap-2">
          <button id="btn-gate2-regen" type="button" onClick={() => { if (feedback.open) onRegenerate(feedback.text); else onRegenerate(); }} className="btn-secondary flex-1 text-xs">🔄 Regenerate</button>
          <button id="btn-gate2-feedback-toggle" type="button" onClick={() => setFeedback((f) => ({ ...f, open: !f.open }))} className="btn-secondary flex-1 text-xs">{feedback.open ? '✕ Cancel' : '💬 Regenerate with Feedback'}</button>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// STATE 4 — Visuals Panel
// ───────────────────────────────────────────────────────────────
function VisualsPanel() {
  return (
    <div className="flex flex-col h-full animate-in">
      <div className="p-5 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-pulse shadow-[0_0_8px_theme(colors.violet.400)]" />
          <h2 className="font-semibold text-violet-200 text-sm">Phase 4 — Visual Asset Generation</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1 ml-5">
          Locked text is injected into Stable Diffusion and Remotion. Visual Governance (Pillow) is running checks.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {MOCK_VISUAL_ASSETS.map((asset) => (
            <div key={asset.id} className="glass-card-sm p-4 flex items-center gap-4">
              {/* Thumbnail */}
              <div className="w-20 h-14 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                {asset.status === 'done' ? (
                  <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
                ) : (
                  <svg className="w-6 h-6 text-slate-600 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200">{asset.format} — {asset.locale}</p>
                <div className="flex items-center gap-2 mt-1">
                  {asset.status === 'done' ? (
                    <span className="badge-emerald text-xs">Visual Governance Passed ✓</span>
                  ) : (
                    <span className="badge-amber text-xs">Generating…</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-lg bg-violet-500/8 border border-violet-500/20">
          <p className="text-xs text-violet-300">
            🎨 Visual Governance is verifying hex variance, text overflow, and logo presence against your Phase 0 brand guidelines.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/50">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Gate 3 — Final Asset Approval</p>
          <p className="text-xs text-slate-400">Gate 3 will appear here once all visual assets pass governance checks.</p>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// STATE 1 — Processing Panel
// ───────────────────────────────────────────────────────────────
function ProcessingPanel() {
  const messages = [
    { phase: 'Orchestrator', text: 'Initiating pipeline... merging workspace rules with campaign brief.' },
    { phase: 'Semantic Layer', text: 'Querying Qdrant for contextual facts matching campaign objective...' },
    { phase: 'Knowledge-to-Content', text: 'Generating master text draft with GPT-4o...' },
  ];

  return (
    <div className="flex flex-col h-full animate-in">
      <div className="p-5 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_8px_theme(colors.indigo.400)]" />
          <h2 className="font-semibold text-indigo-200 text-sm">Processing — AI Pipeline Running</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1 ml-5">The LangGraph state machine is executing. No action required.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className="flex gap-3 animate-in" style={{ animationDelay: `${i * 0.2}s` }}>
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 text-xs font-bold text-indigo-400">AI</div>
            <div className="flex-1 glass-card-sm p-3">
              <p className="text-[10px] font-semibold text-indigo-300 mb-1">[{m.phase}]</p>
              <p className="text-xs text-slate-300">{m.text}</p>
            </div>
          </div>
        ))}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-indigo-500/40 flex items-center justify-center flex-shrink-0">
            <div className="flex gap-0.5">
              <div className="w-1 h-1 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1 h-1 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1 h-1 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
          <div className="flex-1 glass-card-sm p-3">
            <p className="text-xs text-slate-500 italic">Knowledge-to-Content Agent is working…</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// MAIN EXECUTE PAGE
// ───────────────────────────────────────────────────────────────
export default function ExecutePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [execState, setExecState] = useState<ExecutionState>('PROCESSING');
  const [elapsedMs, setElapsedMs] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);

  /**
   * TODO — CONVEX REAL-TIME SUBSCRIPTION:
   *
   * Replace mock state management with a real-time Convex subscription:
   *
   *   const campaign = useQuery(api.campaigns.getCampaignById, { id: params.id });
   *
   *   useEffect(() => {
   *     if (!campaign) return;
   *     // Map campaign.status → ExecutionState
   *     if (campaign.status === 'PENDING_GATE_1') setExecState('GATE_1_TEXT');
   *     if (campaign.status === 'PENDING_GATE_2') setExecState('GATE_2_LOCALIZATION');
   *     if (campaign.status === 'PENDING_GATE_3') setExecState('GATE_4_VISUALS');
   *   }, [campaign?.status]);
   *
   * The FastAPI/LangGraph backend writes to Convex at each pause point,
   * and Convex's real-time reactivity instantly updates this UI.
   */

  useEffect(() => {
    timerRef.current = setInterval(() => setElapsedMs((t) => t + 100), 100);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  // Simulate pipeline auto-advancing to Gate 1 after 3s
  useEffect(() => {
    if (execState !== 'PROCESSING') return;
    const t = setTimeout(() => setExecState('GATE_1_TEXT'), 3000);
    return () => clearTimeout(t);
  }, [execState]);

  // ── Action handlers ─────────────────────────────────────────
  const handleApprove = () => {
    /**
     * TODO — CONVEX MUTATION: approveGate
     *
     *   await convex.mutation(api.campaigns.approveGate, {
     *     campaignId: params.id,
     *     gate: execState === 'GATE_1_TEXT' ? 1 : 2,
     *   });
     *   // Then POST to FastAPI to resume the LangGraph checkpoint
     */
    if (execState === 'GATE_1_TEXT') setExecState('GATE_2_LOCALIZATION');
    else if (execState === 'GATE_2_LOCALIZATION') setExecState('GATE_4_VISUALS');
  };

  const handleReject = () => {
    /**
     * TODO — CONVEX MUTATION: rejectGate → restart pipeline from that phase
     *   await convex.mutation(api.campaigns.rejectGate, { campaignId: params.id });
     */
    setExecState('PROCESSING');
  };

  const handleRegenerate = () => {
    /**
     * TODO: Signal FastAPI to re-run the relevant agent node in LangGraph.
     *   await fetch('/api/regenerate', { method: 'POST', body: JSON.stringify({ campaignId: params.id }) });
     */
    setExecState('PROCESSING');
  };

  // ── Right panel renderer ─────────────────────────────────────
  const renderRightPanel = () => {
    switch (execState) {
      case 'PROCESSING': return <ProcessingPanel />;
      case 'GATE_1_TEXT': return <Gate1TextReview onApprove={handleApprove} onReject={handleReject} onRegenerate={handleRegenerate} />;
      case 'GATE_2_LOCALIZATION': return <Gate2LocalizationReview onApprove={handleApprove} onReject={handleReject} onRegenerate={handleRegenerate} />;
      case 'GATE_4_VISUALS': return <VisualsPanel />;
    }
  };

  // ── State label helper ───────────────────────────────────────
  const stateLabel: Record<ExecutionState, string> = {
    PROCESSING: '⚙ Processing',
    GATE_1_TEXT: '⏸ Gate 1 — Text Review',
    GATE_2_LOCALIZATION: '⏸ Gate 2 — Localization',
    GATE_4_VISUALS: '🎨 Visual Generation',
  };

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
      {/* ── Page Header ───────────────────────────────────────── */}
      <div className="border-b border-slate-800/80 px-6 py-3 flex items-center justify-between flex-shrink-0" style={{ background: 'rgba(10,14,26,0.7)', backdropFilter: 'blur(8px)' }}>
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold text-slate-200">Campaign: {id}</h1>
          <span className="badge-amber">{stateLabel[execState]}</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/campaigns/new" id="btn-back-new" className="btn-ghost text-xs">← New Campaign</Link>
          <Link href="/main" id="btn-back-main" className="btn-ghost text-xs">🏠 Dashboard</Link>
        </div>
      </div>

      {/* ── DEBUG STATE SWITCHER ─────────────────────────────────
          Remove this panel before connecting the real backend.
          It lets you manually cycle through all 4 UI states.
      ─────────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 flex items-center gap-2 px-6 py-2 border-b border-slate-800/60 bg-slate-900/40">
        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mr-1">🛠 DEBUG STATE</span>
        {([
          ['PROCESSING', '1: Processing'],
          ['GATE_1_TEXT', '2: Text Gate'],
          ['GATE_2_LOCALIZATION', '3: Locale Gate'],
          ['GATE_4_VISUALS', '4: Visuals'],
        ] as [ExecutionState, string][]).map(([state, label]) => (
          <button
            key={state}
            id={`debug-state-${state.toLowerCase()}`}
            type="button"
            onClick={() => setExecState(state)}
            className={`px-3 py-1 rounded text-xs font-medium transition-all
              ${execState === state ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500 hover:text-slate-300 border border-slate-700'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Split Screen ──────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">
        {/* Left — Pipeline Monitor (40%) */}
        <div className="w-2/5 border-r border-slate-800/60 flex flex-col overflow-hidden">
          <PipelinePanel state={execState} elapsedMs={elapsedMs} />
        </div>

        {/* Right — HITL Review Panel (60%) */}
        <div className="w-3/5 flex flex-col overflow-hidden">
          {renderRightPanel()}
        </div>
      </div>
    </div>
  );
}
