'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAdvisorStore } from '@/stores/advisorStore';
import { PhotoUpload } from './PhotoUpload';
import { CATEGORIES } from '@/lib/project-data';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { cn, formatCurrency } from '@/lib/utils';
import type { DiagnosisResult } from '@/types/app';

type Step = 'upload' | 'context' | 'analyzing' | 'results';

const EXPERIENCE_LEVELS = [
  { value: 'none', label: 'No experience', desc: 'Never done home repairs' },
  { value: 'beginner', label: 'Beginner', desc: 'A few small fixes' },
  { value: 'intermediate', label: 'Intermediate', desc: 'Comfortable with common repairs' },
  { value: 'experienced', label: 'Experienced', desc: 'Tackle most projects confidently' },
] as const;

const ANALYSIS_STEPS = [
  'Examining photo details...',
  'Identifying the issue...',
  'Researching repair methods...',
  'Estimating costs...',
  'Checking safety requirements...',
  'Preparing your diagnosis...',
] as const;

export function AIAssessmentFlow() {
  const {
    photo,
    description,
    selectedCategory,
    experienceLevel,
    homeAgeYears,
    setPhoto,
    setDescription,
    setResult,
    selectCategory,
    setExperienceLevel,
    setHomeAge,
  } = useAdvisorStore();

  const [step, setStep] = useState<Step>('upload');
  const [analysisStep, setAnalysisStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<DiagnosisResult | null>(null);

  // Animate through analysis steps
  useEffect(() => {
    if (step !== 'analyzing') return;

    const interval = setInterval(() => {
      setAnalysisStep((prev) => {
        if (prev < ANALYSIS_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [step]);

  const handleSubmitForAnalysis = useCallback(async () => {
    if (!photo || !description.trim()) return;

    setStep('analyzing');
    setAnalysisStep(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('photo', photo);
      formData.append('description', description.trim());

      if (selectedCategory) {
        formData.append('category_id', selectedCategory);
      }

      const userContext: Record<string, unknown> = {};
      if (experienceLevel) {
        userContext.experience_level = experienceLevel;
      }
      if (homeAgeYears !== null) {
        userContext.home_age_years = homeAgeYears;
      }
      if (Object.keys(userContext).length > 0) {
        formData.append('user_context', JSON.stringify(userContext));
      }

      const response = await fetch('/api/assess', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: 'Assessment failed' }));
        throw new Error(data.error ?? 'Assessment failed');
      }

      const result = await response.json();
      setAiResult(result as DiagnosisResult);
      setResult(result as DiagnosisResult);
      setStep('results');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
      setStep('upload');
    }
  }, [
    photo,
    description,
    selectedCategory,
    experienceLevel,
    homeAgeYears,
    setResult,
  ]);

  const canProceedFromUpload = photo !== null && description.trim().length > 0;

  // Step 1: Photo upload + description + optional category
  if (step === 'upload') {
    return (
      <div className="space-y-6 animate-fade">
        <div className="text-center space-y-1">
          <h2 className="font-serif text-xl font-semibold text-ink">
            AI Photo Assessment
          </h2>
          <p className="text-sm text-ink-sub">
            Upload a photo and describe the issue for an instant AI diagnosis
          </p>
        </div>

        <PhotoUpload onPhotoSelect={setPhoto} selectedPhoto={photo} />

        <div className="space-y-1.5">
          <label
            htmlFor="issue-description"
            className="block text-sm font-medium text-ink"
          >
            Describe the issue
          </label>
          <textarea
            id="issue-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. There's a crack in the drywall above my door frame that keeps getting bigger..."
            rows={3}
            maxLength={2000}
            className={cn(
              'w-full rounded-[16px] border bg-[var(--glass)] backdrop-blur-[16px] px-3.5 py-2.5 text-sm text-ink',
              'placeholder:text-ink-dim resize-none',
              'transition-all focus:outline-none focus:ring-2 focus:ring-offset-1',
              'border-[var(--glass-border)] focus:border-[var(--accent)] focus:ring-[var(--accent-glow)] shadow-[var(--card-shadow)]'
            )}
          />
          <p className="text-xs text-ink-dim text-right">
            {description.length}/2000
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-ink">
            Category (optional)
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  selectCategory(
                    selectedCategory === cat.id ? '' : cat.id
                  )
                }
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium',
                  'border transition-all tap',
                  selectedCategory === cat.id
                    ? 'border-brand bg-brand/10 text-brand'
                    : 'border-border text-ink-sub hover:border-brand/30'
                )}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <Card className="bg-danger/5 border-danger/20">
            <p className="text-sm text-danger">{error}</p>
          </Card>
        )}

        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1"
            onClick={() => setStep('context')}
            disabled={!canProceedFromUpload}
          >
            Add Details
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={handleSubmitForAnalysis}
            disabled={!canProceedFromUpload}
          >
            Analyze Now
          </Button>
        </div>
      </div>
    );
  }

  // Step 2: Optional context questions
  if (step === 'context') {
    return (
      <div className="space-y-6 animate-fade">
        <div className="text-center space-y-1">
          <h2 className="font-serif text-xl font-semibold text-ink">
            A bit about you
          </h2>
          <p className="text-sm text-ink-sub">
            Help us tailor the diagnosis to your skill level
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-ink">
            Your experience level
          </label>
          <div className="grid grid-cols-2 gap-2">
            {EXPERIENCE_LEVELS.map((level) => (
              <Card
                key={level.value}
                variant={
                  experienceLevel === level.value ? 'selected' : 'interactive'
                }
                padding="sm"
                onClick={() => setExperienceLevel(level.value)}
              >
                <p className="text-sm font-medium text-ink">{level.label}</p>
                <p className="text-xs text-ink-sub">{level.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="home-age"
            className="block text-sm font-medium text-ink"
          >
            How old is your home? (years)
          </label>
          <input
            id="home-age"
            type="number"
            min={0}
            max={200}
            value={homeAgeYears ?? ''}
            onChange={(e) => {
              const val = e.target.value;
              setHomeAge(val ? parseInt(val, 10) : null);
            }}
            placeholder="e.g. 15"
            className={cn(
              'w-full rounded-[16px] border bg-[var(--glass)] backdrop-blur-[16px] px-3.5 py-2.5 text-sm text-ink',
              'placeholder:text-ink-dim',
              'transition-all focus:outline-none focus:ring-2 focus:ring-offset-1',
              'border-[var(--glass-border)] focus:border-[var(--accent)] focus:ring-[var(--accent-glow)] shadow-[var(--card-shadow)]'
            )}
          />
        </div>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1"
            onClick={() => setStep('upload')}
          >
            Back
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={handleSubmitForAnalysis}
          >
            Analyze
          </Button>
        </div>
      </div>
    );
  }

  // Step 3: Analyzing animation
  if (step === 'analyzing') {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-8 animate-fade">
        <div className="relative">
          {/* Outer pulsing ring */}
          <div className="absolute inset-0 w-24 h-24 rounded-full bg-brand/10 animate-ping" />
          {/* Middle ring */}
          <div className="relative w-24 h-24 rounded-full bg-brand/5 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center">
              <Spinner size="lg" />
            </div>
          </div>
        </div>

        <div className="text-center space-y-3">
          <h2 className="font-serif text-xl font-semibold text-ink">
            Analyzing your photo
          </h2>
          <div className="h-12 flex items-center justify-center">
            <p
              key={analysisStep}
              className="text-sm text-ink-sub animate-fade"
            >
              {ANALYSIS_STEPS[analysisStep]}
            </p>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2">
          {ANALYSIS_STEPS.map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-500',
                i <= analysisStep ? 'bg-brand scale-100' : 'bg-border scale-75'
              )}
            />
          ))}
        </div>
      </div>
    );
  }

  // Step 4: Results
  if (step === 'results' && aiResult) {
    const verdictConfig = {
      diy_easy: {
        label: 'DIY Easy',
        color: 'text-success',
        bg: 'bg-success/10',
        border: 'border-success/20',
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        ),
      },
      diy_caution: {
        label: 'DIY with Caution',
        color: 'text-warning',
        bg: 'bg-warning/10',
        border: 'border-warning/20',
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        ),
      },
      hire_pro: {
        label: 'Hire a Pro',
        color: 'text-danger',
        bg: 'bg-danger/10',
        border: 'border-danger/20',
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        ),
      },
    } as const;

    type VerdictKey = keyof typeof verdictConfig;
    const resultVerdict: VerdictKey =
      'verdict' in aiResult
        ? ((aiResult as DiagnosisResult & { verdict?: VerdictKey }).verdict ?? 'diy_caution')
        : aiResult.conf >= 85
          ? 'diy_easy'
          : aiResult.conf >= 70
            ? 'diy_caution'
            : 'hire_pro';

    const verdict = verdictConfig[resultVerdict];
    const savings = Math.max(0, aiResult.pro.lo - aiResult.diy.lo);

    return (
      <div className="space-y-4 animate-fade">
        {/* Verdict Banner */}
        <Card className={cn(verdict.bg, verdict.border, 'border')}>
          <div className="flex items-center gap-3">
            <div className={verdict.color}>{verdict.icon}</div>
            <div className="flex-1">
              <h2 className="font-serif text-lg font-semibold text-ink">
                {aiResult.title}
              </h2>
              <p className={cn('text-sm font-medium', verdict.color)}>
                {verdict.label} &middot; Confidence: {aiResult.conf}%
              </p>
            </div>
          </div>
        </Card>

        {/* Why */}
        <Card>
          <p className="text-sm text-ink-sub">{aiResult.why}</p>
        </Card>

        {/* Flags */}
        {aiResult.flags.length > 0 && (
          <div className="bg-warning/5 border border-warning/20 rounded-[20px] p-3 space-y-1 shadow-[var(--card-shadow)]">
            {aiResult.flags.map((flag, i) => (
              <p key={i} className="text-sm text-warning font-medium">
                {flag}
              </p>
            ))}
          </div>
        )}

        {/* Cost Comparison */}
        <Card>
          <h3 className="font-serif text-base font-semibold mb-3">
            Cost Comparison
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-success font-medium">DIY</span>
              <span className="font-mono text-sm">
                {formatCurrency(aiResult.diy.lo)} – {formatCurrency(aiResult.diy.hi)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-info font-medium">Hire Pro</span>
              <span className="font-mono text-sm">
                {formatCurrency(aiResult.pro.lo)} – {formatCurrency(aiResult.pro.hi)}
              </span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between items-center">
              <span className="text-sm text-brand font-semibold">
                Potential Savings
              </span>
              <span className="font-mono text-sm font-semibold text-brand">
                {formatCurrency(savings)}
              </span>
            </div>
          </div>
        </Card>

        {/* Time & Difficulty */}
        <div className="grid grid-cols-2 gap-3">
          <Card padding="sm">
            <p className="text-xs text-ink-sub">Estimated Time</p>
            <p className="text-sm font-semibold text-ink">{aiResult.diy.time}</p>
          </Card>
          <Card padding="sm">
            <p className="text-xs text-ink-sub">Difficulty</p>
            <p className="text-sm font-semibold text-ink capitalize">
              {aiResult.diy.risk}
            </p>
          </Card>
        </div>

        {/* Steps */}
        {aiResult.steps.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-serif text-base font-semibold text-ink">
              Repair Steps
            </h3>
            {aiResult.steps.map((s, i) => (
              <Card key={i} padding="sm">
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] text-sm font-bold flex items-center justify-center shrink-0 shadow-[0_0_8px_var(--accent-glow)]">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink">{s.s}</p>
                    <p className="text-xs text-ink-dim mt-0.5">{s.t}</p>
                    {s.tip && (
                      <p className="text-xs text-warning mt-1">
                        Safety: {s.tip}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Tools Needed */}
        {aiResult.tools.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-serif text-base font-semibold text-ink">
              Tools Needed
            </h3>
            <div className="flex flex-wrap gap-2">
              {aiResult.tools.map((tool, i) => (
                <div
                  key={i}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs',
                    'border',
                    tool.r === 'Essential'
                      ? 'border-brand/30 bg-brand/5 text-brand font-medium'
                      : 'border-border text-ink-sub'
                  )}
                >
                  <span>{tool.e === 'Essential' ? 'Required' : 'Optional'}:</span>
                  <span>{tool.n}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Materials */}
        {aiResult.shop.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-serif text-base font-semibold text-ink">
              Materials
            </h3>
            {aiResult.shop.map((item, i) => (
              <Card key={i} padding="sm">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{item.n}</p>
                    <p className="text-xs text-ink-dim">{item.store}</p>
                  </div>
                  <p className="font-mono text-sm">
                    ${(item.pr / 100).toFixed(0)}
                  </p>
                </div>
              </Card>
            ))}
            {aiResult.matEst > 0 && (
              <Card className="bg-brand/5">
                <p className="text-sm font-semibold text-brand">
                  Est. Materials Total: ${(aiResult.matEst / 100).toFixed(0)}
                </p>
              </Card>
            )}
          </div>
        )}

        {/* Pro Script */}
        {aiResult.pro.script && (
          <Card>
            <h3 className="font-serif text-base font-semibold mb-2">
              What to Tell a Contractor
            </h3>
            <p className="text-sm text-ink-sub whitespace-pre-line">
              {aiResult.pro.script}
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-3"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(aiResult.pro.script);
                } catch {
                  // Fallback for browsers without clipboard API
                  const textArea = document.createElement('textarea');
                  textArea.value = aiResult.pro.script;
                  textArea.style.position = 'fixed';
                  textArea.style.opacity = '0';
                  document.body.appendChild(textArea);
                  textArea.select();
                  document.execCommand('copy');
                  document.body.removeChild(textArea);
                }
              }}
            >
              Copy Script
            </Button>
          </Card>
        )}

        {/* Pro Quote CTA */}
        <Card
          className="border-brand/20"
          style={{ background: 'linear-gradient(135deg, var(--accent-soft), var(--glass))' }}
        >
          <p className="text-sm font-semibold text-ink mb-1">Rather have a pro handle this?</p>
          <p className="text-xs text-ink-sub mb-3">
            Save this project and request quotes from verified local contractors.
          </p>
          <Button
            size="sm"
            onClick={() => {
              // Navigate to project page hire-pro tab if project was saved
              const projectId = (aiResult as DiagnosisResult & { project_id?: string }).project_id;
              if (projectId) {
                window.location.href = `/project/${projectId}#hire-pro`;
              }
            }}
          >
            Get Pro Quotes
          </Button>
        </Card>

        {/* Start Over */}
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={() => {
            setStep('upload');
            setAiResult(null);
          }}
        >
          Assess Another Issue
        </Button>
      </div>
    );
  }

  return null;
}
