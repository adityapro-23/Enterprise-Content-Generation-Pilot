'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', company: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * TODO — CONVEX AUTH INTEGRATION:
   * Replace this mock with Convex user creation:
   *
   *   const { signUp } = useAuthActions(); // from convex/react-auth
   *
   * After successful signUp:
   *   - A new user document is created in Convex.
   *   - Since they have NO workspace yet, ALWAYS route to /workspace/setup.
   *   - The workspace/setup page will create the workspace_rules document.
   */
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      setIsLoading(false);
      return;
    }

    // Mock signup delay
    await new Promise((r) => setTimeout(r, 1200));

    // New user → ALWAYS goes to workspace setup
    router.push('/workspace/setup');
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-violet-600/8 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-in">
        <div className="glass-card p-8 glow-violet">
          <BrandMark />

          <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
          <p className="text-slate-400 text-sm mb-8">
            Set up your enterprise workspace in minutes.
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="name" className="input-label">Full Name <span className="text-rose-400">*</span></label>
                <input id="name" type="text" value={formData.name} onChange={update('name')}
                  placeholder="Jane Smith" className="input-field" required />
              </div>
              <div>
                <label htmlFor="company" className="input-label">Company</label>
                <input id="company" type="text" value={formData.company} onChange={update('company')}
                  placeholder="Acme Corp" className="input-field" />
              </div>
            </div>
            <div>
              <label htmlFor="signup-email" className="input-label">Work Email <span className="text-rose-400">*</span></label>
              <input id="signup-email" type="email" value={formData.email} onChange={update('email')}
                placeholder="you@company.com" className="input-field" required />
            </div>
            <div>
              <label htmlFor="signup-password" className="input-label">Password <span className="text-rose-400">*</span></label>
              <input id="signup-password" type="password" value={formData.password} onChange={update('password')}
                placeholder="Min. 8 characters" className="input-field" minLength={8} required />
            </div>

            <p className="text-xs text-slate-500 pt-1">
              By signing up, you agree to our{' '}
              <a href="#" className="text-indigo-400 hover:underline">Terms of Service</a> and{' '}
              <a href="#" className="text-indigo-400 hover:underline">Privacy Policy</a>.
            </p>

            <button
              id="btn-signup"
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating account…
                </>
              ) : (
                'Create Account & Set Up Workspace →'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
