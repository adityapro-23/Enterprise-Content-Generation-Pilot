export default function ReviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-6xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-6 text-indigo-900">HITL Review Gates</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        {children}
      </div>
    </div>
  );
}
