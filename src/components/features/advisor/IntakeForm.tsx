'use client';

import { DIAGNOSES } from '@/lib/project-data';
import { useAdvisorStore } from '@/stores/advisorStore';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { cn } from '@/lib/utils';

interface IntakeFormProps {
  categoryId: string;
  onComplete: (answers: Record<string, string>) => void;
}

export function IntakeForm({ categoryId, onComplete }: IntakeFormProps) {
  const { currentStep, intakeAnswers, setAnswer, nextStep, prevStep } = useAdvisorStore();
  const diagnosis = DIAGNOSES[categoryId];
  if (!diagnosis) return null;

  const questions = diagnosis.fq;
  const question = questions[currentStep];
  const totalSteps = questions.length;

  const handleSelect = (opt: string) => {
    setAnswer(`q${currentStep}`, opt);
    if (currentStep < totalSteps - 1) {
      nextStep();
    } else {
      onComplete({ ...intakeAnswers, [`q${currentStep}`]: opt });
    }
  };

  return (
    <div className="space-y-6 animate-fade">
      <Progress value={((currentStep + 1) / totalSteps) * 100} />
      <p className="text-xs text-ink-sub">
        Question {currentStep + 1} of {totalSteps}
      </p>
      <h2 className="font-serif text-xl text-ink">{question.q}</h2>
      <div className="space-y-3">
        {question.opts.map((opt) => (
          <button
            key={opt}
            onClick={() => handleSelect(opt)}
            className={cn(
              'w-full text-left px-4 py-3 rounded-lg border transition-all tap',
              intakeAnswers[`q${currentStep}`] === opt
                ? 'border-brand bg-brand-light text-brand font-semibold'
                : 'border-border bg-white text-ink hover:border-brand/40'
            )}
          >
            {opt}
          </button>
        ))}
      </div>
      {currentStep > 0 && (
        <Button variant="ghost" size="sm" onClick={prevStep}>
          &larr; Back
        </Button>
      )}
    </div>
  );
}
