'use client';

import { useState } from 'react';
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
import { SmartInsights } from '@/components/features/dashboard/SmartInsights';
import { HoneyDoList } from '@/components/features/dashboard/HoneyDoList';
import { ToolLending } from '@/components/features/dashboard/ToolLending';
import { Leaderboard } from '@/components/features/dashboard/Leaderboard';
import { LiveBids } from '@/components/features/dashboard/LiveBids';
import { ProNetwork } from '@/components/features/dashboard/ProNetwork';
import { MaintenanceSchedule } from '@/components/features/dashboard/MaintenanceSchedule';
import { LastDoneTracker } from '@/components/features/dashboard/LastDoneTracker';
import { HomeHealth } from '@/components/features/dashboard/HomeHealth';
import { AIAssessmentFlow } from '@/components/advisor/AIAssessmentFlow';
import { Button } from '@/components/ui/Button';
import { useAdvisorStore } from '@/stores/advisorStore';
import { useUser } from '@/hooks/useUser';
import { useProjects } from '@/hooks/useProjects';
import { useUIStore } from '@/stores/uiStore';
import {
  DEMO_SMART_INSIGHTS,
  DEMO_HONEY_DO,
  DEMO_TOOL_LOANS,
  DEMO_LEADERBOARD,
  DEMO_LIVE_BIDS,
  DEMO_PRO_RECS,
  DEMO_MAINTENANCE,
  DEMO_LAST_DONE,
  DEMO_HOME_HEALTH,
} from '@/lib/demo-data';

export default function DemoDashboardPage() {
  const { selectCategory } = useAdvisorStore();
  const [showAI, setShowAI] = useState(false);
  const { user } = useUser();
  const { projects } = useProjects();
  const { showToast } = useUIStore();

  const handleCategory = (id: string) => {
    selectCategory(id);
    showToast('Sign up to start your own projects!', 'info');
  };

  const handleDemoAction = () => {
    showToast('Sign up to save your work!', 'info');
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
          {/* Smart Insights (weather/seasonal AI tips) */}
          <SmartInsights insights={DEMO_SMART_INSIGHTS} />

          {/* AI Photo Assessment CTA */}
          <div
            className="relative overflow-hidden rounded-2xl border border-[var(--glass-border)]"
            style={{
              background: 'var(--glass)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
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
                Snap a photo &mdash; get a diagnosis, live bids from pros, and a full DIY plan
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

          {/* Home Health Score */}
          <HomeHealth data={DEMO_HOME_HEALTH} />

          {/* Handiness Leaderboard */}
          <Leaderboard entries={DEMO_LEADERBOARD} />

          {/* DIY Savings Insight */}
          <SavingsInsight totalSavings={184000} projectCount={14} />

          {/* XP Progress */}
          <XPProgress />

          {/* Honey-Do List */}
          <HoneyDoList items={DEMO_HONEY_DO} onToggle={handleDemoAction} />

          {/* Maintenance Schedule */}
          <MaintenanceSchedule
            tasks={DEMO_MAINTENANCE}
            onMarkDone={() => showToast('Sign up to track your maintenance!', 'info')}
          />

          {/* Live Contractor Bids */}
          <LiveBids
            bids={DEMO_LIVE_BIDS}
            projectTitle="Ceiling Fan Installation"
            onSelect={() => showToast('Sign up to connect with this pro!', 'info')}
          />

          {/* Skill Tree */}
          <div>
            <h2 className="font-serif text-lg mb-3 text-[var(--text)]">Skill Tree</h2>
            <SkillTree skills={user?.skills ?? {}} projects={projects} />
          </div>

          {/* Tool Lending Tracker */}
          <ToolLending loans={DEMO_TOOL_LOANS} />

          {/* Last Time You Did X */}
          <LastDoneTracker items={DEMO_LAST_DONE} />

          {/* Recent Projects */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-serif text-lg text-[var(--text)]">Recent Projects</h2>
              <Link
                href="/demo/dashboard"
                className="text-xs font-semibold text-[var(--accent)] hover:brightness-110 transition-all"
              >
                See All
              </Link>
            </div>
            <RecentProjects />
          </div>

          {/* Pro Network */}
          <ProNetwork recommendations={DEMO_PRO_RECS} />

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
