'use client';

import { Navbar } from '@/components/layout/Navbar';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { MaintenanceDashboard } from '@/components/maintenance/MaintenanceDashboard';

export default function MaintenancePage() {
  return (
    <>
      <Navbar title="Home Maintenance" showBack />
      <PageWrapper withGlow>
        <MaintenanceDashboard />
      </PageWrapper>
    </>
  );
}
