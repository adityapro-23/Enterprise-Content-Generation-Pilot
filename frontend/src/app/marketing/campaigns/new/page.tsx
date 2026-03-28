"use client";

import Link from 'next/link';

export default function NewCampaign() {
  // Convex Stub
  // const createCampaign = useMutation(api.campaigns.create);

  return (
    <div className="min-h-screen bg-[#fff4f3] font-['Inter'] pb-32">
      <header className="pt-10 px-8 max-w-4xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#ac2c00] tracking-tight">Initiate Campaign</h1>
          <p className="text-[#834c4b] mt-1 font-medium">Draft dynamic content targeting specific personas and regions.</p>
        </div>
        <Link href="/marketing" className="px-5 py-2.5 rounded-full bg-white text-[#ac2c00] font-semibold text-sm shadow-sm hover:bg-[#ffedeb]">
          Back
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-8 mt-12 space-y-10">
        <section className="bg-white rounded-3xl p-8 shadow-[0_20px_40px_rgba(78,33,33,0.04)] ring-1 ring-[#ffd2d0]/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-[#FF4500]"></div>
          <h2 className="text-2xl font-semibold text-[#4e2121] mb-2">Creative Objective</h2>
          <textarea 
            placeholder="e.g. We are launching the PulseFit Pro smart watch. Focus on the new 14-day battery life..."
            className="w-full h-40 bg-[#fff4f3] text-[#4e2121] p-5 rounded-2xl outline-none focus:ring-4 focus:ring-[#FF4500]/20 transition-all placeholder-[#cd8c8a] mt-4"
          ></textarea>
        </section>

        <section className="bg-white rounded-3xl p-8 ring-1 ring-[#ffd2d0]/50">
          <h2 className="text-2xl font-semibold text-[#4e2121] mb-4">Target Audience & Languages</h2>
          <div className="grid grid-cols-2 gap-4 border-t border-[#ffe1e0] pt-6">
             <div className="bg-[#fff4f3] rounded-2xl p-4 cursor-pointer hover:bg-[#ffedeb]">
                 <input type="checkbox" className="mr-3 accent-[#FF4500]"/> North America (English)
             </div>
             <div className="bg-[#fff4f3] rounded-2xl p-4 cursor-pointer hover:bg-[#ffedeb]">
                 <input type="checkbox" className="mr-3 accent-[#FF4500]"/> Europe (English, French, German)
             </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl p-8 ring-1 ring-[#ffd2d0]/50">
          <h2 className="text-2xl font-semibold text-[#4e2121] mb-4">Desired Output Formats</h2>
          <div className="grid grid-cols-3 gap-4 border-t border-[#ffe1e0] pt-6 flex-wrap">
             <div className="bg-[#fff4f3] rounded-2xl p-6 text-center shadow-sm hover:border-[#FF4500] border-2 border-transparent transition-all cursor-pointer">
                <span className="text-4xl block mb-2">📱</span>
                <span className="font-bold text-[#4e2121]">Instagram Reel</span>
             </div>
             <div className="bg-[#fff4f3] rounded-2xl p-6 text-center shadow-sm hover:border-[#FF4500] border-2 border-transparent transition-all cursor-pointer">
                <span className="text-4xl block mb-2">✉️</span>
                <span className="font-bold text-[#4e2121]">Email Promo</span>
             </div>
             <div className="bg-[#fff4f3] rounded-2xl p-6 text-center shadow-sm hover:border-[#FF4500] border-2 border-transparent transition-all cursor-pointer">
                <span className="text-4xl block mb-2">👩‍💻</span>
                <span className="font-bold text-[#4e2121]">LinkedIn Post</span>
             </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-[#ffe1e0] shadow-[0_-20px_40px_rgba(78,33,33,0.03)] z-50 text-right max-w-4xl mx-auto">
        <Link href="/marketing/campaigns/demo_run_1/processing">
          <button className="px-10 py-5 rounded-full bg-[linear-gradient(135deg,#ac2c00_0%,#FF4500_100%)] text-white font-bold text-lg hover:-translate-y-1 transition-all">
            🚀 Trigger LangGraph Orchestrator
          </button>
        </Link>
      </div>
    </div>
  );
}
