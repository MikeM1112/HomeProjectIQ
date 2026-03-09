'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { StatsBar } from '@/components/features/dashboard/StatsBar';
import { XPProgress } from '@/components/features/dashboard/XPProgress';
import { RecentProjects } from '@/components/features/dashboard/RecentProjects';
import { CategoryGrid } from '@/components/features/advisor/CategoryGrid';
import { BadgeShowcase } from '@/components/features/dashboard/BadgeShowcase';
import { AIAssessmentFlow } from '@/components/advisor/AIAssessmentFlow';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAdvisorStore } from '@/stores/advisorStore';

export function DashboardClient() {
  const router = useRouter();
  const { selectCategory } = useAdvisorStore();
  const [showAI, setShowAI] = useState(false);

  const handleCategory = (id: string) => {
    selectCategory(id);
    router.push(`/project/new?category=${id}`);
  };

  if (showAI) {
    return (
      <>
        <Navbar title="AI Assessment" showBack onBack={() => setShowAI(false)} />
        <PageWrapper>
          <AIAssessmentFlow />
        </PageWrapper>
      </>
    );
  }

  return (
    <>
      <Navbar title="HomeProjectIQ" />
      <PageWrapper>
        <div className="space-y-6">
          {/* AI Photo Assessment CTA */}
          <Card className="bg-brand/5 border-brand/15">
            <div className="text-center space-y-3">
              <span className="text-4xl">&#x1F4F8;</span>
              <h2 className="font-serif text-lg">AI Photo Assessment</h2>
              <p className="text-sm text-ink-sub">
                Snap a photo of any issue for an instant DIY-or-Pro diagnosis
              </p>
              <Button onClick={() => setShowAI(true)} className="w-full">
                Try AI Assessment
              </Button>
            </div>
          </Card>

          <StatsBar />
          <XPProgress />
          <div>
            <h2 className="font-serif text-lg mb-3">Recent Projects</h2>
            <RecentProjects />
          </div>
          <div>
            <h2 className="font-serif text-lg mb-3">Badges</h2>
            <BadgeShowcase />
          </div>
          <div>
            <h2 className="font-serif text-lg mb-3">Start a New Project</h2>
            <CategoryGrid onClick={handleCategory} />
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
