import { DemoProvider } from '@/components/providers/DemoProvider';
import { BottomNav } from '@/components/layout/BottomNav';

export default function DemoLiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider>
      <div
        className="min-h-screen pt-safe-top pb-20 relative"
        style={{ transition: 'all 0.5s ease' }}
      >
        {/* Background gradient blobs — ice-blue ambient glow */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[var(--accent)] opacity-[0.06] blur-[140px] animate-glow-pulse" />
          <div
            className="absolute top-1/3 -left-48 w-96 h-96 rounded-full bg-[var(--accent)] opacity-[0.04] blur-[160px] animate-glow-pulse"
            style={{ animationDelay: '2s' }}
          />
          <div
            className="absolute -bottom-32 right-1/4 w-80 h-80 rounded-full bg-[var(--emerald)] opacity-[0.03] blur-[120px] animate-glow-pulse"
            style={{ animationDelay: '4s' }}
          />
        </div>
        {children}
        <BottomNav />
      </div>
    </DemoProvider>
  );
}
