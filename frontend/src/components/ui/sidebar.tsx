import { createContext, useContext, useState, type ReactNode, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface SidebarContextValue {
  collapsed: boolean;
  toggle: () => void;
}
const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('Sidebar components must be used within <SidebarProvider>');
  return ctx;
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <SidebarContext.Provider value={{ collapsed, toggle: () => setCollapsed((c) => !c) }}>
      <div className="flex min-h-screen w-full">{children}</div>
    </SidebarContext.Provider>
  );
}

export function Sidebar({ children }: { children: ReactNode }) {
  const { collapsed } = useSidebar();
  return (
    <aside
      className={cn(
        'sticky top-0 h-screen shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-200',
        collapsed ? 'w-[68px]' : 'w-64',
      )}
    >
      <div className="flex h-full flex-col">{children}</div>
    </aside>
  );
}

export function SidebarHeader({ children }: { children: ReactNode }) {
  return <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">{children}</div>;
}

export function SidebarContent({ children }: { children: ReactNode }) {
  return <div className="flex-1 overflow-y-auto px-2 py-4">{children}</div>;
}

export function SidebarFooter({ children }: { children: ReactNode }) {
  return <div className="border-t border-sidebar-border p-2">{children}</div>;
}

export function SidebarGroupLabel({ children }: { children: ReactNode }) {
  const { collapsed } = useSidebar();
  if (collapsed) return null;
  return <p className="px-3 pb-1.5 pt-4 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">{children}</p>;
}

export function SidebarMenu({ children }: { children: ReactNode }) {
  return <nav className="flex flex-col gap-0.5">{children}</nav>;
}

interface SidebarMenuButtonProps extends HTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  active?: boolean;
  asChild?: boolean;
}

export function SidebarMenuButton({ icon, label, active, className, ...rest }: SidebarMenuButtonProps) {
  const { collapsed } = useSidebar();
  return (
    <button
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : 'text-sidebar-foreground/80 hover:bg-white/5 hover:text-sidebar-foreground',
        className,
      )}
      title={collapsed ? label : undefined}
      {...rest}
    >
      <span className="shrink-0">{icon}</span>
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  );
}

export function SidebarTrigger() {
  const { toggle } = useSidebar();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle sidebar"
      className="flex h-8 w-8 items-center justify-center rounded-md text-ink-400 hover:bg-ink-100 dark:hover:bg-white/10"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <line x1="9" y1="4" x2="9" y2="20" />
      </svg>
    </button>
  );
}

export function SidebarInset({ children }: { children: ReactNode }) {
  return <div className="flex min-h-screen flex-1 flex-col bg-paper dark:bg-ink-900">{children}</div>;
}