'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { useOutcome } from '@/hooks/useOutcome';

const outcomeFormSchema = z.object({
  outcome_status: z.enum(['success', 'partial', 'failed']),
  outcome_actual_cost: z
    .number()
    .nonnegative('Cost must be zero or positive')
    .optional()
    .nullable(),
  outcome_actual_hours: z
    .number()
    .nonnegative('Hours must be zero or positive')
    .optional()
    .nullable(),
  outcome_difficulty: z
    .enum(['easier', 'as_expected', 'harder'])
    .optional()
    .nullable(),
  outcome_complications: z.string().max(2000).optional().nullable(),
  outcome_would_diy_again: z.boolean().optional().nullable(),
});

type OutcomeFormValues = z.infer<typeof outcomeFormSchema>;

interface OutcomeReportFormProps {
  projectId: string;
  onSubmit?: () => void;
  onCancel?: () => void;
}

const STATUS_OPTIONS = [
  {
    value: 'success' as const,
    label: 'Success',
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    color: 'text-success',
    bgColor: 'bg-success-light',
    borderColor: 'border-success',
    description: 'Completed as planned',
  },
  {
    value: 'partial' as const,
    label: 'Partial',
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
    ),
    color: 'text-warning',
    bgColor: 'bg-warning-light',
    borderColor: 'border-warning',
    description: 'Got it done, with issues',
  },
  {
    value: 'failed' as const,
    label: 'Failed',
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    color: 'text-danger',
    bgColor: 'bg-danger-light',
    borderColor: 'border-danger',
    description: 'Had to call a pro',
  },
] as const;

const DIFFICULTY_OPTIONS = [
  { value: 'easier' as const, label: 'Easier than expected' },
  { value: 'as_expected' as const, label: 'About right' },
  { value: 'harder' as const, label: 'Harder than expected' },
] as const;

const TOTAL_STEPS = 3;

