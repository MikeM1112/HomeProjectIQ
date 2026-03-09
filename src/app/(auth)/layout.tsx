import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none -z-10" aria-hidden="true">
        <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]" style={{ background: 'var(--accent)' }} />
      </div>
      <div className="w-full max-w-sm">
        <Link href="/" className="block text-center mb-8">
          <span className="text-4xl">🏠</span>
          <h1 className="font-serif text-2xl mt-2 text-[var(--ink)]">HomeProjectIQ</h1>
        </Link>
        {children}
      </div>
    </div>
  );
}
