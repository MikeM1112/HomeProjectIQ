'use client';

import { Navbar } from '@/components/layout/Navbar';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { CapabilityScoreGauge } from '@/components/features/intelligence/CapabilityScoreGauge';
import { RiskRadarChart } from '@/components/features/intelligence/RiskRadarChart';
import { AlertCard } from '@/components/features/intelligence/AlertCard';
import { RecommendationCard } from '@/components/features/intelligence/RecommendationCard';
import { ROUTES } from '@/lib/constants';

export function IntelligenceClient() {
  return (
    <>
      <Navbar title="Home Intelligence" showBack backHref={ROUTES.DASHBOARD} />
      <PageWrapper>
        <div className="space-y-4">
          <CapabilityScoreGauge />
          <RiskRadarChart />
          <AlertCard />
          <RecommendationCard />
        </div>
      </PageWrapper>
    </>
  );
}
