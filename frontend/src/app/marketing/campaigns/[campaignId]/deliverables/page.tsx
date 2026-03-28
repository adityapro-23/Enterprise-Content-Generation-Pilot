"use client";

import Link from 'next/link';

export default function Deliverables() {
  // Convex Stub
  // const assets = useQuery(api.campaigns.getApprovedAssets, { campaignId: "demo_run_1" });

  return (
    <div className="min-h-screen bg-[#fff4f3] font-['Inter'] pb-32">
      <header className="pt-10 px-8 max-w-6xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#ac2c00] tracking-tight">Campaign Deliverables</h1>
          <p className="text-[#834c4b] mt-1 font-medium">Final, highly compliant generated visual and textual assets.</p>
        </div>
        <Link href="/marketing" className="px-5 py-2.5 rounded-full bg-white text-[#ac2c00] font-semibold text-sm shadow-sm hover:bg-[#ffedeb]">
          Back to Hub
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-8 mt-12 space-y-12">
        <section className="bg-white rounded-3xl p-8 shadow-[0_20px_40px_rgba(78,33,33,0.04)] ring-1 ring-[#ffd2d0]/50">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            
            {/* Visual Asset Card */}
            <div className="break-inside-avoid bg-[#ffedeb] rounded-2xl overflow-hidden border border-[#ffd2d0] shadow-sm flex flex-col">
              <div className="h-48 bg-gray-200 w-full flex items-center justify-center relative bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800')" }}>
                 <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-white text-xs font-bold uppercase tracking-wider">Instagram</div>
              </div>
              <div className="p-5 flex flex-col justify-between flex-1">
                 <h3 className="font-bold text-[#ac2c00] mb-2 truncate">PulseFit_Hero_NA</h3>
                 <p className="text-xs text-[#834c4b] mb-4">Generated via Flux/Midjourney Node.</p>
                 <button className="w-full bg-white border border-[#FF4500] text-[#FF4500] py-2 rounded-xl text-sm font-bold hover:bg-[#FF4500] hover:text-white transition-colors">
                    ↓ Download Image
                 </button>
              </div>
            </div>

            {/* Text Asset Card */}
            <div className="break-inside-avoid bg-[#ffedeb] rounded-2xl overflow-hidden border border-[#ffd2d0] shadow-sm flex flex-col">
              <div className="bg-white p-5 border-b border-[#ffd2d0]">
                 <p className="text-[#4e2121] text-sm leading-relaxed overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 6, WebkitBoxOrient: 'vertical' }}>
                   Is your corporate team burning out? The holiday season brings high stress. It's time to invest in reliable telemetry with PulseFit B2B Enterprise Solutions.
                 </p>
              </div>
              <div className="p-5 border-t border-white flex flex-col justify-between flex-1">
                 <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-[#ac2c00] truncate">LinkedIn_B2B_Promo</h3>
                   <span className="bg-black/80 px-2 py-1 rounded-md text-white text-[10px] font-bold uppercase tracking-wider">LinkedIn</span>
                 </div>
                 <button className="w-full bg-white border border-[#FF4500] text-[#FF4500] py-2 rounded-xl text-sm font-bold hover:bg-[#FF4500] hover:text-white transition-colors">
                    📋 Copy Text
                 </button>
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}
