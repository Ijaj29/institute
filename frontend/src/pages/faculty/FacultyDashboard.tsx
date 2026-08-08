import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { sessionService } from '@/services/sessionService';


export default function FacultyDashboard() {
  const { user, signOut } = useAuth();
  console.log('Auth user :', user);

  const cookieUser = sessionService.getUser();
  console.log('cookieUser :', cookieUser);

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="w-full max-w-md rounded-xl border border-ink-100 bg-white p-8 text-center shadow-card">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sage-600">
          Signed in
        </p>
        <h1 className="mt-2 font-display text-2xl text-ink-700">
          Welcome Faculty,
        </h1>
        <p className="mt-2 text-sm text-ink-400"></p>
        <div className="mt-6">
          <Button onClick={() => signOut()}>Sign out</Button>
        </div>
      </div>
    </div>
  );
}
