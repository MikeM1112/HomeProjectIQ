import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { BottomNav } from '@/components/layout/BottomNav';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (
    <div className="min-h-screen bg-[var(--bg)] pt-safe-top pb-20 relative transition-colors duration-300">
      {/* Background gradient blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-[200px] -left-[100px] w-[500px] h-[500px] rounded-full opacity-[0.07] blur-[120px] animate-glow-pulse"
          style={{ background: 'var(--accent)' }}
        />
        <div
          className="absolute -bottom-[200px] -right-[100px] w-[400px] h-[400px] rounded-full opacity-[0.05] blur-[120px] animate-glow-pulse"
          style={{ background: 'var(--green)', animationDelay: '1.5s' }}
        />
      </div>
      {children}
      <BottomNav />
    </div>
  );
}
