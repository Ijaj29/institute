import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Topbar } from '@/components/ui/Topbar';
import { adminNavItems } from '@/services/adminNavItems';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-brass/60 font-display text-sm text-paper">
            M
          </span>
          <span className="font-display text-sm text-paper">Meridian Admin</span>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarMenu>
            {adminNavItems.map((item) => (
              <SidebarMenuButton
                key={item.path}
                icon={item.icon}
                label={item.label}
                active={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              />
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <p className="px-2 text-[11px] text-sidebar-foreground/40">v1.0 · Meridian Institute</p>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <Topbar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}