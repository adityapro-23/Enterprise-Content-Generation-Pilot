import { SplitScreenReviewer } from '@/components/ecgp/SplitScreenReviewer';

export default function Gate1Page() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Gate 1: Master Text Approval</h2>
      <p className="text-slate-600 mb-6">Review the AI-generated master text passed by the Textual Governance Agent.</p>
      <SplitScreenReviewer />
    </div>
  );
}
