'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { CategoryGrid } from '@/components/features/advisor/CategoryGrid';
import { Spinner } from '@/components/ui/Spinner';
import { TOOLS } from '@/lib/constants';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';

const SUGGESTED_TOOLS = TOOLS.slice(0, 5);

export default function OnboardingPage() {
  const router = useRouter();
  const { showToast } = useUIStore();
  const [step, setStep] = useState(0);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [completing, setCompleting] = useState(false);

  const toggleTool = (id: string) => {
    setSelectedTools((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const completeOnboarding = async (categoryId?: string) => {
    if (completing) return;
    setCompleting(true);

    try {
      // Mark onboarding as complete
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onboarding_completed: true }),
      });

      if (!res.ok) throw new Error('Failed to complete onboarding');

      // Add selected tools in parallel
      if (selectedTools.length > 0) {
        await Promise.all(
          selectedTools.map((toolId) => {
            const tool = TOOLS.find((t) => t.id === toolId);
            if (!tool) return Promise.resolve();
            return fetch('/api/toolbox', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ tool_id: tool.id, tool_name: tool.name, category: tool.category }),
            });
          })
        );
      }

      // Navigate to project or dashboard
      if (categoryId) {
        router.push(`/project/new?category=${categoryId}`);
      } else {
        router.push('/dashboard');
      }
      router.refresh();
    } catch {
      setCompleting(false);
      showToast('Something went wrong. Please try again.', 'error');
    }
  };

  return (
    <PageWrapper>
      <div className="flex justify-center gap-2 mb-8" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={3}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              'w-3 h-3 rounded-full transition-colors',
              i === step ? 'bg-brand' : i < step ? 'bg-brand/50' : 'bg-border'
            )}
          />
        ))}
      </div>

      {step === 0 && (
        <Card padding="lg" className="text-center animate-rise">
          <span className="text-5xl">🏠</span>
          <h2 className="font-serif text-2xl mt-4 mb-3">Welcome to HomeProjectIQ</h2>
          <ul className="text-sm text-ink-sub space-y-2 text-left mb-6">
            <li>• Get instant DIY-or-Pro verdicts for any repair</li>
            <li>• Step-by-step guides with exact tools and materials</li>
            <li>• Track your projects and level up your skills</li>
          </ul>
          <Button onClick={() => setStep(1)} className="w-full">
            Let&apos;s Go
          </Button>
        </Card>
      )}

      {step === 1 && (
        <div className="space-y-4 animate-rise">
          <h2 className="font-serif text-xl text-center">What tools do you own?</h2>
          <p className="text-sm text-ink-sub text-center">Select any you have at home.</p>
          <div className="space-y-2">
            {SUGGESTED_TOOLS.map((tool) => (
              <button
                key={tool.id}
                onClick={() => toggleTool(tool.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg border tap',
                  selectedTools.includes(tool.id) ? 'border-brand bg-brand-light' : 'border-border bg-white'
                )}
              >
                <span className="text-xl">{tool.emoji}</span>
                <span className="text-sm font-medium">{tool.name}</span>
                {selectedTools.includes(tool.id) && <span className="ml-auto text-brand">✓</span>}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setStep(2)} className="flex-1">
              Skip for now
            </Button>
            <Button onClick={() => setStep(2)} className="flex-1">
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 animate-rise">
          <h2 className="font-serif text-xl text-center">Try your first project</h2>
          <p className="text-sm text-ink-sub text-center">Pick a category to get started.</p>
          {completing ? (
            <div className="flex items-center justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : (
            <CategoryGrid onClick={(id) => completeOnboarding(id)} />
          )}
        </div>
      )}
    </PageWrapper>
  );
}
