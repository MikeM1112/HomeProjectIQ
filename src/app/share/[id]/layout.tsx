import type { Metadata } from 'next';
import { createShareClient } from '@/lib/supabase/server';
import { getVerdictLabel, formatCurrency } from '@/lib/utils';
import type { Verdict } from '@/types/app';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

interface ShareProjectMeta {
  title: string;
  confidence: number;
  verdict: Verdict;
  category_id: string;
  estimated_diy_lo: number | null;
  estimated_diy_hi: number | null;
  estimated_pro_lo: number | null;
  estimated_pro_hi: number | null;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = createShareClient();

  const { data } = await supabase
    .from('projects')
    .select('title, confidence, verdict, category_id, estimated_diy_lo, estimated_diy_hi, estimated_pro_lo, estimated_pro_hi')
    .eq('id', id)
    .single();

  if (!data) {
    return {
      title: 'Assessment Not Found | HomeProjectIQ',
    };
  }

  const project = data as unknown as ShareProjectMeta;
  const verdictLabel = getVerdictLabel(project.verdict);

  const diyMid = project.estimated_diy_lo && project.estimated_diy_hi
    ? Math.round((project.estimated_diy_lo + project.estimated_diy_hi) / 2)
    : null;
  const proMid = project.estimated_pro_lo && project.estimated_pro_hi
    ? Math.round((project.estimated_pro_lo + project.estimated_pro_hi) / 2)
    : null;
  const savings = diyMid !== null && proMid !== null ? proMid - diyMid : 0;

  const title = `${project.title} - ${verdictLabel} | HomeProjectIQ`;
  const savingsText = savings > 0 ? ` Save up to ${formatCurrency(savings)} by DIYing.` : '';
  const description = `DIY Confidence: ${project.confidence}/100. Verdict: ${verdictLabel}.${savingsText} Get your free assessment at HomeProjectIQ.`;

  const ogParams = new URLSearchParams({
    title: project.title,
    confidence: String(project.confidence),
    verdict: project.verdict,
    savings: String(savings),
    category: project.category_id,
  });

  const ogImageUrl = `/api/og?${ogParams.toString()}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      siteName: 'HomeProjectIQ',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${project.title} assessment result`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default function ShareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
