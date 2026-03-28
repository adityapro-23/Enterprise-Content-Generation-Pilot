export function MasonryAssetGrid() {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="bg-white border border-slate-200 rounded p-4 flex flex-col break-inside-avoid shadow-sm">
          <div className="w-full h-40 bg-slate-100 border-2 border-dashed border-slate-300 rounded mb-4 flex items-center justify-center text-slate-400">
             Asset {item} [Video/Img]
          </div>
          <p className="text-sm text-slate-700 font-bold mb-2">Final Publishing Payload</p>
          <div className="h-16 text-xs text-slate-500 border border-slate-200 rounded p-2 flex items-start bg-slate-50">
             [ API Specific Caption Text ]
          </div>
        </div>
      ))}
    </div>
  );
}
