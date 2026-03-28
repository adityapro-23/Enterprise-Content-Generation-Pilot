import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workspace Setup — ECGP',
  description: 'Configure your enterprise workspace, compliance rules, and brand identity.',
};

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Workspace Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80" style={{ backdropFilter: 'blur(12px)', background: 'rgba(10,14,26,0.85)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-white tracking-tight">ECGP</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="badge-indigo text-xs">
              Phase 0 — Workspace Setup
            </span>
            <Link href="/main" className="btn-ghost text-xs">
              Skip for now →
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
        {children}
      </main>
    </div>
  );
}
