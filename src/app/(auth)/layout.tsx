import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-base flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="block text-center mb-8">
          <span className="text-4xl">🏠</span>
          <h1 className="font-serif text-2xl mt-2 text-ink">HomeProjectIQ</h1>
        </Link>
        {children}
      </div>
    </div>
  );
}
