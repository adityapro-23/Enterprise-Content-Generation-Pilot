"use client";

import Link from 'next/link';

export default function MarketingHub() {
  // Convex Stub
  // const campaigns = useQuery(api.campaigns.list);

  return (
    <div className="min-h-screen bg-[#fff4f3] font-['Inter'] pb-32">
      <header className="pt-10 px-8 max-w-6xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#ac2c00] tracking-tight">Marketing Hub</h1>
          <p className="text-[#834c4b] mt-1 font-medium">Orchestrate and monitor your AI-generated campaigns.</p>
        </div>
        <Link 
          href="/marketing/campaigns/new" 
          className="px-6 py-3 rounded-full bg-[linear-gradient(135deg,#FF4500_0%,#ff7852_100%)] text-white font-bold shadow-md hover:-translate-y-0.5 transition-all"
        >
          + Create New Campaign
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-8 mt-12 space-y-8">
        {/* Placeholder High-Level Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#ffe1e0]">
             <h3 className="text-[#834c4b] font-semibold text-sm mb-1 uppercase tracking-widest">Active Drafts</h3>
             <p className="text-4xl font-bold text-[#ac2c00]">4</p>
           </div>
           <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#ffe1e0]">
             <h3 className="text-[#834c4b] font-semibold text-sm mb-1 uppercase tracking-widest">Pending Review</h3>
             <p className="text-4xl font-bold text-amber-500">2</p>
           </div>
           <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#ffe1e0]">
             <h3 className="text-[#834c4b] font-semibold text-sm mb-1 uppercase tracking-widest">Finalized Assets</h3>
             <p className="text-4xl font-bold text-emerald-600">89</p>
           </div>
        </div>

        {/* Existing Campaigns Table Placeholder */}
        <section className="bg-white rounded-3xl p-8 shadow-[0_20px_40px_rgba(78,33,33,0.04)] ring-1 ring-[#ffd2d0]/50">
          <h2 className="text-2xl font-semibold text-[#4e2121] mb-6">Recent Campaigns</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-[#ffedeb]">
                  <th className="pb-4 text-[#834c4b] font-bold text-sm uppercase">Campaign Name</th>
                  <th className="pb-4 text-[#834c4b] font-bold text-sm uppercase">Status</th>
                  <th className="pb-4 text-[#834c4b] font-bold text-sm uppercase">Formats</th>
                  <th className="pb-4 text-[#834c4b] font-bold text-sm uppercase">Updated</th>
                  <th className="pb-4"></th>
                </tr>
              </thead>
              <tbody className="text-[#4e2121] font-medium">
                <tr className="border-b border-[#fff4f3] hover:bg-[#fff4f3] transition-colors">
                  <td className="py-5 font-bold">Fall PulseFit Pro Launch</td>
                  <td className="py-5"><span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase">Completed</span></td>
                  <td className="py-5">Instagram, Email</td>
                  <td className="py-5 text-sm text-[#834c4b]">2 hours ago</td>
                  <td className="py-5 text-right"><Link href="/marketing/campaigns/demo_run_1/deliverables" className="text-[#FF4500] hover:underline text-sm font-semibold">View Assets ➔</Link></td>
                </tr>
                <tr className="hover:bg-[#fff4f3] transition-colors">
                  <td className="py-5 font-bold">Holiday B2B SaaS Push</td>
                  <td className="py-5"><span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase">Generating AI...</span></td>
                  <td className="py-5">LinkedIn, Blog</td>
                  <td className="py-5 text-sm text-[#834c4b]">Syncing...</td>
                  <td className="py-5 text-right"><Link href="/marketing/campaigns/demo_run_2/processing" className="text-[#FF4500] hover:underline text-sm font-semibold">View Progress ➔</Link></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
