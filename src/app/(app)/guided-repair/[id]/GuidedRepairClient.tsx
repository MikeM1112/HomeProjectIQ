'use client';

import { Navbar } from '@/components/layout/Navbar';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { GuidedRepairSession } from '@/components/features/guided-repair/GuidedRepairSession';
import { ROUTES } from '@/lib/constants';

export function GuidedRepairClient({ projectId }: { projectId: string }) {
  return (
    <>
      <Navbar title="Guided Repair" showBack backHref={ROUTES.DASHBOARD} />
      <PageWrapper>
        <GuidedRepairSession projectId={projectId} />
      </PageWrapper>
    </>
  );
}
