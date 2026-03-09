import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createShareClient } from '@/lib/supabase/server';
import { cn, formatCurrency, getVerdictLabel, getVerdictColor, getConfidenceLabel } from '@/lib/utils';
import type { Verdict } from '@/types/app';
import { ShareButtonWrapper } from '@/components/share/ShareButtonWrapper';

interface SharePageProps {
  params: Promise<{ id: string }>;
}

interface ShareProject {
  id: string;
  title: string;
  category_id: string;
  confidence: number;
  verdict: Verdict;
  estimated_diy_lo: number | null;
  estimated_diy_hi: number | null;
  estimated_pro_lo: number | null;
  estimated_pro_hi: number | null;
}

export default async function SharePage({ params }: SharePageProps) {
  const { id } = await params;
  const supabase = createShareClient();

  const { data, error } = await supabase
    .from('projects')
    .select('id, title, category_id, confidence, verdict, estimated_diy_lo, estimated_diy_hi, estimated_pro_lo, estimated_pro_hi')
    .eq('id', id)
    .single();

  if (error || !data) {
    notFound();
  }

  const project = data as unknown as ShareProject;

  const verdict = project.verdict;
  const verdictLabel = getVerdictLabel(verdict);
  const verdictColor = getVerdictColor(verdict);
  const confidenceInfo = getConfidenceLabel(project.confidence);

  const diyMid = project.estimated_diy_lo && project.estimated_diy_hi
    ? Math.round((project.estimated_diy_lo + project.estimated_diy_hi) / 2)
    : null;
  const proMid = project.estimated_pro_lo && project.estimated_pro_hi
    ? Math.round((project.estimated_pro_lo + project.estimated_pro_hi) / 2)
    : null;
  const savings = diyMid !== null && proMid !== null ? proMid - diyMid : 0;

  const verdictBgClass = cn({
    'from-green-50 to-emerald-50': verdict === 'diy_easy',
    'from-amber-50 to-yellow-50': verdict === 'diy_caution',
    'from-red-50 to-rose-50': verdict === 'hire_pro',
  });

  return (
    <main className="min-h-screen bg-surface-base">
      {/* Header */}
      <header className="px-4 py-4 border-b border-border bg-white">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <span className="font-serif text-lg text-ink">HomeProjectIQ</span>
          </Link>
          <Link
            href="/login"
            className="text-sm font-semibold text-brand hover:text-brand-medium transition-colors"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Assessment Card */}
      <div className="px-4 py-8 max-w-lg mx-auto">
        <div className={cn('rounded-2xl bg-gradient-to-br shadow-md overflow-hidden', verdictBgClass)}>
          {/* Verdict Banner */}
          <div
            className="px-6 py-3 text-center"
            style={{ backgroundColor: verdictColor }}
          >
            <p className="text-white font-semibold text-sm tracking-wide uppercase">
              {verdictLabel}
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-8 space-y-6">
            {/* Title */}
            <h1 className="font-serif text-2xl text-ink text-center leading-tight">
              {project.title}
            </h1>

            {/* Confidence Score */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-[160px] h-[96px]">
                <svg viewBox="0 0 200 120" className="w-full h-full">
                  <path
                    d={`M ${100 - 80} 100 A 80 80 0 0 1 ${100 + 80} 100`}
                    fill="none"
                    stroke="#E5E0DB"
                    strokeWidth={10}
                    strokeLinecap="round"
                  />
                  <path
                    d={`M ${100 - 80} 100 A 80 80 0 0 1 ${100 + 80} 100`}
                    fill="none"
                    stroke={verdictColor}
                    strokeWidth={10}
                    strokeLinecap="round"
                    strokeDasharray={Math.PI * 80}
                    strokeDashoffset={Math.PI * 80 - (project.confidence / 100) * Math.PI * 80}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
                  <span
                    className="font-serif text-4xl font-bold"
                    style={{ color: verdictColor }}
                  >
                    {project.confidence}
                  </span>
                </div>
              </div>
              <div
                className="tag text-sm"
                style={{ backgroundColor: confidenceInfo.bg, color: confidenceInfo.color }}
              >
                {confidenceInfo.label}
              </div>
              <p className="text-sm text-ink-sub text-center mt-1">
                {confidenceInfo.heading} {confidenceInfo.body}
              </p>
            </div>

            {/* Cost Comparison */}
            {(project.estimated_diy_lo !== null || project.estimated_pro_lo !== null) && (
              <div className="bg-white rounded-xl border border-border p-4 space-y-3">
                {project.estimated_diy_lo !== null && project.estimated_diy_hi !== null && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-success">DIY Cost</span>
                    <span className="font-mono text-sm">
                      {formatCurrency(project.estimated_diy_lo)} – {formatCurrency(project.estimated_diy_hi)}
                    </span>
                  </div>
                )}
                {project.estimated_pro_lo !== null && project.estimated_pro_hi !== null && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-info">Pro Cost</span>
                    <span className="font-mono text-sm">
                      {formatCurrency(project.estimated_pro_lo)} – {formatCurrency(project.estimated_pro_hi)}
                    </span>
                  </div>
                )}
                {savings > 0 && (
                  <>
                    <div className="border-t border-border" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-brand">Potential Savings</span>
                      <span className="font-mono text-sm font-semibold text-brand">
                        {formatCurrency(savings)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Share Button */}
            <ShareButtonWrapper
              projectId={project.id}
              title={project.title}
              confidence={project.confidence}
              verdict={verdict}
              savings={savings}
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-ink-sub text-sm">
            Want to know if your next home project is DIY-friendly?
          </p>
          <Link
            href="/signup"
            className="btn bg-brand text-white px-8 py-3 rounded-lg text-base font-semibold tap inline-block"
          >
            Get Your Free Assessment
          </Link>
          <p className="text-xs text-ink-dim">
            Free forever for homeowners. No credit card required.
          </p>
        </div>

        {/* Mobile Deep Link */}
        <div className="mt-6 text-center sm:hidden">
          <p className="text-sm text-brand font-medium">
            Open in App
          </p>
          <p className="text-xs text-ink-dim mt-1">Coming soon on iOS and Android</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-4 py-6 text-center border-t border-border">
        <p className="text-xs text-ink-dim">
          &copy; {new Date().getFullYear()} HomeProjectIQ. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
