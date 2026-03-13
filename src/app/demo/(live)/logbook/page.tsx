'use client';

import { Navbar } from '@/components/layout/Navbar';
import { ProjectsClient } from '@/app/(app)/logbook/ProjectsClient';

export default function DemoProjectsPage() {
  return (
    <>
      <Navbar title="Projects" />
      <ProjectsClient isDemo />
    </>
  );
}
