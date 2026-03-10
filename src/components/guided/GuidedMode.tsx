'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useGuidedStore } from '@/stores/guidedStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Mascot } from '@/components/brand/Mascot';

export function GuidedMode() {
  const {
    isActive, projectTitle, steps, currentStep, completedSteps,
    stepPhotos, stepFeedback, startedAt,
    nextStep, prevStep, completeStep, uploadStepPhoto,
    setStepFeedback, exitGuidedMode,
  } = useGuidedStore();

  const [viewedAt, setViewedAt] = useState<number>(Date.now());
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const step = steps[currentStep];
  const isCompleted = completedSteps.has(currentStep);
  const hasPhoto = stepPhotos.has(currentStep);
  const feedback = stepFeedback.get(currentStep);
  const progress = steps.length > 0 ? (completedSteps.size / steps.length) * 100 : 0;
  const allDone = completedSteps.size === steps.length;
  const timeViewed = Date.now() - viewedAt;
  const canComplete = isCompleted || hasPhoto || timeViewed > 5000;

  useEffect(() => {
    setViewedAt(Date.now());
  }, [currentStep]);

  const handlePhotoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const url = URL.createObjectURL(file);
    uploadStepPhoto(currentStep, url);
    setIsUploading(false);
    setIsAnalyzing(true);
    // Simulate AI check (will be replaced with real API)
    await new Promise(r => setTimeout(r, 1500));
    const messages = [
      'Looking good! This step appears to be done correctly.',
      'Great work! The alignment looks solid.',
      'Nice job! Ready to move to the next step.',
      'Excellent! Everything checks out.',
    ];
    setStepFeedback(currentStep, {
      status: 'pass',
      message: messages[Math.floor(Math.random() * messages.length)],
    });
    setIsAnalyzing(false);
  }, [currentStep, uploadStepPhoto, setStepFeedback]);

  const handleCompleteStep = useCallback(() => {
    completeStep(currentStep);
    if (currentStep < steps.length - 1) {
      setTimeout(() => nextStep(), 400);
    } else {
      setShowCompletion(true);
    }
  }, [currentStep, steps.length, completeStep, nextStep]);

  if (!isActive || !step) return null;

  if (showCompletion || allDone) {
    const elapsed = startedAt ? Math.round((Date.now() - startedAt) / 60000) : 0;
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface-base p-6 text-center">
        <div className="animate-pop">
          <Mascot size="xl" mode="celebrate" />
        </div>
        <h1 className="mt-6 text-3xl font-serif font-bold text-ink">Project Complete!</h1>
        <p className="mt-2 text-ink-sub">{projectTitle}</p>
        <div className="mt-6 grid grid-cols-3 gap-4">
          <Card className="glass glass-sm shadow-[var(--card-shadow)] text-center">
            <p className="text-2xl font-bold text-brand">{steps.length}</p>
            <p className="text-xs text-ink-dim">Steps Done</p>
          </Card>
          <Card className="glass glass-sm shadow-[var(--card-shadow)] text-center">
            <p className="text-2xl font-bold text-success">{elapsed}m</p>
            <p className="text-xs text-ink-dim">Time</p>
          </Card>
          <Card className="glass glass-sm shadow-[var(--card-shadow)] text-center">
            <p className="text-2xl font-bold text-warning">{stepPhotos.size}</p>
            <p className="text-xs text-ink-dim">Photos</p>
          </Card>
        </div>
        <p className="mt-4 text-lg font-semibold gradient-text">+50 XP Earned!</p>
        <div className="mt-8 flex flex-col gap-3 w-full max-w-xs">
          <Button onClick={exitGuidedMode} className="w-full">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-surface-base">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-safe-top py-3 glass border-b border-border">
        <button onClick={exitGuidedMode} className="text-sm text-ink-sub pressable">
          Exit
        </button>
        <div className="text-center">
          <p className="text-xs text-ink-dim">Guided Mode</p>
          <p className="text-sm font-semibold text-ink">{projectTitle}</p>
        </div>
        <div className="text-sm text-brand font-semibold">
          {currentStep + 1}/{steps.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-surface-3">
        <div
          className="h-full rounded-r transition-all duration-500"
          style={{ width: `${progress}%`, background: 'var(--accent-gradient)' }}
        />
      </div>

      {/* Step dots */}
      <div className="flex items-center justify-center gap-2 py-3 px-4">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => useGuidedStore.getState().goToStep(i)}
            className={`w-3 h-3 rounded-full transition-all pressable ${
              i === currentStep
                ? 'bg-brand scale-125'
                : completedSteps.has(i)
                ? 'bg-success'
                : 'bg-surface-3'
            }`}
          />
        ))}
      </div>

      {/* Step content — scrollable */}
      <div className="flex-1 overflow-y-auto px-4 pb-32">
        <div className="animate-rise">
          {/* Step number + title */}
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-[20px] gradient-accent flex items-center justify-center">
              <span className="text-xl font-bold text-white">{currentStep + 1}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-serif font-bold text-ink">{step.s}</h2>
              <p className="text-sm text-ink-sub mt-1">{step.t}</p>
            </div>
          </div>

          {/* Tip */}
          {step.tip && (
            <Card className="glass glass-sm shadow-[var(--card-shadow)] mb-4">
              <div className="flex gap-2">
                <Mascot size="sm" mode="diagnostic" animate={false} />
                <div>
                  <p className="text-xs font-semibold text-brand mb-1">Pro Tip</p>
                  <p className="text-sm text-ink-sub">{step.tip}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Photo check-in */}
          {step.photo && (
            <Card className="glass glass-sm shadow-[var(--card-shadow)] mb-4">
              <p className="text-sm font-semibold text-ink mb-2">Check My Work</p>
              {hasPhoto ? (
                <div className="space-y-3">
                  <img
                    src={stepPhotos.get(currentStep)}
                    alt="Step photo"
                    className="w-full h-48 object-cover rounded-[20px] border border-border"
                  />
                  {isAnalyzing && (
                    <div className="flex items-center gap-2 text-sm text-ink-sub">
                      <span className="inline-block w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                      Analyzing your work...
                    </div>
                  )}
                  {feedback && (
                    <div className={`flex items-start gap-2 p-3 rounded-[20px] ${
                      feedback.status === 'pass' ? 'bg-success-soft' :
                      feedback.status === 'caution' ? 'bg-warning-soft' : 'bg-danger-soft'
                    }`}>
                      <span className="text-lg">
                        {feedback.status === 'pass' ? '\u2705' : feedback.status === 'caution' ? '\u26A0\uFE0F' : '\u274C'}
                      </span>
                      <p className="text-sm text-ink">{feedback.message}</p>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full h-32 rounded-[20px] border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 pressable hover:border-brand transition-colors"
                >
                  <span className="text-3xl">{'\u{1F4F7}'}</span>
                  <span className="text-sm text-ink-sub">
                    {isUploading ? 'Uploading...' : 'Tap to take a photo'}
                  </span>
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </Card>
          )}
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-border p-4 pb-safe-bottom">
        <div className="flex items-center gap-3">
          {currentStep > 0 && (
            <Button variant="ghost" onClick={prevStep} className="flex-shrink-0">
              Back
            </Button>
          )}
          <Button
            onClick={handleCompleteStep}
            disabled={!canComplete && step.photo}
            className="flex-1"
          >
            {isCompleted ? 'Completed \u2713' :
             currentStep === steps.length - 1 ? 'Finish Project' : 'Mark Done & Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}
