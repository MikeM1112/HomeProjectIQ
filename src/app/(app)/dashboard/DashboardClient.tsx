'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { StatsBar } from '@/components/features/dashboard/StatsBar';
import { XPProgress } from '@/components/features/dashboard/XPProgress';
import { RecentProjects } from '@/components/features/dashboard/RecentProjects';
import { SeasonalReminders } from '@/components/features/dashboard/SeasonalReminders';
import { CategoryGrid } from '@/components/features/advisor/CategoryGrid';
import { BadgeShowcase } from '@/components/features/dashboard/BadgeShowcase';
import { SkillTree } from '@/components/features/dashboard/SkillTree';
import { QuickTips } from '@/components/features/dashboard/QuickTips';
import { SavingsInsight } from '@/components/features/dashboard/SavingsInsight';
import { AIAssessmentFlow } from '@/components/advisor/AIAssessmentFlow';
import { Button } from '@/components/ui/Button';
import { useAdvisorStore } from '@/stores/advisorStore';
import { useUser } from '@/hooks/useUser';
import { useProjects } from '@/hooks/useProjects';

export function DashboardClient() {
  const router = useRouter();
  const { selectCategory } = useAdvisorStore();
  const [showAI, setShowAI] = useState(false);
  const { user } = useUser();
  const { projects } = useProjects();

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
      <PageWrapper withGlow>
        <div className="space-y-8">
          {/* AI Photo Assessment CTA */}
          <div
            className="relative overflow-hidden rounded-2xl border border-[var(--glass-border)]"
            style={{
              background: 'var(--glass)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            {/* Gradient overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.08]"
              style={{ background: 'var(--accent-gradient)' }}
            />
            <div className="relative p-5 text-center space-y-3">
              <div
                className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center"
                style={{ background: 'var(--accent-soft)' }}
              >
                <span className="text-3xl">📸</span>
              </div>
              <h2 className="font-serif text-xl text-[var(--text)]">AI Photo Assessment</h2>
              <p className="text-sm text-[var(--text-sub)] max-w-[260px] mx-auto leading-relaxed">
                Snap a photo of any issue for instant diagnosis
              </p>
              <Button onClick={() => setShowAI(true)} size="lg" className="w-full">
                Try AI Assess
              </Button>
            </div>
          </div>

          {/* Quick Tips */}
          <QuickTips />

          {/* Stats Cards */}
          <StatsBar />

          {/* DIY Savings Insight */}
          <SavingsInsight totalSavings={0} projectCount={0} />

          {/* XP Progress */}
          <XPProgress />

          {/* Skill Tree */}
          <div>
            <h2 className="font-serif text-lg mb-3 text-[var(--text)]">Skill Tree</h2>
            <SkillTree skills={user?.skills ?? {}} projects={projects} />
          </div>

          {/* Recent Projects */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-serif text-lg text-[var(--text)]">Recent Projects</h2>
              <Link
                href="/projects"
                className="text-xs font-semibold text-[var(--accent)] hover:brightness-110 transition-all"
              >
                See All
              </Link>
            </div>
            <RecentProjects />
          </div>

          {/* Seasonal Reminders */}
          <SeasonalReminders />

          {/* Badges */}
          <div>
            <h2 className="font-serif text-lg mb-3 text-[var(--text)]">Badges</h2>
            <BadgeShowcase />
          </div>

          {/* Start a New Project */}
          <div>
            <h2 className="font-serif text-lg mb-3 text-[var(--text)]">Start a New Project</h2>
            <CategoryGrid onClick={handleCategory} />
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
