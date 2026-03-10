'use client';

import { useState, useEffect } from 'react';
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
import { MaintenanceDashboardCompact } from '@/components/maintenance/MaintenanceDashboardCompact';
import { AIAssessmentFlow } from '@/components/advisor/AIAssessmentFlow';
import { Button } from '@/components/ui/Button';
import { Mascot, MascotGreeting } from '@/components/brand/Mascot';
import { BrandIcon } from '@/components/brand/BrandIcon';
import { useAdvisorStore } from '@/stores/advisorStore';
import { useUser } from '@/hooks/useUser';
import { useProjects } from '@/hooks/useProjects';

export function DashboardClient() {
  const router = useRouter();
  const { selectCategory } = useAdvisorStore();
  const [showAI, setShowAI] = useState(false);
  const { user } = useUser();
  const { projects } = useProjects();

  // Listen for scan button from BottomNav
  useEffect(() => {
    const handler = () => setShowAI(true);
    window.addEventListener('homeiq:start-assessment', handler);
    return () => window.removeEventListener('homeiq:start-assessment', handler);
  }, []);

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
        <div className="space-y-6">
          {/* Welcome + Mascot Header */}
          <div className="flex items-center gap-3">
            <Mascot mode="default" size="md" />
            <div>
              <MascotGreeting name={user?.display_name?.split(' ')[0] ?? 'there'} />
            </div>
          </div>

          {/* AI Photo Assessment CTA */}
          <div
            className="relative overflow-hidden rounded-[20px] border border-[var(--glass-border)]"
            style={{
              background: 'var(--glass)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: 'var(--card-shadow, 0 2px 16px rgba(0,0,0,0.08))',
            }}
          >
            {/* Gradient overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.06]"
              style={{ background: 'var(--accent-gradient)' }}
            />
            <div className="relative p-5 flex items-center gap-4">
              <div className="w-14 h-14 shrink-0 flex items-center justify-center">
                <BrandIcon name="diagnose" size={56} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-serif text-lg text-[var(--text)]">Diagnose a Problem</h2>
                <p className="text-xs text-[var(--text-sub)] mt-0.5">
                  Snap a photo for instant AI diagnosis
                </p>
              </div>
              <Button onClick={() => setShowAI(true)} size="md">
                Scan
              </Button>
            </div>
          </div>

          {/* Maintenance Hub — Home Health Score */}
          <MaintenanceDashboardCompact />

          {/* XP Progress */}
          <XPProgress />

          {/* Quick Tips */}
          <QuickTips />

          {/* Recent Projects */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-serif text-lg text-[var(--text)]">Recent Projects</h2>
              <Link
                href="/logbook"
                className="text-xs font-semibold text-[var(--accent)] hover:brightness-110 transition-all"
              >
                See All
              </Link>
            </div>
            <RecentProjects />
          </div>

          {/* Stats Cards */}
          <StatsBar />

          {/* Seasonal Reminders */}
          <SeasonalReminders />

          {/* DIY Savings Insight */}
          <SavingsInsight totalSavings={0} projectCount={0} />

          {/* Skill Tree */}
          <div>
            <h2 className="font-serif text-lg mb-3 text-[var(--text)]">Skill Tree</h2>
            <SkillTree skills={user?.skills ?? {}} projects={projects} />
          </div>

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
