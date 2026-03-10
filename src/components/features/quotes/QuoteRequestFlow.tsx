'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Mascot } from '@/components/brand/Mascot';
import { useQuotes } from '@/hooks/useQuotes';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { DiagnosisResult, QuoteTimeline, ContactPreference } from '@/types/app';

interface QuoteRequestFlowProps {
  diagnosis: DiagnosisResult;
  projectId?: string;
  categoryId: string;
  onClose: () => void;
}

type FlowStep = 'form' | 'submitting' | 'confirmed';

const TIMELINES: { value: QuoteTimeline; label: string; desc: string }[] = [
  { value: 'asap', label: 'ASAP', desc: 'As soon as possible' },
  { value: 'this_week', label: 'This Week', desc: 'Within 7 days' },
  { value: 'this_month', label: 'This Month', desc: 'Within 30 days' },
  { value: 'flexible', label: 'Flexible', desc: 'No rush' },
];

const CONTACT_OPTIONS: { value: ContactPreference; label: string }[] = [
  { value: 'in_app', label: 'In-App' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
];

export function QuoteRequestFlow({ diagnosis, projectId, categoryId, onClose }: QuoteRequestFlowProps) {
  const { createQuote } = useQuotes();
  const [step, setStep] = useState<FlowStep>('form');
  const [zipCode, setZipCode] = useState('');
  const [timeline, setTimeline] = useState<QuoteTimeline>('flexible');
  const [contactPref, setContactPref] = useState<ContactPreference>('in_app');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!zipCode.trim()) {
      setError('Please enter your zip code');
      return;
    }
    if (contactPref === 'phone' && !phone.trim()) {
      setError('Please enter your phone number');
      return;
    }

    setError(null);
    setStep('submitting');

    try {
      await createQuote({
        project_id: projectId ?? null,
        title: diagnosis.title,
        category_id: categoryId,
        estimated_pro_lo: diagnosis.pro.lo,
        estimated_pro_hi: diagnosis.pro.hi,
        estimated_diy_lo: diagnosis.diy.lo,
        estimated_diy_hi: diagnosis.diy.hi,
        materials_json: diagnosis.shop.map((s) => ({ name: s.n, price: s.pr })),
        tools_json: diagnosis.tools.map((t) => ({ name: t.n, required: t.r })),
        call_script: diagnosis.pro.script,
        zip_code: zipCode.trim(),
        preferred_timeline: timeline,
        contact_preference: contactPref,
        contact_phone: contactPref === 'phone' ? phone.trim() : null,
        notes: notes.trim() || null,
      });
      setStep('confirmed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStep('form');
    }
  };

  // Step 2: Submitting animation
  if (step === 'submitting') {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-6 animate-fade">
        <div className="relative">
          <div className="absolute inset-0 w-20 h-20 rounded-full bg-brand/10 animate-ping" />
          <div className="relative w-20 h-20 rounded-full bg-brand/5 flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="font-serif text-lg font-semibold text-ink">Submitting your request</h3>
          <p className="text-sm text-ink-sub">Matching you with local pros...</p>
        </div>
      </div>
    );
  }

  // Step 3: Confirmed
  if (step === 'confirmed') {
    return (
      <div className="flex flex-col items-center py-8 space-y-6 animate-fade">
        <Mascot size="lg" mode="celebrate" />
        <div className="text-center space-y-2">
          <h3 className="font-serif text-xl font-semibold text-ink">Request Submitted!</h3>
          <p className="text-sm text-ink-sub max-w-xs mx-auto">
            We&rsquo;ll notify you when pros respond with quotes. Most requests get their first quote within 24 hours.
          </p>
        </div>
        <Button variant="secondary" size="lg" className="w-full" onClick={onClose}>
          Back to Project
        </Button>
      </div>
    );
  }

  // Step 1: Form
  return (
    <div className="space-y-4 animate-fade">
      {/* Project summary card */}
      <Card className="bg-brand/5 border-brand/10">
        <div className="flex items-center gap-3">
          <Mascot size="sm" mode="tool" animate={false} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-ink truncate">{diagnosis.title}</p>
            <p className="text-xs text-ink-sub">
              Pro estimate: {formatCurrency(diagnosis.pro.lo)} &ndash; {formatCurrency(diagnosis.pro.hi)}
            </p>
          </div>
        </div>
      </Card>

      {/* Zip code */}
      <div className="space-y-1.5">
        <label htmlFor="quote-zip" className="block text-sm font-medium text-ink">
          Your Zip Code
        </label>
        <input
          id="quote-zip"
          type="text"
          inputMode="numeric"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          placeholder="e.g. 90210"
          maxLength={10}
          className={cn(
            'w-full rounded-[16px] border bg-[var(--glass)] backdrop-blur-[16px] px-3.5 py-2.5 text-sm text-ink',
            'placeholder:text-ink-dim',
            'transition-all focus:outline-none focus:ring-2 focus:ring-offset-1',
            'border-[var(--glass-border)] focus:border-[var(--accent)] focus:ring-[var(--accent-glow)] shadow-[var(--card-shadow)]',
          )}
        />
      </div>

      {/* Timeline */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-ink">Preferred Timeline</label>
        <div className="grid grid-cols-2 gap-2">
          {TIMELINES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTimeline(t.value)}
              className={cn(
                'rounded-[16px] p-3 text-left border transition-all tap',
                timeline === t.value
                  ? 'border-brand bg-brand/5'
                  : 'border-[var(--glass-border)] bg-[var(--glass)]',
              )}
            >
              <p className={cn('text-sm font-medium', timeline === t.value ? 'text-brand' : 'text-ink')}>
                {t.label}
              </p>
              <p className="text-xs text-ink-sub">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Contact preference */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-ink">Contact Preference</label>
        <div className="flex gap-2">
          {CONTACT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setContactPref(opt.value)}
              className={cn(
                'flex-1 rounded-full py-2 text-sm font-medium border transition-all tap',
                contactPref === opt.value
                  ? 'border-brand bg-brand/5 text-brand'
                  : 'border-[var(--glass-border)] text-ink-sub',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Phone (conditional) */}
      {contactPref === 'phone' && (
        <div className="space-y-1.5">
          <label htmlFor="quote-phone" className="block text-sm font-medium text-ink">Phone Number</label>
          <input
            id="quote-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(555) 123-4567"
            className={cn(
              'w-full rounded-[16px] border bg-[var(--glass)] backdrop-blur-[16px] px-3.5 py-2.5 text-sm text-ink',
              'placeholder:text-ink-dim',
              'transition-all focus:outline-none focus:ring-2 focus:ring-offset-1',
              'border-[var(--glass-border)] focus:border-[var(--accent)] focus:ring-[var(--accent-glow)] shadow-[var(--card-shadow)]',
            )}
          />
        </div>
      )}

      {/* Notes */}
      <div className="space-y-1.5">
        <label htmlFor="quote-notes" className="block text-sm font-medium text-ink">
          Additional Notes <span className="text-ink-dim">(optional)</span>
        </label>
        <textarea
          id="quote-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any specific requirements or details for contractors..."
          rows={2}
          maxLength={2000}
          className={cn(
            'w-full rounded-[16px] border bg-[var(--glass)] backdrop-blur-[16px] px-3.5 py-2.5 text-sm text-ink',
            'placeholder:text-ink-dim resize-none',
            'transition-all focus:outline-none focus:ring-2 focus:ring-offset-1',
            'border-[var(--glass-border)] focus:border-[var(--accent)] focus:ring-[var(--accent-glow)] shadow-[var(--card-shadow)]',
          )}
        />
      </div>

      {error && (
        <Card className="bg-danger/5 border-danger/20">
          <p className="text-sm text-danger">{error}</p>
        </Card>
      )}

      <div className="flex gap-3">
        <Button variant="secondary" size="lg" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" size="lg" className="flex-1" onClick={handleSubmit}>
          Get Quotes
        </Button>
      </div>
    </div>
  );
}
