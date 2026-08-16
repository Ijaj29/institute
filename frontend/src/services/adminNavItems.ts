import type { ReactNode } from 'react';
import { LayoutDashboard, Users, GraduationCap, Wallet, Settings } from 'lucide-react';
import { createElement } from 'react';

export interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
}

export const adminNavItems: NavItem[] = [
  { label: 'Overview', path: '/adminDashboard', icon: createElement(LayoutDashboard, { size: 18 }) },
  { label: 'Students', path: '/adminDashboard/students', icon: createElement(GraduationCap, { size: 18 }) },
  { label: 'Staff & Faculty', path: '/adminDashboard/staff', icon: createElement(Users, { size: 18 }) },
  { label: 'Fees', path: '/adminDashboard/fees', icon: createElement(Wallet, { size: 18 }) },
  { label: 'Settings', path: '/adminDashboard/settings', icon: createElement(Settings, { size: 18 }) },
];