import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { BottomNav } from '@/components/layout/BottomNav';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (
    <div
      className="min-h-screen pt-safe-top pb-20 relative"
      style={{ background: 'var(--bg)', transition: 'all 0.5s ease' }}
    >
      {/* Background gradient blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[var(--accent)] opacity-[0.04] blur-[120px] animate-glow-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-[var(--emerald)] opacity-[0.03] blur-[120px] animate-glow-pulse"
          style={{ animationDelay: '3s' }}
        />
      </div>
      {children}
      <BottomNav />
    </div>
  );
}