export function OutcomeReportForm({
  projectId,
  onSubmit: onSubmitCallback,
  onCancel,
}: OutcomeReportFormProps) {
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const { submitOutcome, isSubmitting, data: outcomeData } = useOutcome(projectId);

  const form = useForm<OutcomeFormValues>({
    resolver: zodResolver(outcomeFormSchema),
    defaultValues: {
      outcome_status: undefined,
      outcome_actual_cost: null,
      outcome_actual_hours: null,
      outcome_difficulty: null,
      outcome_complications: null,
      outcome_would_diy_again: null,
    },
  });

  const {
    setValue,
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const selectedStatus = watch('outcome_status');
  const selectedDifficulty = watch('outcome_difficulty');
  const wouldDiyAgain = watch('outcome_would_diy_again');

  const goNext = useCallback(() => {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    }
  }, [step]);

  const goBack = useCallback(() => {
    if (step > 1) {
      setStep((s) => s - 1);
    }
  }, [step]);

  const onFormSubmit = async (values: OutcomeFormValues) => {
    try {
      await submitOutcome({
        outcome_status: values.outcome_status,
        outcome_actual_cost: values.outcome_actual_cost,
        outcome_actual_hours: values.outcome_actual_hours,
        outcome_difficulty: values.outcome_difficulty,
        outcome_complications: values.outcome_complications,
        outcome_would_diy_again: values.outcome_would_diy_again,
      });
      setShowSuccess(true);
      setTimeout(() => {
        onSubmitCallback?.();
      }, 2000);
    } catch {
      // Error is handled by the mutation state
    }
  };

  // Success state
  if (showSuccess) {
    return (
      <Card padding="lg" className="text-center animate-pop">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-success-light flex items-center justify-center animate-pop">
            <svg
              className="w-10 h-10 text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-ink">Outcome Submitted!</h3>
          <p className="text-sm text-ink-sub">
            Thanks for sharing. Your feedback makes the AI smarter for everyone.
          </p>
          {outcomeData && outcomeData.xp_awarded > 0 && (
            <div className="relative">
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-brand-light text-brand font-semibold text-sm animate-rise">
                +{outcomeData.xp_awarded} XP earned
              </span>
            </div>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card padding="lg">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-ink-sub">
            Step {step} of {TOTAL_STEPS}
          </span>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-sm text-ink-dim hover:text-ink-sub transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
        <div className="h-1.5 bg-surface-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-brand rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        {/* Step 1: How did it go? */}
        <div
          className={cn(
            'transition-all duration-300',
            step === 1
              ? 'opacity-100 translate-x-0'
              : 'hidden'
          )}
        >
          <h3 className="text-lg font-semibold text-ink mb-1">
            How did it go?
          </h3>
          <p className="text-sm text-ink-sub mb-4">
            Select the outcome that best describes your experience.
          </p>

          <div className="grid grid-cols-3 gap-3">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setValue('outcome_status', option.value, {
                    shouldValidate: true,
                  });
                }}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                  'hover:shadow-md pressable',
                  selectedStatus === option.value
                    ? `${option.bgColor} ${option.borderColor} ${option.color} shadow-sm`
                    : 'border-border bg-white text-ink-sub hover:border-border-focus'
                )}
              >
                <div className={selectedStatus === option.value ? option.color : 'text-ink-dim'}>
                  {option.icon}
                </div>
                <span className="text-sm font-semibold">{option.label}</span>
                <span className="text-xs text-ink-dim leading-tight text-center">
                  {option.description}
                </span>
              </button>
            ))}
          </div>

          {errors.outcome_status && (
            <p className="text-xs text-danger mt-2">
              Please select an outcome status
            </p>
          )}

          <div className="flex justify-end mt-6">
            <Button
              type="button"
              onClick={goNext}
              disabled={!selectedStatus}
              size="md"
            >
              Next
            </Button>
          </div>
        </div>

        {/* Step 2: Details */}
        <div
          className={cn(
            'transition-all duration-300',
            step === 2
              ? 'opacity-100 translate-x-0'
              : 'hidden'
          )}
        >
          <h3 className="text-lg font-semibold text-ink mb-1">
            Project Details
          </h3>
          <p className="text-sm text-ink-sub mb-4">
            Help us improve estimates for future projects.
          </p>

          <div className="space-y-4">
            <Input
              label="Actual Cost ($)"
              type="number"
              min={0}
              step={0.01}
              placeholder="0.00"
              error={errors.outcome_actual_cost?.message}
              {...register('outcome_actual_cost', {
                setValueAs: (v: string) =>
                  v === '' || v === undefined ? null : parseFloat(v),
              })}
            />

            <Input
              label="Actual Time (hours)"
              type="number"
              min={0}
              step={0.5}
              placeholder="0"
              error={errors.outcome_actual_hours?.message}
              {...register('outcome_actual_hours', {
                setValueAs: (v: string) =>
                  v === '' || v === undefined ? null : parseFloat(v),
              })}
            />

            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Difficulty Rating
              </label>
              <div className="grid grid-cols-3 gap-2">
                {DIFFICULTY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setValue('outcome_difficulty', option.value, {
                        shouldValidate: true,
                      })
                    }
                    className={cn(
                      'px-3 py-2.5 rounded-lg border text-sm font-medium transition-all',
                      'hover:shadow-sm pressable',
                      selectedDifficulty === option.value
                        ? 'border-brand bg-brand-light text-brand'
                        : 'border-border bg-white text-ink-sub hover:border-border-focus'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button type="button" variant="ghost" onClick={goBack} size="md">
              Back
            </Button>
            <Button type="button" onClick={goNext} size="md">
              Next
            </Button>
          </div>
        </div>

        {/* Step 3: Reflection */}
        <div
          className={cn(
            'transition-all duration-300',
            step === 3
              ? 'opacity-100 translate-x-0'
              : 'hidden'
          )}
        >
          <h3 className="text-lg font-semibold text-ink mb-1">
            Reflection
          </h3>
          <p className="text-sm text-ink-sub mb-4">
            Your insights help other homeowners make better decisions.
          </p>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="outcome_complications"
                className="block text-sm font-medium text-ink mb-1.5"
              >
                Any complications or surprises?
              </label>
              <textarea
                id="outcome_complications"
                rows={3}
                maxLength={2000}
                placeholder="Describe any unexpected issues, tips you learned, or things you'd do differently..."
                className={cn(
                  'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink',
                  'placeholder:text-ink-dim transition-colors resize-none',
                  'focus:outline-none focus:ring-2 focus:ring-offset-1',
                  errors.outcome_complications
                    ? 'border-danger focus:ring-danger/30'
                    : 'border-border focus:border-border-focus focus:ring-brand/20'
                )}
                {...register('outcome_complications')}
              />
              {errors.outcome_complications && (
                <p className="text-xs text-danger mt-1">
                  {errors.outcome_complications.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Would you DIY this again?
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setValue('outcome_would_diy_again', true, {
                      shouldValidate: true,
                    })
                  }
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-all',
                    'hover:shadow-sm pressable',
                    wouldDiyAgain === true
                      ? 'border-success bg-success-light text-success'
                      : 'border-border bg-white text-ink-sub hover:border-border-focus'
                  )}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    />
                  </svg>
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setValue('outcome_would_diy_again', false, {
                      shouldValidate: true,
                    })
                  }
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-all',
                    'hover:shadow-sm pressable',
                    wouldDiyAgain === false
                      ? 'border-danger bg-danger-light text-danger'
                      : 'border-border bg-white text-ink-sub hover:border-border-focus'
                  )}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
                    />
                  </svg>
                  No
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button type="button" variant="ghost" onClick={goBack} size="md">
              Back
            </Button>
            <Button type="submit" loading={isSubmitting} size="md">
              Submit Report
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}
