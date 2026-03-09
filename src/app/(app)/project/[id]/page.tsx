'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DIAGNOSES, CATEGORIES } from '@/lib/project-data';
import { Navbar } from '@/components/layout/Navbar';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { DiagnosisView } from '@/components/features/advisor/DiagnosisView';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { useUIStore } from '@/stores/uiStore';
import { useAdvisorStore } from '@/stores/advisorStore';
import { ShareButton } from '@/components/share/ShareButton';
import { ShareButton as QuickShareButton } from '@/components/features/project/ShareButton';
import { OutcomeComparison } from '@/components/features/project/OutcomeComparison';
import { OutcomeReportForm } from '@/components/outcome/OutcomeReportForm';
import type { DiagnosisResult, Project } from '@/types/app';

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useUIStore();
  const { reset, diagnosisResult: storeResult } = useAdvisorStore();
  const [project, setProject] = useState<{
    category_id: string;
    title: string;
    verdict?: string;
    outcome_submitted_at?: string | null;
    outcome_actual_cost?: number | null;
    outcome_actual_hours?: number | null;
    outcome_difficulty?: 'easier' | 'as_expected' | 'harder' | null;
    estimated_diy_lo?: number | null;
    estimated_diy_hi?: number | null;
  } | null>(null);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showComplete, setShowComplete] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [showOutcome, setShowOutcome] = useState(false);

  useEffect(() => {
    if (id === 'new') {
      // Check if we have a result from the advisor store (AI assessment)
      if (storeResult) {
        setDiagnosis(storeResult);
        setProject({ category_id: 'general', title: storeResult.title });
        setLoading(false);
        return;
      }

      // Fall back to category-based static diagnosis
      const params = new URLSearchParams(window.location.search);
      const categoryId = params.get('category');
      if (categoryId && DIAGNOSES[categoryId]) {
        setDiagnosis(DIAGNOSES[categoryId]);
        setProject({ category_id: categoryId, title: DIAGNOSES[categoryId].title });
      }
      setLoading(false);
      return;
    }

    // Load saved project from API
    fetch('/api/analyze')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load projects');
        return r.json();
      })
      .then((json) => {
        const projects: Project[] = json.data ?? json;
        const found = projects.find((p) => p.id === id);
        if (found) {
          setProject({
            category_id: found.category_id,
            title: found.title,
            verdict: found.verdict,
            outcome_submitted_at: found.outcome_submitted_at,
            outcome_actual_cost: found.outcome_actual_cost,
            outcome_actual_hours: found.outcome_actual_hours,
            outcome_difficulty: found.outcome_difficulty,
            estimated_diy_lo: found.estimated_diy_lo,
            estimated_diy_hi: found.estimated_diy_hi,
          });
          // Try to find matching static diagnosis for category
          const staticDiag = DIAGNOSES[found.category_id];
          if (staticDiag) {
            setDiagnosis({
              ...staticDiag,
              title: found.title,
              conf: found.confidence,
            });
          } else {
            // Build a minimal diagnosis from project data
            const category = CATEGORIES.find((c) => c.id === found.category_id);
            setDiagnosis({
              title: found.title,
              conf: found.confidence,
              xp: found.xp_awarded,
              save: (found.estimated_pro_lo ?? 0) - (found.estimated_diy_lo ?? 0),
              why: `Assessment for ${category?.label ?? found.category_id}`,
              flags: [],
              fq: [],
              diy: {
                lo: found.estimated_diy_lo ?? 0,
                hi: found.estimated_diy_hi ?? 0,
                hrs: 0,
                time: 'Varies',
                risk: 'See assessment details',
              },
              pro: {
                lo: found.estimated_pro_lo ?? 0,
                hi: found.estimated_pro_hi ?? 0,
                time: 'Varies',
                risk: 'Professional quality',
                note: '',
                script: '',
              },
              tl: [],
              tools: [],
              steps: [],
              shop: [],
              matEst: 0,
            });
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, storeResult]);

  const handleComplete = async () => {
    setCompleting(true);
    try {
      if (project) {
        const res = await fetch('/api/logbook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: project.title,
            category_id: project.category_id,
            repair_date: new Date().toISOString().split('T')[0],
            labor_type: 'diy',
          }),
        });
        if (!res.ok) throw new Error('Failed to complete');
      }
      showToast(`+${15} XP! Entry logged.`, 'success');
      setShowComplete(false);
      router.push('/dashboard');
    } catch {
      showToast('Failed to complete project', 'error');
    }
    setCompleting(false);
  };

  const handleStartOver = () => {
    reset();
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!diagnosis) {
    return (
      <>
        <Navbar title="Project" showBack backHref="/dashboard" />
        <PageWrapper>
          <div className="text-center py-12">
            <p className="text-ink-sub">Project not found</p>
            <Button variant="ghost" onClick={() => router.push('/dashboard')} className="mt-4">
              Back to Dashboard
            </Button>
          </div>
        </PageWrapper>
      </>
    );
  }

  return (
    <>
      <Navbar title={diagnosis.title} showBack backHref="/dashboard" />
      <PageWrapper>
        <DiagnosisView result={diagnosis} />
        {id !== 'new' && (
          <div className="mt-4">
            <ShareButton
              projectId={id}
              title={diagnosis.title}
              confidence={diagnosis.conf}
              verdict={diagnosis.conf >= 85 ? 'diy_easy' : diagnosis.conf >= 70 ? 'diy_caution' : 'hire_pro'}
              savings={diagnosis.save ?? 0}
            />
          </div>
        )}
        {id !== 'new' && project?.outcome_submitted_at && (
          <div className="mt-4">
            <OutcomeComparison
              estimatedCostLo={project.estimated_diy_lo ?? diagnosis.diy.lo}
              estimatedCostHi={project.estimated_diy_hi ?? diagnosis.diy.hi}
              actualCost={project.outcome_actual_cost}
              estimatedTime={diagnosis.diy.time}
              actualHours={project.outcome_actual_hours}
              difficulty={project.outcome_difficulty}
            />
          </div>
        )}
        {id !== 'new' && !project?.outcome_submitted_at && (
          <div className="mt-4">
            {showOutcome ? (
              <OutcomeReportForm
                projectId={id}
                onSubmit={() => {
                  setShowOutcome(false);
                  setProject((p) => p ? { ...p, outcome_submitted_at: new Date().toISOString() } : p);
                  showToast('+20 XP! Outcome recorded.', 'success');
                }}
                onCancel={() => setShowOutcome(false)}
              />
            ) : (
              <Button variant="secondary" onClick={() => setShowOutcome(true)} className="w-full">
                How Did It Go? (+20 XP)
              </Button>
            )}
          </div>
        )}
        <div className="flex gap-3 mt-4 pb-4">
          <Button variant="secondary" onClick={handleStartOver} className="flex-1">
            Start Over
          </Button>
          {id !== 'new' && (
            <QuickShareButton
              projectId={id}
              title={diagnosis.title}
              verdict={diagnosis.conf >= 85 ? 'DIY Easy' : diagnosis.conf >= 70 ? 'DIY with Caution' : 'Hire a Pro'}
            />
          )}
          <Button onClick={() => setShowComplete(true)} className="flex-1">
            Mark Complete
          </Button>
        </div>
      </PageWrapper>

      <Modal
        isOpen={showComplete}
        onClose={() => setShowComplete(false)}
        title="Complete Project?"
        footer={
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setShowComplete(false)}>Cancel</Button>
            <Button loading={completing} onClick={handleComplete}>Complete & Earn XP</Button>
          </div>
        }
      >
        <p className="text-sm text-ink-sub">
          This will log the project in your logbook and award you 15 XP. Ready?
        </p>
      </Modal>
    </>
  );
}
