import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { sessionService } from '@/services/sessionService';


export default function AdminDashboard() {
  const { user, signOut } = useAuth();

  const cookieUser = sessionService.getUser();

  return (
    <div>
      <h1 className="font-display text-2xl text-ink-700 dark:text-paper">Overview</h1>
      <p className="mt-1 text-sm text-ink-400">This renders inside AdminLayout</p>
    </div>
  );
}
