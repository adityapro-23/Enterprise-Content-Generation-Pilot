export function TranscreationGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((item) => (
        <div key={item} className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Locale {item}</h3>
          <div className="h-32 border-2 border-dashed border-slate-300 rounded flex items-center justify-center text-slate-400 mb-4 bg-slate-50">
            [ Translated String Placeholder ]
          </div>
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span>Character Count: --</span>
            <span className="text-green-600 font-semibold flex items-center gap-1">✓ LQA Passed</span>
          </div>
        </div>
      ))}
    </div>
  );
}
