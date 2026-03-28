"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function ReviewSandbox() {
  // Convex Stubs
  // const approveAsset = useMutation(api.campaigns.approveAsset);
  // const rejectAsset = useMutation(api.campaigns.rejectAsset);

  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const generatedCopy = `PulseFit Pro: The Ultimate Smartwatch is Here!

Are you ready to elevate your fitness journey? Meet the PulseFit Pro, featuring a revolutionary 14-day battery life that keeps you moving without interruption.

Equipped with state-of-the-art ECG sensors, the PulseFit Pro monitors your heart health in real-time. Whether you are running a marathon or resting at home, stay connected to your body's rhythm.

Grab yours today and experience peak performance!`;

  const auditLogs = [
    { id: 1, text: 'Brand Identity Analyzed', status: 'pass' },
    { id: 2, text: 'Typography Checked (Inter)', status: 'pass' },
    { id: 3, text: 'Compliance Sub-Check: Medical Claims', status: 'pass' },
    { id: 4, text: 'Forbidden Phrases Scan', status: 'pass' },
    { id: 5, text: 'Tonal Alignment (High-Energy)', status: 'warning' },
    { id: 6, text: 'Final Orchestrator Review', status: 'pass' },
  ];

  return (
    <div className="h-[calc(100vh-73px)] bg-[#fff4f3] font-['Inter'] flex flex-col overflow-hidden">
      
      {/* Header */}
      <header className="py-6 px-8 bg-white/80 backdrop-blur-md border-b border-[#ffe1e0] shadow-sm shrink-0 flex items-center justify-between z-10">
        <div>
          <h1 className="text-3xl font-bold text-[#ac2c00] tracking-tight">Asset Review</h1>
          <p className="text-[#834c4b] text-sm font-medium">Verify AI outputs against governance rules.</p>
        </div>
        <Link 
          href="/review" 
          className="px-4 py-2 rounded-full border border-[#ffe1e0] text-[#ac2c00] font-semibold text-sm hover:bg-[#ffedeb] transition-colors"
        >
          Back to Queue
        </Link>
      </header>

      {/* Split Screen Container */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Left Panel: Read-only Viewer */}
        <section className="flex-[0.65] p-8 overflow-y-auto bg-[#fff4f3]">
          <div className="bg-white rounded-3xl shadow-[0_20px_40px_rgba(78,33,33,0.03)] border border-[#ffd2d0] p-10 h-full flex flex-col">
            <h2 className="text-[#834c4b] uppercase tracking-wider text-sm font-bold mb-6">Generated Master Copy</h2>
            <div className="flex-1 bg-gradient-to-b from-[#ffedeb]/50 to-transparent rounded-2xl p-8 border border-[#ffe1e0] overflow-y-scroll prose prose-red max-w-none">
              <p className="text-[#4e2121] leading-relaxed text-lg whitespace-pre-wrap font-medium">
                {generatedCopy}
              </p>
            </div>
          </div>
        </section>

        {/* Right Panel: Audit Log */}
        <section className="flex-[0.35] bg-white border-l border-[#ffe1e0] flex flex-col shadow-[-10px_0_30px_rgba(78,33,33,0.02)] z-10">
          <div className="p-8 pb-4 border-b border-[#ffe1e0] bg-[#fff4f3]/50">
            <h2 className="text-xl font-bold text-[#4e2121] flex items-center">
              <span className="bg-[#ac2c00] text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">✓</span>
              Audit Log
            </h2>
            <p className="text-[#834c4b] text-sm mt-2">Deterministic security and brand compliance checks via LangGraph.</p>
          </div>
          
          <div className="p-8 overflow-y-auto flex-1 space-y-6 bg-white">
            {auditLogs.map(log => (
              <div key={log.id} className="flex items-start">
                <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-sm ${log.status === 'pass' ? 'bg-[#ff7852] text-white' : 'bg-yellow-400 text-yellow-900'}`}>
                  {log.status === 'pass' ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> : '!'}
                </div>
                <div className="ml-4">
                  <p className="text-[#4e2121] font-semibold">{log.text}</p>
                  <p className="text-xs text-[#cd8c8a] mt-0.5">Automated Check</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Sticky Footer Action Bar */}
      <footer className="shrink-0 p-6 bg-white border-t border-[#ffe1e0] shadow-[0_-10px_40px_rgba(78,33,33,0.04)] z-50 flex items-center justify-between">
        
        {status === 'pending' ? (
          <p className="text-[#834c4b] font-medium px-4">Awaiting Human-In-The-Loop Approval</p>
        ) : status === 'approved' ? (
          <p className="text-emerald-700 font-bold px-4 flex items-center"><span className="text-2xl mr-2">✅</span> Approved for publishing.</p>
        ) : (
          <p className="text-red-700 font-bold px-4 flex items-center"><span className="text-2xl mr-2">❌</span> Rejected. Sending back to Orchestrator...</p>
        )}

        <div className="flex space-x-4">
          <button 
            onClick={() => setStatus('rejected')}
            disabled={status !== 'pending'}
            className="px-8 py-4 rounded-full border-2 border-[#b31b25] text-[#b31b25] font-bold hover:bg-[#ffefee] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reject & Regenerate
          </button>
          
          <button 
            onClick={() => setStatus('approved')}
            disabled={status !== 'pending'}
            className="px-10 py-4 rounded-full bg-emerald-600 text-white font-bold text-lg hover:bg-emerald-700 shadow-[0_10px_20px_rgba(5,150,105,0.2)] hover:shadow-[0_15px_30px_rgba(5,150,105,0.3)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            Approve & Continue
          </button>
        </div>
      </footer>
    </div>
  );
}
