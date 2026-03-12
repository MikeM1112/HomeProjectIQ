'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useProperties } from '@/hooks/useProperties';

const HOME_TYPES = [
  { id: 'single_family', label: 'Single Family', icon: '🏠' },
  { id: 'townhouse', label: 'Townhouse', icon: '🏘️' },
  { id: 'condo', label: 'Condo', icon: '🏢' },
  { id: 'duplex', label: 'Duplex', icon: '🏗️' },
  { id: 'mobile', label: 'Mobile Home', icon: '🏕️' },
];

export function PropertySetup({ onComplete }: { onComplete?: () => void }) {
  const { createProperty, isCreating } = useProperties();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    home_type: 'single_family',
    year_built: '',
    square_footage: '',
    bedrooms: '',
    bathrooms: '',
    address: '',
  });

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    await createProperty({
      name: form.name || 'My Home',
      home_type: form.home_type,
      year_built: form.year_built ? Number(form.year_built) : undefined,
      square_footage: form.square_footage ? Number(form.square_footage) : undefined,
      bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
      address: form.address || undefined,
    });
    onComplete?.();
  };

  return (
    <div className="space-y-4">
      {step === 0 && (
        <Card padding="lg">
          <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Name your property</h3>
          <input
            type="text"
            placeholder="e.g., Our House on Maple St"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className="w-full p-3 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] text-[var(--text)] placeholder:text-[var(--text-sub)]"
          />
          <input
            type="text"
            placeholder="Address (optional)"
            value={form.address}
            onChange={(e) => update('address', e.target.value)}
            className="w-full p-3 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] text-[var(--text)] placeholder:text-[var(--text-sub)] mt-3"
          />
          <Button className="w-full mt-4" onClick={() => setStep(1)}>Next</Button>
        </Card>
      )}

      {step === 1 && (
        <Card padding="lg">
          <h3 className="text-lg font-semibold text-[var(--text)] mb-4">What type of home?</h3>
          <div className="grid grid-cols-2 gap-2">
            {HOME_TYPES.map((t) => (
              <Card
                key={t.id}
                variant={form.home_type === t.id ? 'selected' : 'interactive'}
                padding="sm"
                onClick={() => update('home_type', t.id)}
              >
                <div className="text-center">
                  <span className="text-2xl">{t.icon}</span>
                  <p className="text-sm text-[var(--text)] mt-1">{t.label}</p>
                </div>
              </Card>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="secondary" onClick={() => setStep(0)}>Back</Button>
            <Button className="flex-1" onClick={() => setStep(2)}>Next</Button>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card padding="lg">
          <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Property details</h3>
          <div className="space-y-3">
            <input type="number" placeholder="Year built" value={form.year_built} onChange={(e) => update('year_built', e.target.value)} className="w-full p-3 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] text-[var(--text)] placeholder:text-[var(--text-sub)]" />
            <input type="number" placeholder="Square footage" value={form.square_footage} onChange={(e) => update('square_footage', e.target.value)} className="w-full p-3 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] text-[var(--text)] placeholder:text-[var(--text-sub)]" />
            <div className="flex gap-3">
              <input type="number" placeholder="Bedrooms" value={form.bedrooms} onChange={(e) => update('bedrooms', e.target.value)} className="flex-1 p-3 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] text-[var(--text)] placeholder:text-[var(--text-sub)]" />
              <input type="number" placeholder="Bathrooms" value={form.bathrooms} onChange={(e) => update('bathrooms', e.target.value)} className="flex-1 p-3 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] text-[var(--text)] placeholder:text-[var(--text-sub)]" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
            <Button className="flex-1" loading={isCreating} onClick={handleSubmit}>Create Property</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
