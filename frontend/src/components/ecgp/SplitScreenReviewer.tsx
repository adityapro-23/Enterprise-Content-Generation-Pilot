export function SplitScreenReviewer() {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1 bg-slate-50 border border-slate-200 rounded p-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">Original Semantic Context</h3>
        <div className="h-64 border-2 border-dashed border-slate-300 rounded flex items-center justify-center text-slate-400 bg-white">
          [ Document / Knowledge Payload Viewer ]
        </div>
      </div>
      <div className="flex-1 bg-slate-50 border border-slate-200 rounded p-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">Generated Master Draft</h3>
        <div className="h-64 border-2 border-dashed border-slate-300 rounded flex items-center justify-center text-slate-400 bg-white">
          [ Editable Text Box Placeholder ]
        </div>
      </div>
    </div>
  );
}
