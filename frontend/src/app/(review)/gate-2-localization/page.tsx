import { TranscreationGrid } from '@/components/ecgp/TranscreationGrid';

export default function Gate2Page() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Gate 2: Localized Text Approval</h2>
      <p className="text-slate-600 mb-6">Review transcreated content across all selected regions for cultural accuracy.</p>
      <TranscreationGrid />
    </div>
  );
}
