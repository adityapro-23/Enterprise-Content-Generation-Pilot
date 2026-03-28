import { redirect } from 'next/navigation';

/**
 * Root page — redirects to /login.
 * Once Convex Auth is wired up, this should check session state:
 *   - Authenticated + has workspace → /main
 *   - Authenticated + no workspace → /workspace/setup
 *   - Not authenticated → /login
 */
export default function RootPage() {
  redirect('/login');
}
