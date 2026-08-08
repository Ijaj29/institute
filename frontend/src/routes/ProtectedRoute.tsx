import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getDashboardPathForRole } from '@/utils/roleRoutes';
import type { Role } from '@/types/auth.types';


interface ProtectedRouteProps {
  children: ReactNode;
  /** Roles allowed on this route. Omit to just require any authenticated user. */
  allowedRoles?: Role[];
}

// export function ProtectedRoute({ children }: { children: ReactNode }) {
//   const { user } = useAuth();

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   return <>{children}</>;
// }


export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Signed in, but this route belongs to a different role — send them to THEIR dashboard,
  // not /login, so faculty hitting /adminDashboard doesn't just bounce them out.
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getDashboardPathForRole(user.role)} replace />;
  }

  return <>{children}</>;
}