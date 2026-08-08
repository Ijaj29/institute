import type { Role } from '@/types/auth.types';

/** Each role's home route. Add new roles here and nowhere else. */
export const ROLE_DASHBOARD_PATH: Record<Role, string> = {
  ADMIN: '/adminDashboard',
  FACULTY: '/facultyDashboard',
  STAFF: '/staffDashboard',
  STUDENT: '/studentDashboard',
};

export function getDashboardPathForRole(role: Role | undefined): string {
  return role && ROLE_DASHBOARD_PATH[role] ? ROLE_DASHBOARD_PATH[role] : '/login';
}