"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Governance() {
  // Convex Stubs
  // const rules = useQuery(api.workspace_rules.get);
  // const updateRules = useMutation(api.workspace_rules.update);

  const [primaryColor, setPrimaryColor] = useState('#FF4500');
  const [secondaryColor, setSecondaryColor] = useState('#ac2c00');
  const [businessModel, setBusinessModel] = useState('B2C');
  const [forbiddenPhrases, setForbiddenPhrases] = useState(['money back guarantee', '100% cure', 'risk free']);
  const [newPhrase, setNewPhrase] = useState('');

  const addPhrase = () => {
    if (newPhrase.trim() && !forbiddenPhrases.includes(newPhrase.trim())) {
      setForbiddenPhrases([...forbiddenPhrases, newPhrase.trim()]);
      setNewPhrase('');
    }
  };

  const removePhrase = (index: number) => {
    setForbiddenPhrases(forbiddenPhrases.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-[#fff4f3] font-['Inter'] pb-32">
      <header className="pt-10 px-8 max-w-5xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#ac2c00] tracking-tight">Governance Rules</h1>
          <p className="text-[#834c4b] mt-1 font-medium">Textual and Visual Brand Guidelines</p>
        </div>
        <div className="flex space-x-4">
          <Link href="/admin/knowledge-base" className="px-5 py-2.5 rounded-full bg-white text-[#ac2c00] font-semibold text-sm shadow-sm hover:bg-[#ffedeb]">
            Knowledge Base ➔
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8 mt-12 space-y-12">
        <section className="bg-[#ffedeb] rounded-3xl p-8 shadow-[0_20px_40px_rgba(78,33,33,0.04)] ring-1 ring-[#ffd2d0]/50">
          <h2 className="text-2xl font-semibold text-[#4e2121] mb-2">Business Settings</h2>
          <div className="bg-white rounded-2xl p-6 mt-6">
            <label className="block text-sm font-semibold text-[#834c4b] mb-3 uppercase tracking-wider">Business Model</label>
            <select 
              value={businessModel}
              onChange={(e) => setBusinessModel(e.target.value)}
              className="w-full bg-[#fff4f3] text-[#4e2121] font-medium p-4 rounded-xl outline-none focus:ring-2 focus:ring-[#FF4500]/30 transition-shadow appearance-none cursor-pointer"
            >
              <option value="B2B">Business to Business (B2B)</option>
              <option value="B2C">Consumer Tech (B2C)</option>
            </select>
          </div>
        </section>

        <section className="bg-[#ffedeb] rounded-3xl p-8 shadow-[0_20px_40px_rgba(78,33,33,0.04)] ring-1 ring-[#ffd2d0]/50">
          <h2 className="text-2xl font-semibold text-[#4e2121] mb-2">Visual Rules (Brand Identity)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white rounded-2xl p-6 flex flex-col justify-between">
              <label className="block text-sm font-semibold text-[#834c4b] mb-3 uppercase tracking-wider">Primary Color</label>
              <div className="flex items-center space-x-4">
                <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-14 h-14 rounded-full cursor-pointer border-0 bg-transparent p-0 shadow-md"/>
                <input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="bg-[#fff4f3] text-[#4e2121] font-mono p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#FF4500]/30 transition-shadow w-full uppercase"/>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#ffedeb] rounded-3xl p-8 shadow-[0_20px_40px_rgba(78,33,33,0.04)] ring-1 ring-[#ffd2d0]/50">
          <h2 className="text-2xl font-semibold text-[#4e2121] mb-2">Textual Rules (Compliance)</h2>
          <div className="bg-white rounded-2xl p-6 flex flex-col mt-6">
            <div className="flex space-x-3 mb-6">
              <input type="text" placeholder="Add a new forbidden phrase..." value={newPhrase} onChange={(e) => setNewPhrase(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addPhrase()} className="flex-1 bg-[#fff4f3] text-[#4e2121] p-4 rounded-xl outline-none focus:ring-2 focus:ring-[#FF4500]/30 transition-shadow placeholder-[#cd8c8a]"/>
              <button onClick={addPhrase} className="px-6 py-4 rounded-xl bg-[linear-gradient(135deg,#FF4500_0%,#ff7852_100%)] text-white font-semibold hover:opacity-90 transition-opacity">Add Rule</button>
            </div>
            <div className="flex flex-wrap gap-3">
              {forbiddenPhrases.map((phrase, idx) => (
                <div key={idx} className="flex items-center space-x-2 bg-[#ffedeb] text-[#852328] px-4 py-2.5 rounded-full text-sm font-medium border border-[#ffd2d0]">
                  <span>{phrase}</span>
                  <button onClick={() => removePhrase(idx)} className="text-[#b31b25] hover:text-[#570008] ml-1 p-0.5 rounded-full hover:bg-[#ffd2d0] transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-[#ffe1e0] z-50 flex justify-end">
        <button className="px-10 py-4 rounded-full bg-[linear-gradient(135deg,#ac2c00_0%,#FF4500_100%)] text-white font-bold text-lg hover:-translate-y-0.5 transition-all">
          Save Governance Rules
        </button>
      </div>
    </div>
  );
}
