"use client";

import Link from 'next/link';

export default function KnowledgeBase() {
  // Convex Stubs
  // const docs = useQuery(api.knowledge.list);
  // const uploadDoc = useMutation(api.knowledge.upload);

  return (
    <div className="min-h-screen bg-[#fff4f3] font-['Inter'] pb-32">
      <header className="pt-10 px-8 max-w-5xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#ac2c00] tracking-tight">Knowledge Base</h1>
          <p className="text-[#834c4b] mt-1 font-medium">Upload corporate documents (PDF, Doc) and URLs to Qdrant.</p>
        </div>
        <Link href="/admin/governance" className="px-5 py-2.5 rounded-full bg-white text-[#ac2c00] font-semibold text-sm shadow-sm hover:bg-[#ffedeb]">
          Governance ➔
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-8 mt-12 space-y-12">
        <section className="bg-white rounded-3xl p-12 border-2 border-dashed border-[#ffd2d0] flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-[#ffedeb] rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl">📄</span>
          </div>
          <h2 className="text-xl font-bold text-[#ac2c00] mb-2">Drag & Drop Documents</h2>
          <p className="text-[#834c4b] max-w-md mb-6">We will parse and chunk these documents automatically for LangGraph ingestion.</p>
          <button className="px-8 py-3 rounded-full bg-[#FF4500] text-white font-bold hover:bg-[#ac2c00] transition-colors">
            Browse Files
          </button>
        </section>

        <section className="bg-[#ffedeb] rounded-3xl p-8 shadow-[0_20px_40px_rgba(78,33,33,0.04)] ring-1 ring-[#ffd2d0]/50">
          <h2 className="text-2xl font-semibold text-[#4e2121] mb-6">Scrape URL</h2>
          <div className="flex space-x-3">
             <input type="url" placeholder="https://yourbrand.com/about" className="flex-1 bg-white text-[#4e2121] p-4 rounded-xl outline-none focus:ring-2 focus:ring-[#FF4500]/30 transition-shadow"/>
             <button className="px-6 py-4 rounded-xl bg-white border-2 border-[#FF4500] text-[#FF4500] font-bold hover:bg-[#fff4f3] transition-colors">Ingest Link</button>
          </div>
        </section>
      </main>
    </div>
  );
}
