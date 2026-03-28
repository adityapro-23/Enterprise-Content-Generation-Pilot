import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Campaigns — ECGP',
  description: 'Create and manage AI-generated enterprise content campaigns.',
};

export default function CampaignsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Campaigns Sub-header */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80" style={{ backdropFilter: 'blur(12px)', background: 'rgba(10,14,26,0.9)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href="/main" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-white tracking-tight">ECGP</span>
          </Link>
          <div className="w-px h-5 bg-slate-700" />
          <Link href="/main" className="btn-ghost text-xs flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            Dashboard
          </Link>
          <div className="w-px h-5 bg-slate-700" />
          <span className="text-sm text-slate-400">Campaigns</span>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
