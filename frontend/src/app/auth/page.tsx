"use client";

export default function AuthPage() {
  // Convex Stubs
  // const createWorkspace = useMutation(api.workspaces.create);

  return (
    <div className="min-h-screen bg-[#fff4f3] font-['Inter'] flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-[0_20px_40px_rgba(78,33,33,0.05)] ring-1 ring-[#ffd2d0]/50 text-center">
        <h1 className="text-3xl font-bold text-[#ac2c00] mb-2">Join ECGP</h1>
        <p className="text-[#834c4b] mb-10 text-sm">Create a workspace to initialize your enterprise parameters.</p>
        
        <div className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-semibold text-[#834c4b] mb-2 uppercase tracking-wider">Workspace Name</label>
            <input type="text" placeholder="e.g. Acme Corp" className="w-full bg-[#fff4f3] text-[#4e2121] p-4 rounded-xl outline-none focus:ring-2 focus:ring-[#FF4500]/30 transition-shadow"/>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#834c4b] mb-2 uppercase tracking-wider">Your Email</label>
            <input type="email" placeholder="you@acme.com" className="w-full bg-[#fff4f3] text-[#4e2121] p-4 rounded-xl outline-none focus:ring-2 focus:ring-[#FF4500]/30 transition-shadow"/>
          </div>
          <button className="w-full mt-6 py-4 rounded-full bg-[linear-gradient(135deg,#FF4500_0%,#ff7852_100%)] text-white font-bold text-lg hover:-translate-y-0.5 transition-all shadow-md">
            Initialize Workspace
          </button>
        </div>
      </div>
    </div>
  );
}
