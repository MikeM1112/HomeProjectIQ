'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, type Variants, AnimatePresence } from 'framer-motion';
import {
  ClipboardList,
  Play,
  Wrench,
  BookOpen,
  Library,
  ChevronRight,
  Clock,
  Telescope,
  Zap,
  Star,
  CheckCircle2,
  Lightbulb,
  TrendingUp,
  Calendar,
  AlertTriangle,
  Filter,
  Sparkles,
  DollarSign,
  Timer,
  Shield,
  Home,
  Leaf,
  Sun,
  Thermometer,
  Droplets,
  Plug,
  PaintBucket,
  Hammer,
  Heart,
} from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Mascot } from '@/components/brand/Mascot';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useProjects } from '@/hooks/useProjects';
import { useLogbook } from '@/hooks/useLogbook';
import { useMaintenance } from '@/hooks/useMaintenance';
import { useDemo } from '@/hooks/useDemo';
import { useUIStore } from '@/stores/uiStore';
import { CATEGORIES } from '@/lib/project-data';
import { ROUTES } from '@/lib/constants';
import { formatCurrency, formatDate, getVerdictLabel } from '@/lib/utils';
import type { Project, LogbookEntry, Verdict } from '@/types/app';
import type { MaintenanceTaskRow } from '@/hooks/useMaintenance';
import {
  DEMO_MAINTENANCE,
  type MaintenanceTask,
} from '@/lib/demo-data';

/* ================================================================
   ANIMATION VARIANTS
   ================================================================ */

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

/* ================================================================
   TAB DEFINITIONS
   ================================================================ */

type TabId = 'landing' | 'planner' | 'active' | 'maintenance' | 'log' | 'library';

