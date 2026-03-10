import Link from 'next/link';
import { Mascot } from '@/components/brand/Mascot';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Ice-blue ambient gradient blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10" aria-hidden="true">
        <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-[0.12] blur-[140px]" style={{ background: 'var(--accent)' }} />
        <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] rounded-full opacity-[0.06] blur-[120px]" style={{ background: 'var(--emerald)' }} />
      </div>
      <div className="w-full max-w-sm">
        <Link href="/" className="flex flex-col items-center gap-2 mb-8">
          <Mascot mode="default" size="lg" />
          <h1 className="font-serif text-2xl text-[var(--text)]">HomeProjectIQ</h1>
          <p className="text-xs text-[var(--text-dim)]">Know before you build</p>
        </Link>
        {children}
      </div>
    </div>
  );
}
