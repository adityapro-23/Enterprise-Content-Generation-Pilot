import { MasonryAssetGrid } from '@/components/ecgp/MasonryAssetGrid';

export default function Gate3Page() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Gate 3: Final Asset Approval</h2>
      <p className="text-slate-600 mb-6">Final review of liquid content adaptation (images, videos) passed by Visual Governance.</p>
      <MasonryAssetGrid />
    </div>
  );
}
