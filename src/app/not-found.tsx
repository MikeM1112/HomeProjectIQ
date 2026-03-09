import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-base flex items-center justify-center px-4">
      <div className="text-center">
        <span className="text-5xl">🏠</span>
        <h1 className="font-serif text-2xl mt-4 mb-2 text-ink">HomeProjectIQ</h1>
        <p className="text-ink-sub mb-6">Page not found</p>
        <Link
          href="/"
          className="btn bg-brand text-white px-6 py-2.5 rounded-lg text-sm font-semibold tap inline-block"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
