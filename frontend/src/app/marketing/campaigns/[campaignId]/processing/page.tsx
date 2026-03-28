"use client";

import Link from 'next/link';

export default function ProcessingPage() {
  // Convex Stub
  // const status = useQuery(api.campaigns.getStatus, { campaignId: "demo_run_1" });

  const steps = [
    { id: 1, name: 'AI Image & Text Drafting', status: 'complete' },
    { id: 2, name: 'Textual Governance Check', status: 'complete' },
    { id: 3, name: 'Visual Context Audit', status: 'active' },
    { id: 4, name: 'Regional Localization', status: 'pending' },
  ];

  return (
    <div className="min-h-screen bg-[#fff4f3] font-['Inter'] flex items-center justify-center p-8">
      <div className="bg-white rounded-3xl p-12 max-w-2xl w-full shadow-[0_20px_40px_rgba(78,33,33,0.05)] ring-1 ring-[#ffd2d0]/50 text-center">
        <h1 className="text-3xl font-bold text-[#ac2c00] mb-2 tracking-tight">AI Orchestrator Processing...</h1>
        <p className="text-[#834c4b] font-medium mb-12">LangGraph is executing multi-agent generation and deterministic firewalls.</p>
        
        <div className="space-y-8 text-left max-w-md mx-auto relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#ffe1e0] before:to-transparent">
          {steps.map((step) => (
            <div key={step.id} className="relative flex items-center md:justify-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 shadow shrink-0 
                ${step.status === 'complete' ? 'bg-[#FF4500] border-[#FF4500] text-white' : 
                  step.status === 'active' ? 'bg-white border-[#FF4500] text-[#FF4500] animate-pulse' : 
                  'bg-[#fff4f3] border-[#ffe1e0] text-[#cd8c8a]'} `}
              >
                 {step.status === 'complete' ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> : step.id}
              </div>
              <div className="ml-6 md:absolute md:left-full text-[#4e2121] font-semibold text-lg min-w-max">
                {step.name} 
                {step.status === 'active' && <span className="block text-sm text-[#ac2c00] animate-bounce mt-1">Working...</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <Link href="/review">
            <button className="px-8 py-3 rounded-full border-2 border-[#ffedeb] text-[#ac2c00] font-semibold hover:bg-[#fff4f3] transition-colors">
              Skip to Review Sandbox (Demo)
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
