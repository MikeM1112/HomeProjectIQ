'use client';

import { Navbar } from '@/components/layout/Navbar';
import { ProjectsClient } from './ProjectsClient';

export default function ProjectsPage() {
  return (
    <>
      <Navbar title="Projects" />
      <ProjectsClient />
    </>
  );
}
