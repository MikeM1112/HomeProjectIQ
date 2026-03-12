'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  Plus,
  ScanLine,
  ChevronRight,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Mascot } from '@/components/brand/Mascot';
import { useProjects } from '@/hooks/useProjects';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Project } from '@/types/app';

const FILTER_TABS = ['All', 'Active', 'Completed', 'Saved'] as const;
type FilterTab = (typeof FILTER_TABS)[number];

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
};

function getStatusConfig(status: Project['status']) {
  switch (status) {
    case 'planning':
      return { label: 'Planning', variant: 'info' as const };
    case 'in_progress':
      return { label: 'Active', variant: 'warning' as const };
    case 'completed':
      return { label: 'Completed', variant: 'success' as const };
    case 'hired_pro':
      return { label: 'Hired Pro', variant: 'default' as const };
  }
}

function filterProjects(projects: Project[], tab: FilterTab): Project[] {
  switch (tab) {
    case 'All':
      return projects;
    case 'Active':
      return projects.filter(
        (p) => p.status === 'in_progress' || p.status === 'planning'
      );
    case 'Completed':
      return projects.filter(
        (p) => p.status === 'completed' || p.status === 'hired_pro'
      );
    case 'Saved':
      return projects.filter((p) => p.status === 'planning');
  }
}

export function ProjectsClient() {
  const router = useRouter();
  const { projects, isLoading } = useProjects();
  const [activeTab, setActiveTab] = useState<FilterTab>('All');

  const filtered = filterProjects(projects ?? [], activeTab);

  return (
    <div className="max-w-[480px] lg:max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1
          className="text-2xl font-bold"
          style={{
            fontFamily: "var(--font-instrument-serif, 'Instrument Serif', serif)",
            color: 'var(--text)',
          }}
        >
          My Projects
        </h1>
        <Button
          size="sm"
          onClick={() => router.push('/diagnose')}
        >
          <Plus className="w-4 h-4" />
          New
        </Button>
      </div>

      {/* Filter tabs */}
      <div
        className="flex gap-1 p-1 rounded-2xl mb-5"
        style={{ background: 'var(--tab-bg)' }}
      >
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200',
              activeTab === tab
                ? 'text-white shadow-md'
                : 'text-[var(--text-dim)] hover:text-[var(--text-sub)]'
            )}
            style={
              activeTab === tab
                ? {
                    background: 'var(--accent-gradient)',
                    boxShadow: '0 2px 12px var(--accent-glow)',
                  }
                : undefined
            }
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-[20px] p-4 animate-pulse"
              style={{
                background: 'var(--glass)',
                border: '1px solid var(--glass-border)',
              }}
            >
              <div
                className="h-4 w-2/3 rounded-full mb-2"
                style={{ background: 'var(--surface-3)' }}
              />
              <div
                className="h-3 w-1/3 rounded-full"
                style={{ background: 'var(--surface-3)' }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <Mascot size="xl" mode="default" className="mx-auto mb-4" />
          <p
            className="text-lg font-semibold mb-1"
            style={{ color: 'var(--text)' }}
          >
            No projects yet
          </p>
          <p
            className="text-sm mb-6"
            style={{ color: 'var(--text-sub)' }}
          >
            Start by diagnosing an issue around your home
          </p>
          <Button onClick={() => router.push('/diagnose')}>
            <ScanLine className="w-5 h-5" />
            Start Diagnosis
          </Button>
        </motion.div>
      )}

      {/* Project cards */}
      {!isLoading && filtered.length > 0 && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => {
              const statusConfig = getStatusConfig(project.status);
              const diyCost =
                project.estimated_diy_lo !== null
                  ? formatCurrency(project.estimated_diy_lo)
                  : null;

              return (
                <motion.div
                  key={project.id}
                  variants={item}
                  layout
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => router.push(`/project/${project.id}`)}
                  className="rounded-[20px] p-4 cursor-pointer transition-all duration-300 group hover:border-[var(--glass-border-hover)] hover:shadow-[var(--card-shadow-hover)]"
                  style={{
                    background: 'var(--glass)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid var(--glass-border)',
                    boxShadow: 'var(--card-shadow)',
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Title */}
                      <p
                        className="text-sm font-semibold truncate mb-1.5"
                        style={{ color: 'var(--text)' }}
                      >
                        {project.title}
                      </p>

                      {/* Meta row */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={statusConfig.variant}>
                          {statusConfig.label}
                        </Badge>
                        <span
                          className="text-[11px] capitalize"
                          style={{ color: 'var(--text-dim)' }}
                        >
                          {project.category_id.replace(/_/g, ' ')}
                        </span>
                      </div>

                      {/* Bottom row: date + cost */}
                      <div className="flex items-center gap-4 mt-2">
                        <span
                          className="flex items-center gap-1 text-[11px]"
                          style={{ color: 'var(--text-dim)' }}
                        >
                          <Calendar className="w-3 h-3" />
                          {formatDate(project.created_at)}
                        </span>
                        {diyCost && (
                          <span
                            className="flex items-center gap-1 text-[11px]"
                            style={{ color: 'var(--emerald)' }}
                          >
                            <DollarSign className="w-3 h-3" />
                            {diyCost}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Chevron */}
                    <ChevronRight
                      className="w-5 h-5 flex-shrink-0 mt-1 opacity-40 group-hover:opacity-70 transition-opacity"
                      style={{ color: 'var(--text-dim)' }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* FAB for mobile */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
        onClick={() => router.push('/diagnose')}
        className="fixed bottom-24 right-5 lg:hidden w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg z-30"
        style={{
          background: 'var(--accent-gradient)',
          boxShadow: '0 6px 28px var(--accent-glow)',
        }}
        whileTap={{ scale: 0.9 }}
      >
        <Plus className="w-6 h-6 text-white" />
      </motion.button>
    </div>
  );
}
