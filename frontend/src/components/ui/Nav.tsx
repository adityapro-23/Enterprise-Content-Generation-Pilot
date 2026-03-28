import Link from 'next/link';

export function Nav() {
  return (
    <nav className="bg-slate-900 text-white p-4 shadow-md flex gap-6 items-center">
      <div className="font-bold text-xl mr-auto">ECGP</div>
      <Link href="/workspace-setup" className="hover:text-blue-400 transition">Admin (Phase 0)</Link>
      <Link href="/initiate-campaign" className="hover:text-blue-400 transition">Marketing (Phase 1)</Link>
      <div className="flex gap-4 border-l border-slate-700 pl-4">
        <Link href="/gate-1-text" className="text-sm hover:text-blue-400 transition">Gate 1: Master Text</Link>
        <Link href="/gate-2-localization" className="text-sm hover:text-blue-400 transition">Gate 2: Localization</Link>
        <Link href="/gate-3-visuals" className="text-sm hover:text-blue-400 transition">Gate 3: Visual Assets</Link>
      </div>
    </nav>
  );
}
