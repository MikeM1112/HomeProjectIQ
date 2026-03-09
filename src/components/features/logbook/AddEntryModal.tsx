'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createLogbookEntrySchema, type CreateLogbookEntryInput } from '@/lib/validations/logbook';
import { CATEGORIES } from '@/lib/project-data';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLogbookEntryInput) => Promise<void>;
  isSubmitting: boolean;
}

export function AddEntryModal({ isOpen, onClose, onSubmit, isSubmitting }: AddEntryModalProps) {
  const today = new Date().toISOString().split('T')[0];
  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<CreateLogbookEntryInput>({
    resolver: zodResolver(createLogbookEntrySchema),
    defaultValues: { repair_date: today, labor_type: 'diy' },
  });

  const laborType = watch('labor_type');

  const handleFormSubmit = async (data: CreateLogbookEntryInput) => {
    await onSubmit(data);
    reset({ repair_date: today, labor_type: 'diy' });
    onClose();
  };

  const handleClose = () => {
    reset({ repair_date: today, labor_type: 'diy' });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Log a Repair"
      footer={
        <Button loading={isSubmitting} onClick={handleSubmit(handleFormSubmit)}>
          Save Entry
        </Button>
      }
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Input label="Title" {...register('title')} error={errors.title?.message} placeholder="What did you fix?" />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-ink">Category</label>
          <select
            {...register('category_id')}
            className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm bg-white"
          >
            <option value="">Select category...</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
            ))}
          </select>
          {errors.category_id && <p className="text-xs text-danger">{errors.category_id.message}</p>}
        </div>

        <Input label="Date" type="date" {...register('repair_date')} error={errors.repair_date?.message} />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-ink">Labor Type</label>
          <div className="flex gap-2">
            {(['diy', 'hired_pro', 'warranty'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setValue('labor_type', type)}
                className={cn(
                  'flex-1 py-2 rounded-lg text-sm font-medium border transition-colors tap',
                  laborType === type
                    ? 'border-brand bg-brand-light text-brand'
                    : 'border-border text-ink-sub'
                )}
              >
                {type === 'diy' ? 'DIY' : type === 'hired_pro' ? 'Hired Pro' : 'Warranty'}
              </button>
            ))}
          </div>
        </div>

        <Input label="Cost ($)" type="number" {...register('cost', { valueAsNumber: true })} error={errors.cost?.message} placeholder="0" helper="Optional — enter cost in cents (e.g., 5000 = $50)" />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-ink">Notes</label>
          <textarea
            {...register('notes')}
            className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm min-h-[80px] resize-y"
            placeholder="Any details..."
          />
          {errors.notes && <p className="text-xs text-danger">{errors.notes.message}</p>}
        </div>
      </form>
    </Modal>
  );
}