interface TabDef {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

const TABS: TabDef[] = [
  { id: 'landing', label: 'Overview', icon: ClipboardList },
  { id: 'planner', label: 'Planner', icon: Lightbulb },
  { id: 'active', label: 'Active', icon: Play },
  { id: 'maintenance', label: 'Maint.', icon: Wrench },
  { id: 'log', label: 'Log', icon: BookOpen },
  { id: 'library', label: 'Library', icon: Library },
];

/* ================================================================
   HELPERS
   ================================================================ */

function daysUntil(dateStr: string): number {
  const now = new Date();
  const target = new Date(dateStr);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function daysAgo(dateStr: string): number {
  return Math.abs(daysUntil(dateStr));
}

function savingsFromProject(p: Project): number {
  const proAvg = ((p.estimated_pro_lo ?? 0) + (p.estimated_pro_hi ?? 0)) / 2;
  const diyAvg = ((p.estimated_diy_lo ?? 0) + (p.estimated_diy_hi ?? 0)) / 2;
  return Math.max(0, proAvg - diyAvg);
}

function verdictStyle(v: Verdict) {
  switch (v) {
    case 'diy_easy':
      return { bg: 'var(--emerald-soft)', color: 'var(--emerald)' };
    case 'diy_caution':
      return { bg: 'var(--gold-soft)', color: 'var(--gold)' };
    case 'hire_pro':
      return { bg: 'var(--danger-soft)', color: 'var(--danger)' };
  }
}

/* ================================================================
   SECTION HEADER
   ================================================================ */

function SectionHeader({
  icon: Icon,
  title,
  count,
  action,
  onAction,
}: {
  icon: React.ElementType;
  title: string;
  count?: number;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4" style={{ color: 'var(--accent)' }} />
        <h3 className="font-serif text-base text-[var(--text)]">{title}</h3>
        {count != null && count > 0 && (
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
            style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
          >
            {count}
          </span>
        )}
      </div>
      {action && onAction && (
        <button
          onClick={onAction}
          className="text-[11px] font-semibold flex items-center gap-0.5"
          style={{ color: 'var(--accent)' }}
        >
          {action}
          <ChevronRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

/* ================================================================
   PROJECT CARD (reused across tabs)
   ================================================================ */

function ProjectCard({
  project,
  onClick,
  showProgress = false,
  stepInfo,
}: {
  project: Project;
  onClick?: () => void;
  showProgress?: boolean;
  stepInfo?: string;
}) {
  const cat = CATEGORIES.find((c) => c.id === project.category_id);
  const vs = verdictStyle(project.verdict);

  return (
    <Card variant="interactive" padding="sm" onClick={onClick}>
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: 'var(--icon-bg)' }}
        >
          {cat?.icon ?? '🔧'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--text)] truncate">{project.title}</p>
          {stepInfo && (
            <p className="text-[11px] text-[var(--text-dim)]">{stepInfo}</p>
          )}
          {!stepInfo && (
            <p className="text-xs text-[var(--text-dim)]">{formatDate(project.created_at)}</p>
          )}
          {showProgress && project.status === 'in_progress' && (
            <div className="mt-1.5">
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--glass-border)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: '60%', background: 'var(--accent)' }}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span
            className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full"
            style={{ background: vs.bg, color: vs.color }}
          >
            {getVerdictLabel(project.verdict)}
          </span>
          {project.status === 'completed' && (
            <span className="text-[9px] font-bold text-[var(--emerald)]">
              Saved {formatCurrency(savingsFromProject(project))}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

/* ================================================================
   MAINTENANCE ITEM CARD (for demo data)
   ================================================================ */

function MaintenanceItemCard({
  task,
  onAction,
}: {
  task: MaintenanceTask;
  onAction?: () => void;
}) {
  const statusStyles = {
    on_track: { bg: 'var(--emerald-soft)', color: 'var(--emerald)', label: 'On Track' },
    due_soon: { bg: 'var(--gold-soft)', color: 'var(--gold)', label: 'Due Soon' },
    overdue: { bg: 'var(--danger-soft)', color: 'var(--danger)', label: 'Overdue' },
  };
  const s = statusStyles[task.status];
  const days = daysUntil(task.nextDue);
  const dueText =
    task.status === 'overdue'
      ? `${daysAgo(task.nextDue)} days overdue`
      : days <= 7
        ? `Due in ${days} day${days !== 1 ? 's' : ''}`
        : `Due ${new Date(task.nextDue).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

  return (
    <Card
      variant="interactive"
      padding="sm"
      className={task.status === 'overdue' ? 'ring-1 ring-[var(--danger)]/20' : ''}
      onClick={onAction}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: s.bg }}
        >
          {task.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--text)] truncate">{task.title}</p>
          <p className="text-[11px] text-[var(--text-dim)]">{task.frequencyLabel}</p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[10px] font-bold block" style={{ color: s.color }}>
            {dueText}
          </span>
          <span
            className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full"
            style={{ background: s.bg, color: s.color }}
          >
            {s.label}
          </span>
        </div>
      </div>
    </Card>
  );
}

/* ================================================================
   LIBRARY PROJECT CARD
   ================================================================ */

interface LibraryProject {
  id: string;
  title: string;
  icon: React.ElementType;
  difficulty: string;
  time: string;
  diyCost: string;
  proCost: string;
  category: string;
}

const LIBRARY_PROJECTS: LibraryProject[] = [
  { id: 'lib-01', title: 'Install Smart Thermostat', icon: Thermometer, difficulty: 'Easy', time: '1-2 hrs', diyCost: '$130', proCost: '$300', category: 'smart-home' },
  { id: 'lib-02', title: 'Build Raised Garden Beds', icon: Leaf, difficulty: 'Easy', time: '3-4 hrs', diyCost: '$80', proCost: '$350', category: 'outdoor' },
  { id: 'lib-03', title: 'Install Dimmer Switch', icon: Plug, difficulty: 'Easy', time: '30 min', diyCost: '$15', proCost: '$120', category: 'easy-wins' },
  { id: 'lib-04', title: 'Upgrade Bathroom Faucets', icon: Droplets, difficulty: 'Easy', time: '1 hr', diyCost: '$60', proCost: '$200', category: 'bathroom' },
  { id: 'lib-05', title: 'Paint Accent Wall', icon: PaintBucket, difficulty: 'Easy', time: '2-3 hrs', diyCost: '$40', proCost: '$250', category: 'easy-wins' },
  { id: 'lib-06', title: 'Install Under-Cabinet Lights', icon: Sun, difficulty: 'Moderate', time: '2-3 hrs', diyCost: '$60', proCost: '$350', category: 'kitchen' },
  { id: 'lib-07', title: 'Insulate Attic Hatch', icon: Shield, difficulty: 'Easy', time: '1 hr', diyCost: '$25', proCost: '$150', category: 'energy' },
  { id: 'lib-08', title: 'Replace Door Hardware', icon: Home, difficulty: 'Easy', time: '30 min/door', diyCost: '$25/door', proCost: '$80/door', category: 'easy-wins' },
  { id: 'lib-09', title: 'Build Closet Shelves', icon: Hammer, difficulty: 'Moderate', time: '3-4 hrs', diyCost: '$70', proCost: '$400', category: 'kitchen' },
  { id: 'lib-10', title: 'Install Ceiling Fan', icon: Zap, difficulty: 'Moderate', time: '2-3 hrs', diyCost: '$120', proCost: '$300', category: 'energy' },
  { id: 'lib-11', title: 'Weatherstrip Doors & Windows', icon: Shield, difficulty: 'Easy', time: '1-2 hrs', diyCost: '$20', proCost: '$150', category: 'energy' },
  { id: 'lib-12', title: 'Install Video Doorbell', icon: Home, difficulty: 'Easy', time: '30 min', diyCost: '$100', proCost: '$200', category: 'smart-home' },
];

const LIBRARY_CATEGORIES = [
  { id: 'all', label: 'All', icon: Star },
  { id: 'easy-wins', label: 'Easy Wins', icon: Zap },
  { id: 'energy', label: 'Energy Savings', icon: Leaf },
  { id: 'smart-home', label: 'Smart Home', icon: Home },
  { id: 'outdoor', label: 'Outdoor', icon: Sun },
  { id: 'kitchen', label: 'Kitchen', icon: Hammer },
  { id: 'bathroom', label: 'Bathroom', icon: Droplets },
];

function LibraryCard({ project, onAction }: { project: LibraryProject; onAction?: () => void }) {
  const Icon = project.icon;
  return (
    <Card variant="interactive" padding="sm" onClick={onAction}>
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'var(--accent-soft)' }}
        >
          <Icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--text)] truncate">{project.title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-[var(--text-dim)]">{project.difficulty}</span>
            <span className="text-[10px] text-[var(--text-dim)]">·</span>
            <span className="text-[10px] text-[var(--text-dim)]">{project.time}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs font-bold" style={{ color: 'var(--emerald)' }}>{project.diyCost}</p>
          <p className="text-[9px] text-[var(--text-dim)]">Pro: {project.proCost}</p>
        </div>
      </div>
    </Card>
  );
}

/* ================================================================
   EMPTY STATE
   ================================================================ */

function EmptyState({ icon: Icon, message, action, onAction }: {
  icon: React.ElementType;
  message: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="text-center py-10">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
        style={{ background: 'var(--accent-soft)' }}
      >
        <Icon className="w-7 h-7" style={{ color: 'var(--accent)' }} />
      </div>
      <p className="text-sm text-[var(--text-sub)] mb-3">{message}</p>
      {action && onAction && (
        <Button onClick={onAction} size="sm">{action}</Button>
      )}
    </div>
  );
}

/* ================================================================
   MAIN COMPONENT
   ================================================================ */

interface ProjectsClientProps {
  isDemo?: boolean;
}

export function ProjectsClient({ isDemo: isDemoProp }: ProjectsClientProps) {
  const [activeTab, setActiveTab] = useState<TabId>('landing');
  const [libraryFilter, setLibraryFilter] = useState('all');

  const { isDemo: isDemoContext } = useDemo();
  const isDemo = isDemoProp ?? isDemoContext;
  const { showToast } = useUIStore();

  const { projects, isLoading: projectsLoading } = useProjects();
  const { entries: logEntries, isLoading: logLoading } = useLogbook();
  const { tasks: maintenanceTasks, isLoading: maintLoading } = useMaintenance();

  /* -- Derived data -- */
  const activeProjects = useMemo(
    () => projects.filter((p) => p.status === 'in_progress'),
    [projects]
  );
  const planningProjects = useMemo(
    () => projects.filter((p) => p.status === 'planning'),
    [projects]
  );
  const completedProjects = useMemo(
    () => projects.filter((p) => p.status === 'completed').sort(
      (a, b) => new Date(b.completed_at ?? b.updated_at).getTime() - new Date(a.completed_at ?? a.updated_at).getTime()
    ),
    [projects]
  );
  const hiredProProjects = useMemo(
    () => projects.filter((p) => p.status === 'hired_pro'),
    [projects]
  );

  const totalSavings = useMemo(
    () => completedProjects.reduce((sum, p) => sum + savingsFromProject(p), 0),
    [completedProjects]
  );
  const totalXP = useMemo(
    () => completedProjects.reduce((sum, p) => sum + p.xp_awarded, 0),
    [completedProjects]
  );

  // Demo maintenance data
  const demoMaint = DEMO_MAINTENANCE;
  const overdueMaint = demoMaint.filter((t) => t.status === 'overdue');
  const dueSoonMaint = demoMaint.filter((t) => t.status === 'due_soon');
  const onTrackMaint = demoMaint.filter((t) => t.status === 'on_track');

  // Library
  const filteredLibrary =
    libraryFilter === 'all'
      ? LIBRARY_PROJECTS
      : LIBRARY_PROJECTS.filter((p) => p.category === libraryFilter);

  const handleDemoAction = () => {
    if (isDemo) {
      showToast('Sign up to manage your projects!', 'info');
    }
  };

  const isLoading = projectsLoading || logLoading;

  /* ================================================================
     TAB NAVIGATION
     ================================================================ */

  const TabNav = () => (
    <div className="overflow-x-auto -mx-4 px-4 mb-4 no-scrollbar">
      <div
        className="inline-flex gap-1 p-1 rounded-2xl min-w-max"
        style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold transition-all duration-200 whitespace-nowrap"
              style={
                isActive
                  ? {
                      background: 'var(--accent)',
                      color: 'white',
                      boxShadow: '0 2px 8px var(--accent-glow)',
                    }
                  : { color: 'var(--text-dim)' }
              }
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  /* ================================================================
     LANDING TAB
     ================================================================ */

  const LandingTab = () => (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      {/* 1. Active Projects */}
      <motion.div variants={fadeUp}>
        <SectionHeader icon={Play} title="Active Projects" count={activeProjects.length} />
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton variant="card" className="h-[72px]" />
            <Skeleton variant="card" className="h-[72px]" />
          </div>
        ) : activeProjects.length > 0 ? (
          <div className="space-y-2">
            {activeProjects.slice(0, 3).map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                showProgress
                stepInfo="In Progress — 60% Complete"
                onClick={isDemo ? handleDemoAction : undefined}
              />
            ))}
            {activeProjects.length > 3 && (
              <button
                onClick={() => setActiveTab('active')}
                className="w-full text-[11px] font-semibold py-2 text-center"
                style={{ color: 'var(--accent)' }}
              >
                View all {activeProjects.length} active projects →
              </button>
            )}
          </div>
        ) : (
          <Card className="text-center py-6">
            <p className="text-sm text-[var(--text-sub)]">No active projects right now</p>
            <p className="text-xs text-[var(--text-dim)] mt-1">Start one from the Planner or Diagnose a problem</p>
          </Card>
        )}
      </motion.div>

      {/* 2. AI Suggested Projects */}
      <motion.div variants={fadeUp}>
        <SectionHeader
          icon={Sparkles}
          title="AI Suggested Projects"
          action="See All"
          onAction={() => setActiveTab('planner')}
        />
        <div className="space-y-2">
          {(planningProjects.length > 0 ? planningProjects.slice(0, 2) : []).map((p) => {
            const savings = savingsFromProject(p);
            return (
              <Card key={p.id} variant="interactive" padding="sm" onClick={isDemo ? handleDemoAction : undefined}>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: 'var(--accent-soft)' }}
                  >
                    {CATEGORIES.find((c) => c.id === p.category_id)?.icon ?? '🔧'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--text)] truncate">{p.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold" style={{ color: 'var(--emerald)' }}>
                        Save {formatCurrency(savings)}
                      </span>
                      <span className="text-[10px] text-[var(--text-dim)]">·</span>
                      <span className="text-[10px] text-[var(--text-dim)]">+{p.xp_awarded || 50} XP</span>
                    </div>
                  </div>
                  <Button size="sm" onClick={isDemo ? handleDemoAction : undefined}>
                    Start
                  </Button>
                </div>
              </Card>
            );
          })}
          {planningProjects.length === 0 && (
            <>
              {/* Fallback demo suggestions */}
              <Card variant="interactive" padding="sm" onClick={isDemo ? handleDemoAction : undefined}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: 'var(--accent-soft)' }}>🌡️</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--text)]">Replace HVAC Filter</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-[var(--text-dim)]">5 min</span>
                      <span className="text-[10px] text-[var(--text-dim)]">·</span>
                      <span className="text-[10px] font-bold" style={{ color: 'var(--emerald)' }}>+15 Health Score</span>
                      <span className="text-[10px] text-[var(--text-dim)]">·</span>
                      <span className="text-[10px] text-[var(--text-dim)]">+10 XP</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full" style={{ background: 'var(--emerald-soft)', color: 'var(--emerald)' }}>Tools Ready</span>
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>DIY Worth It</span>
                    </div>
                  </div>
                  <Button size="sm" onClick={isDemo ? handleDemoAction : undefined}>Start</Button>
                </div>
              </Card>
              <Card variant="interactive" padding="sm" onClick={isDemo ? handleDemoAction : undefined}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: 'var(--accent-soft)' }}>🔋</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--text)]">Test Smoke Detectors</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-[var(--text-dim)]">10 min</span>
                      <span className="text-[10px] text-[var(--text-dim)]">·</span>
                      <span className="text-[10px] font-bold" style={{ color: 'var(--emerald)' }}>+10 Health Score</span>
                      <span className="text-[10px] text-[var(--text-dim)]">·</span>
                      <span className="text-[10px] text-[var(--text-dim)]">+10 XP</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full" style={{ background: 'var(--emerald-soft)', color: 'var(--emerald)' }}>Tools Ready</span>
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full" style={{ background: 'var(--danger-soft)', color: 'var(--danger)' }}>Overdue</span>
                    </div>
                  </div>
                  <Button size="sm" onClick={isDemo ? handleDemoAction : undefined}>Start</Button>
                </div>
              </Card>
            </>
          )}
        </div>
      </motion.div>

      {/* 3. Maintenance Due Soon */}
      <motion.div variants={fadeUp}>
        <SectionHeader
          icon={Calendar}
          title="Maintenance Due Soon"
          count={overdueMaint.length + dueSoonMaint.length}
          action="View All"
          onAction={() => setActiveTab('maintenance')}
        />
        <div className="space-y-2">
          {[...overdueMaint, ...dueSoonMaint].slice(0, 3).map((task) => (
            <MaintenanceItemCard key={task.id} task={task} onAction={isDemo ? handleDemoAction : undefined} />
          ))}
        </div>
      </motion.div>

      {/* 4. Plan Bigger Projects */}
      <motion.div variants={fadeUp}>
        <SectionHeader icon={Telescope} title="Plan Bigger Projects" />
        <Card variant="interactive" padding="md" onClick={isDemo ? handleDemoAction : undefined}>
          <Link href={isDemo ? '#' : ROUTES.SCOPE} className="block">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: 'var(--accent-soft)', border: '1px solid rgba(6,156,168,0.15)' }}
              >
                <Telescope className="w-6 h-6" style={{ color: 'var(--accent)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[var(--text)]">Bathroom Vanity Replacement</p>
                <p className="text-xs text-[var(--text-dim)] mt-0.5">Upload photos for AI project scope</p>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <Button size="sm" onClick={isDemo ? handleDemoAction : undefined}>Scope</Button>
              </div>
            </div>
          </Link>
        </Card>
      </motion.div>

      {/* 5. Recently Completed */}
      <motion.div variants={fadeUp}>
        <SectionHeader
          icon={CheckCircle2}
          title="Recently Completed"
          count={completedProjects.length}
          action="View Log"
          onAction={() => setActiveTab('log')}
        />
        {completedProjects.length > 0 ? (
          <div className="space-y-2">
            {completedProjects.slice(0, 3).map((p) => (
              <ProjectCard key={p.id} project={p} onClick={isDemo ? handleDemoAction : undefined} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-6">
            <p className="text-sm text-[var(--text-sub)]">Complete your first project to see it here!</p>
          </Card>
        )}
      </motion.div>

      {/* 6. Library Picks */}
      <motion.div variants={fadeUp}>
        <SectionHeader
          icon={Library}
          title="Library Picks"
          action="Explore Library"
          onAction={() => setActiveTab('library')}
        />
        <div className="space-y-2">
          {LIBRARY_PROJECTS.slice(0, 3).map((proj) => (
            <LibraryCard key={proj.id} project={proj} onAction={isDemo ? handleDemoAction : undefined} />
          ))}
        </div>
      </motion.div>

      {/* Mascot */}
      <motion.div variants={fadeUp} className="flex items-center gap-3 pb-4">
        <Mascot size="sm" mode="checklist" animate={false} />
        <p className="text-xs text-[var(--text-dim)]">
          Your projects hub — plan, execute, and track every improvement.
        </p>
      </motion.div>
    </motion.div>
  );

  /* ================================================================
     PLANNER TAB
     ================================================================ */

  const PlannerTab = () => (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      {/* AI Suggested */}
      <motion.div variants={fadeUp}>
        <SectionHeader icon={Sparkles} title="AI Suggested Projects" count={planningProjects.length || 2} />
        {planningProjects.length > 0 ? (
          <div className="space-y-2">
            {planningProjects.map((p) => (
              <ProjectCard key={p.id} project={p} onClick={isDemo ? handleDemoAction : undefined} />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            <Card variant="interactive" padding="sm" onClick={isDemo ? handleDemoAction : undefined}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: 'var(--accent-soft)' }}>⚡</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--text)]">Ceiling Fan Installation</p>
                  <p className="text-[11px] text-[var(--text-dim)]">Based on your electrical skill level</p>
                </div>
                <Badge variant="warning">DIY Caution</Badge>
              </div>
            </Card>
          </div>
        )}
      </motion.div>

      {/* Saved Projects */}
      <motion.div variants={fadeUp}>
        <SectionHeader icon={Heart} title="Saved Projects" count={0} />
        <EmptyState
          icon={Heart}
          message="Save projects from the Library to plan later"
          action="Browse Library"
          onAction={() => setActiveTab('library')}
        />
      </motion.div>

      {/* Maintenance Opportunities */}
      <motion.div variants={fadeUp}>
        <SectionHeader icon={Wrench} title="Maintenance Opportunities" count={overdueMaint.length + dueSoonMaint.length} />
        <div className="space-y-2">
          {[...overdueMaint, ...dueSoonMaint].map((task) => (
            <MaintenanceItemCard key={task.id} task={task} onAction={isDemo ? handleDemoAction : undefined} />
          ))}
        </div>
      </motion.div>

      {/* Bigger Projects to Scope */}
      <motion.div variants={fadeUp}>
        <SectionHeader icon={Telescope} title="Bigger Projects to Scope" />
        <Card variant="interactive" padding="md">
          <Link href={isDemo ? '#' : ROUTES.SCOPE} className="flex items-center gap-3" onClick={isDemo ? handleDemoAction : undefined}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--accent-soft)' }}>
              <Telescope className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--text)]">AI Project Scope</p>
              <p className="text-[11px] text-[var(--text-dim)]">Upload photos for cost estimates and scope of work</p>
            </div>
            <ChevronRight className="w-4 h-4 shrink-0" style={{ color: 'var(--text-dim)' }} />
          </Link>
        </Card>
      </motion.div>

      {/* Quick Wins */}
      <motion.div variants={fadeUp}>
        <SectionHeader icon={Zap} title="Quick Wins" />
        <div className="space-y-2">
          {LIBRARY_PROJECTS.filter((p) => p.category === 'easy-wins').slice(0, 3).map((proj) => (
            <LibraryCard key={proj.id} project={proj} onAction={isDemo ? handleDemoAction : undefined} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );

  /* ================================================================
     ACTIVE TAB
     ================================================================ */

  const ActiveTab = () => (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      {/* Guided Repair Projects */}
      <motion.div variants={fadeUp}>
        <SectionHeader icon={Play} title="Guided Repair Projects" count={activeProjects.filter((p) => p.verdict !== 'hire_pro').length} />
        {activeProjects.filter((p) => p.verdict !== 'hire_pro').length > 0 ? (
          <div className="space-y-2">
            {activeProjects
              .filter((p) => p.verdict !== 'hire_pro')
              .map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  showProgress
                  stepInfo="Step 3 of 5 — 60% Complete"
                  onClick={isDemo ? handleDemoAction : undefined}
                />
              ))}
          </div>
        ) : (
          <EmptyState
            icon={Play}
            message="No guided repairs in progress"
            action="Start a Project"
            onAction={() => setActiveTab('planner')}
          />
        )}
      </motion.div>

      {/* DIY Projects in Progress */}
      <motion.div variants={fadeUp}>
        <SectionHeader icon={Hammer} title="DIY Projects in Progress" count={activeProjects.filter((p) => p.verdict === 'diy_easy' || p.verdict === 'diy_caution').length} />
        {activeProjects.filter((p) => p.verdict === 'diy_easy' || p.verdict === 'diy_caution').length > 0 ? (
          <div className="space-y-2">
            {activeProjects
              .filter((p) => p.verdict === 'diy_easy' || p.verdict === 'diy_caution')
              .map((p) => (
                <ProjectCard key={p.id} project={p} showProgress onClick={isDemo ? handleDemoAction : undefined} />
              ))}
          </div>
        ) : (
          <Card className="text-center py-6">
            <p className="text-sm text-[var(--text-sub)]">No DIY projects in progress</p>
          </Card>
        )}
      </motion.div>

      {/* Pro Projects in Progress */}
      <motion.div variants={fadeUp}>
        <SectionHeader icon={Shield} title="Pro Projects in Progress" count={hiredProProjects.length} />
        {hiredProProjects.length > 0 ? (
          <div className="space-y-2">
            {hiredProProjects.map((p) => (
              <ProjectCard key={p.id} project={p} onClick={isDemo ? handleDemoAction : undefined} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-6">
            <p className="text-sm text-[var(--text-sub)]">No pro projects tracked yet</p>
          </Card>
        )}
      </motion.div>

      {/* Scheduled / Upcoming */}
      <motion.div variants={fadeUp}>
        <SectionHeader icon={Calendar} title="Scheduled / Upcoming" count={planningProjects.length} />
        {planningProjects.length > 0 ? (
          <div className="space-y-2">
            {planningProjects.map((p) => (
              <ProjectCard key={p.id} project={p} onClick={isDemo ? handleDemoAction : undefined} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-6">
            <p className="text-sm text-[var(--text-sub)]">No upcoming projects scheduled</p>
          </Card>
        )}
      </motion.div>
    </motion.div>
  );

  /* ================================================================
     MAINTENANCE TAB
     ================================================================ */

  const MaintenanceTabContent = () => (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      {/* Due Soon */}
      <motion.div variants={fadeUp}>
        <SectionHeader icon={Clock} title="Due Soon" count={dueSoonMaint.length} />
        {dueSoonMaint.length > 0 ? (
          <div className="space-y-2">
            {dueSoonMaint.map((t) => (
              <MaintenanceItemCard key={t.id} task={t} onAction={isDemo ? handleDemoAction : undefined} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-6">
            <p className="text-sm text-[var(--text-sub)]">Nothing due soon — great job!</p>
          </Card>
        )}
      </motion.div>

      {/* Overdue */}
      <motion.div variants={fadeUp}>
        <SectionHeader icon={AlertTriangle} title="Overdue" count={overdueMaint.length} />
        {overdueMaint.length > 0 ? (
          <div className="space-y-2">
            {overdueMaint.map((t) => (
              <MaintenanceItemCard key={t.id} task={t} onAction={isDemo ? handleDemoAction : undefined} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-6">
            <p className="text-sm text-[var(--text-sub)]">No overdue tasks — you&apos;re on top of it! 🎉</p>
          </Card>
        )}
      </motion.div>

      {/* Seasonal Maintenance */}
      <motion.div variants={fadeUp}>
        <SectionHeader icon={Sun} title="Seasonal Maintenance" />
        <div className="space-y-2">
          {demoMaint.filter((t) => t.category === 'Exterior' || t.category === 'Landscaping').map((t) => (
            <MaintenanceItemCard key={t.id} task={t} onAction={isDemo ? handleDemoAction : undefined} />
          ))}
        </div>
      </motion.div>

      {/* System Maintenance */}
      <motion.div variants={fadeUp}>
        <SectionHeader icon={Wrench} title="System Maintenance" />
        <div className="space-y-2">
          {demoMaint.filter((t) => ['HVAC', 'Plumbing', 'Safety'].includes(t.category)).map((t) => (
            <MaintenanceItemCard key={t.id} task={t} onAction={isDemo ? handleDemoAction : undefined} />
          ))}
        </div>
      </motion.div>

      {/* Maintenance History */}
      <motion.div variants={fadeUp}>
        <SectionHeader icon={BookOpen} title="Maintenance History" />
        <Card className="text-center py-6">
          <p className="text-sm text-[var(--text-sub)]">
            {demoMaint.filter((t) => t.lastDone).length} tasks tracked
          </p>
          <p className="text-xs text-[var(--text-dim)] mt-1">
            Last completed:{' '}
            {demoMaint
              .filter((t) => t.lastDone)
              .sort((a, b) => new Date(b.lastDone!).getTime() - new Date(a.lastDone!).getTime())[0]
              ?.title ?? 'None'}
          </p>
        </Card>
      </motion.div>
    </motion.div>
  );

  /* ================================================================
     LOG TAB
     ================================================================ */

  const LogTabContent = () => (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      {/* Completed Projects */}
      <motion.div variants={fadeUp}>
        <SectionHeader icon={CheckCircle2} title="Completed Projects" count={completedProjects.length} />
        {completedProjects.length > 0 ? (
          <div className="space-y-2">
            {completedProjects.map((p) => (
              <ProjectCard key={p.id} project={p} onClick={isDemo ? handleDemoAction : undefined} />
            ))}
          </div>
        ) : (
          <EmptyState icon={CheckCircle2} message="No completed projects yet" />
        )}
      </motion.div>

      {/* Completed Maintenance */}
      <motion.div variants={fadeUp}>
        <SectionHeader icon={Wrench} title="Completed Maintenance" />
        <div className="space-y-2">
          {logEntries
            .filter((e) => e.category_id === 'hvac' || e.category_id === 'plumbing')
            .slice(0, 3)
            .map((entry) => {
              const cat = CATEGORIES.find((c) => c.id === entry.category_id);
              return (
                <Card key={entry.id} variant="interactive" padding="sm" onClick={isDemo ? handleDemoAction : undefined}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: 'var(--icon-bg)' }}>
                      {cat?.icon ?? '🔧'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text)] truncate">{entry.title}</p>
                      <p className="text-[11px] text-[var(--text-dim)]">{formatDate(entry.repair_date)}</p>
                    </div>
                    <span className="text-[10px] font-bold" style={{ color: 'var(--emerald)' }}>
                      +{entry.xp_awarded} XP
                    </span>
                  </div>
                </Card>
              );
            })}
          {logEntries.length === 0 && (
            <Card className="text-center py-6">
              <p className="text-sm text-[var(--text-sub)]">No maintenance records yet</p>
            </Card>
          )}
        </div>
      </motion.div>

      {/* DIY Savings History */}
      <motion.div variants={fadeUp}>
        <SectionHeader icon={DollarSign} title="DIY Savings History" />
        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--text-dim)]">Total DIY Savings</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--emerald)' }}>
                {formatCurrency(totalSavings)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[var(--text-dim)]">Projects</p>
              <p className="text-2xl font-bold text-[var(--text)]">{completedProjects.length}</p>
            </div>
          </div>
          {completedProjects.length > 0 && (
            <div className="mt-3 space-y-1">
              {completedProjects.slice(0, 3).map((p) => (
                <div key={p.id} className="flex items-center justify-between text-[11px]">
                  <span className="text-[var(--text-sub)] truncate">{p.title}</span>
                  <span className="font-bold shrink-0 ml-2" style={{ color: 'var(--emerald)' }}>
                    {formatCurrency(savingsFromProject(p))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>

      {/* XP Earned History */}
      <motion.div variants={fadeUp}>
        <SectionHeader icon={Star} title="XP Earned History" />
        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--text-dim)]">Total XP from Projects</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{totalXP} XP</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[var(--text-dim)]">From Logbook</p>
              <p className="text-2xl font-bold text-[var(--text)]">
                {logEntries.reduce((sum, e) => sum + e.xp_awarded, 0)} XP
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Before / After Records */}
      <motion.div variants={fadeUp}>
        <SectionHeader icon={TrendingUp} title="Before / After Records" />
        <EmptyState
          icon={TrendingUp}
          message="Complete a project with photos to see before & after comparisons"
        />
      </motion.div>
    </motion.div>
  );

  /* ================================================================
     LIBRARY TAB
     ================================================================ */

  const LibraryTabContent = () => (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
      {/* Category filter */}
      <motion.div variants={fadeUp} className="overflow-x-auto -mx-4 px-4 no-scrollbar">
        <div className="inline-flex gap-1 p-1 rounded-2xl min-w-max" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
          {LIBRARY_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setLibraryFilter(cat.id)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all duration-200 whitespace-nowrap"
                style={
                  libraryFilter === cat.id
                    ? { background: 'var(--accent)', color: 'white', boxShadow: '0 2px 8px var(--accent-glow)' }
                    : { color: 'var(--text-dim)' }
                }
              >
                <Icon className="w-3 h-3" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Project cards */}
      <motion.div variants={fadeUp}>
        <div className="space-y-2">
          {filteredLibrary.map((proj) => (
            <LibraryCard key={proj.id} project={proj} onAction={isDemo ? handleDemoAction : undefined} />
          ))}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div variants={fadeUp} className="flex gap-3">
        <Button className="flex-1" size="md" onClick={isDemo ? handleDemoAction : undefined}>
          Save to Planner
        </Button>
        <Link href={isDemo ? '#' : ROUTES.SCOPE} className="flex-1">
          <Button className="w-full" size="md" variant="secondary" onClick={isDemo ? handleDemoAction : undefined}>
            Scope Project
          </Button>
        </Link>
      </motion.div>

      {/* Mascot */}
      <motion.div variants={fadeUp} className="flex items-center gap-3 pb-4">
        <Mascot size="sm" mode="checklist" animate={false} />
        <p className="text-xs text-[var(--text-dim)]">
          Browse project ideas, check costs, and start when you&apos;re ready.
        </p>
      </motion.div>
    </motion.div>
  );

  /* ================================================================
     RENDER
     ================================================================ */

  return (
    <PageWrapper>
      {/* Tab navigation */}
      <TabNav />

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === 'landing' && <LandingTab key="landing" />}
        {activeTab === 'planner' && <PlannerTab key="planner" />}
        {activeTab === 'active' && <ActiveTab key="active" />}
        {activeTab === 'maintenance' && <MaintenanceTabContent key="maintenance" />}
        {activeTab === 'log' && <LogTabContent key="log" />}
        {activeTab === 'library' && <LibraryTabContent key="library" />}
      </AnimatePresence>
    </PageWrapper>
  );
}
