export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-4xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Campaign Initiation</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        {children}
      </div>
    </div>
  );
}
