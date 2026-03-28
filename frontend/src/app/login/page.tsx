'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// ─── ECGP Auth Logo / Brand Mark ──────────────────────────────
function BrandMark() {
  return (
    <div className="flex items-center gap-3 mb-10">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-600/40">
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <div>
        <span className="text-lg font-bold text-white tracking-tight">ECGP</span>
        <p className="text-xs text-slate-500 -mt-0.5">Enterprise Content Generation Pilot</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * TODO — CONVEX AUTH INTEGRATION:
   * Replace this mock with a real Convex auth call:
   *
   *   const { signIn } = useAuthActions(); // from convex/react-auth
   *
   * Routing logic after sign-in:
   *   1. Query Convex: const workspace = useQuery(api.workspace.getMyWorkspace);
   *   2. If workspace exists → router.push('/main')
   *   3. If no workspace (new user first login) → router.push('/workspace/setup')
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Mock auth delay
    await new Promise((r) => setTimeout(r, 1000));

    // MOCK ROUTING LOGIC:
    // In production, this checks: does the authenticated user have a workspace document in Convex?
    const hasWorkspace = email.includes('returning'); // mock condition

    if (!email || !password) {
      setError('Please enter your email and password.');
      setIsLoading(false);
      return;
    }

    if (hasWorkspace) {
      router.push('/main'); // Returning user with workspace
    } else {
      router.push('/workspace/setup'); // New user — needs workspace setup
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-in">
        <div className="glass-card p-8 glow-indigo">
          <BrandMark />

          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-slate-400 text-sm mb-8">
            Sign in to continue to your workspace.
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="input-label">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="input-field"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="input-label">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
                autoComplete="current-password"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded accent-indigo-500" />
                <span className="text-sm text-slate-400">Remember me</span>
              </label>
              <a href="#" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              id="btn-login"
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Dev routing shortcuts */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <p className="text-xs text-slate-600 text-center mb-3 uppercase tracking-wider font-semibold">
              🛠 Dev Quick Nav
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => router.push('/main')} className="btn-ghost text-xs justify-center border border-slate-700">
                → /main
              </button>
              <button onClick={() => router.push('/workspace/setup')} className="btn-ghost text-xs justify-center border border-slate-700">
                → /workspace/setup
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
