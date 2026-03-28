"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function WorkspaceSetup() {
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
      {/* Floating Header */}
      <header className="pt-10 px-8 max-w-5xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#ac2c00] tracking-tight">Workspace Setup</h1>
          <p className="text-[#834c4b] mt-1 font-medium">Configure global brand rules and compliance guardrails.</p>
        </div>
        <Link 
          href="/" 
          className="px-5 py-2.5 rounded-full bg-white text-[#ac2c00] font-semibold text-sm shadow-[0_20px_40px_rgba(78,33,33,0.06)] hover:bg-[#ffedeb] transition-colors"
        >
          Back to Launchpad
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-8 mt-12 space-y-12">
        
        {/* Section 1: Business Settings */}
        <section className="bg-[#ffedeb] rounded-3xl p-8 shadow-[0_20px_40px_rgba(78,33,33,0.04)] ring-1 ring-[#ffd2d0]/50">
          <h2 className="text-2xl font-semibold text-[#4e2121] mb-2">Business Settings</h2>
          <p className="text-[#834c4b] text-sm mb-6">Select the primary business interaction model for AI generation context.</p>
          
          <div className="bg-white rounded-2xl p-6">
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

        {/* Section 2: Branding */}
        <section className="bg-[#ffedeb] rounded-3xl p-8 shadow-[0_20px_40px_rgba(78,33,33,0.04)] ring-1 ring-[#ffd2d0]/50">
          <h2 className="text-2xl font-semibold text-[#4e2121] mb-2">Brand Identity</h2>
          <p className="text-[#834c4b] text-sm mb-6">Define the visual tokens that the Visual Governance Agent will enforce.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 flex flex-col justify-between">
              <label className="block text-sm font-semibold text-[#834c4b] mb-3 uppercase tracking-wider">Primary Color</label>
              <div className="flex items-center space-x-4">
                <input 
                  type="color" 
                  value={primaryColor} 
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-14 h-14 rounded-full cursor-pointer border-0 bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-full shadow-md"
                />
                <input 
                  type="text" 
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="bg-[#fff4f3] text-[#4e2121] font-mono p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#FF4500]/30 transition-shadow w-full uppercase"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 flex flex-col justify-between">
              <label className="block text-sm font-semibold text-[#834c4b] mb-3 uppercase tracking-wider">Secondary Color</label>
              <div className="flex items-center space-x-4">
                <input 
                  type="color" 
                  value={secondaryColor} 
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-14 h-14 rounded-full cursor-pointer border-0 bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-full shadow-md"
                />
                <input 
                  type="text" 
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="bg-[#fff4f3] text-[#4e2121] font-mono p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#FF4500]/30 transition-shadow w-full uppercase"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Compliance */}
        <section className="bg-[#ffedeb] rounded-3xl p-8 shadow-[0_20px_40px_rgba(78,33,33,0.04)] ring-1 ring-[#ffd2d0]/50">
          <h2 className="text-2xl font-semibold text-[#4e2121] mb-2">Security & Compliance</h2>
          <p className="text-[#834c4b] text-sm mb-6">These forbidden phrases will trigger an automatic rejection by the Textual Governance Agent.</p>
          
          <div className="bg-white rounded-2xl p-6 min-h-[200px] flex flex-col">
            <div className="flex space-x-3 mb-6">
              <input 
                type="text" 
                placeholder="Add a new forbidden phrase..."
                value={newPhrase}
                onChange={(e) => setNewPhrase(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addPhrase()}
                className="flex-1 bg-[#fff4f3] text-[#4e2121] p-4 rounded-xl outline-none focus:ring-2 focus:ring-[#FF4500]/30 transition-shadow placeholder-[#cd8c8a]"
              />
              <button 
                onClick={addPhrase}
                className="px-6 py-4 rounded-xl bg-[linear-gradient(135deg,#FF4500_0%,#ff7852_100%)] text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Add Rule
              </button>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {forbiddenPhrases.map((phrase, idx) => (
                <div key={idx} className="flex items-center space-x-2 bg-[#ffedeb] text-[#852328] px-4 py-2.5 rounded-full text-sm font-medium border border-[#ffd2d0]">
                  <span>{phrase}</span>
                  <button 
                    onClick={() => removePhrase(idx)}
                    className="text-[#b31b25] hover:text-[#570008] ml-1 p-0.5 rounded-full hover:bg-[#ffd2d0] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
              {forbiddenPhrases.length === 0 && (
                <p className="text-[#834c4b] text-sm italic py-2">No forbidden phrases defined.</p>
              )}
            </div>
          </div>
        </section>

      </main>

      {/* Floating Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-[#ffe1e0] shadow-[0_-10px_40px_rgba(78,33,33,0.05)] z-50">
        <div className="max-w-5xl mx-auto flex justify-end">
          <button className="px-10 py-4 rounded-full bg-[linear-gradient(135deg,#ac2c00_0%,#FF4500_100%)] text-white font-bold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all">
            Save Workspace Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
