import { useState, useRef, useEffect } from 'react';
import { Sun, Moon, LogOut, ChevronDown } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

export function Topbar() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b border-ink-100 bg-white px-4 dark:border-white/10 dark:bg-ink-900">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <p className="font-display text-lg text-ink-700 dark:text-paper">Admin</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-400 hover:bg-ink-100 dark:hover:bg-white/10"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 hover:bg-ink-100 dark:hover:bg-white/10"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-100 font-display text-sm text-sage-600">
              {user?.unm?.charAt(0).toUpperCase() ?? 'A'}
            </span>
            <span className="hidden text-sm font-medium text-ink-700 dark:text-paper sm:block">
              {user?.unm}
            </span>
            <ChevronDown size={14} className="text-ink-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-11 w-56 overflow-hidden rounded-lg border border-ink-100 bg-white py-1 shadow-card dark:border-white/10 dark:bg-ink-700">
              <div className="border-b border-ink-100 px-3.5 py-2.5 dark:border-white/10">
                <p className="text-sm font-medium text-ink-700 dark:text-paper">{user?.unm}</p>
                <p className="text-xs text-ink-400">{user?.role}</p>
              </div>
              <button
                onClick={signOut}
                className="flex w-full items-center gap-2 px-3.5 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}