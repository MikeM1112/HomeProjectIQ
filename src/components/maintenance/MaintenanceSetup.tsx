'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { HomeProfile, HomeType } from '@/lib/maintenance';

interface MaintenanceSetupProps {
  onComplete: (profile: HomeProfile) => void;
  isLoading?: boolean;
}

type Step = 'type' | 'age' | 'systems' | 'features';

const HOME_TYPES: { value: HomeType; label: string; icon: string; desc: string }[] = [
  { value: 'house', label: 'Single Family Home', icon: '🏠', desc: 'Detached house with yard' },
  { value: 'townhouse', label: 'Townhouse / Duplex', icon: '🏘️', desc: 'Attached with some outdoor space' },
  { value: 'condo', label: 'Condo / Apartment', icon: '🏢', desc: 'Shared building, no exterior duties' },
];

const AGE_OPTIONS: { value: string; label: string; desc: string }[] = [
  { value: 'new', label: 'New Build', desc: 'Built within the last year' },
  { value: '1-10', label: '1-10 Years', desc: 'Still fairly new' },
  { value: '10-25', label: '10-25 Years', desc: 'Some systems aging' },
  { value: '25-50', label: '25-50 Years', desc: 'Many systems at mid-life' },
  { value: '50+', label: '50+ Years', desc: 'Vintage home, needs extra care' },
];

export function MaintenanceSetup({ onComplete, isLoading }: MaintenanceSetupProps) {
  const [step, setStep] = useState<Step>('type');
  const [profile, setProfile] = useState<HomeProfile>({
    homeType: 'house',
    homeAge: '10-25',
    heatingType: 'gas',
    hasAC: true,
    hasChimney: false,
    hasSeptic: false,
    hasSumpPump: false,
    hasGarage: true,
    hasDeck: true,
    hasYard: true,
  });

  const steps: Step[] = ['type', 'age', 'systems', 'features'];
  const currentIdx = steps.indexOf(step);
  const progressPct = ((currentIdx + 1) / steps.length) * 100;

  const goNext = () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx < steps.length) {
      setStep(steps[nextIdx]);
    } else {
      onComplete(profile);
    }
  };

  const goBack = () => {
    if (currentIdx > 0) {
      setStep(steps[currentIdx - 1]);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">🏠</div>
        <h2 className="font-serif text-xl" style={{ color: 'var(--text)' }}>
          Set Up Home Maintenance
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-sub)' }}>
          Tell us about your home to personalize your maintenance schedule
        </p>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 rounded-full bg-[var(--glass-border)] overflow-hidden mb-6">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progressPct}%`, background: 'var(--accent-gradient)' }}
        />
      </div>

      {/* Step 1: Home Type */}
      {step === 'type' && (
        <div className="space-y-3">
          <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>
            What type of home do you have?
          </p>
          {HOME_TYPES.map((ht) => (
            <Card
              key={ht.value}
              padding="md"
              variant={profile.homeType === ht.value ? 'selected' : 'interactive'}
              onClick={() => setProfile({ ...profile, homeType: ht.value })}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{ht.icon}</span>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{ht.label}</p>
                  <p className="text-[11px]" style={{ color: 'var(--text-dim)' }}>{ht.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Step 2: Home Age */}
      {step === 'age' && (
        <div className="space-y-3">
          <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>
            How old is your home?
          </p>
          {AGE_OPTIONS.map((opt) => (
            <Card
              key={opt.value}
              padding="sm"
              variant={profile.homeAge === opt.value ? 'selected' : 'interactive'}
              onClick={() => setProfile({ ...profile, homeAge: opt.value as HomeProfile['homeAge'] })}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{opt.label}</p>
                <p className="text-[11px]" style={{ color: 'var(--text-dim)' }}>{opt.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Step 3: Systems */}
      {step === 'systems' && (
        <div className="space-y-3">
          <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>
            What systems does your home have?
          </p>

          {/* Heating Type */}
          <div className="mb-4">
            <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-sub)' }}>
              Heating Type
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(['gas', 'electric', 'heat_pump', 'oil'] as const).map((type) => (
                <Card
                  key={type}
                  padding="sm"
                  variant={profile.heatingType === type ? 'selected' : 'interactive'}
                  onClick={() => setProfile({ ...profile, heatingType: type })}
                >
                  <p className="text-sm font-medium text-center" style={{ color: 'var(--text)' }}>
                    {type === 'gas' ? '🔥 Gas' : type === 'electric' ? '⚡ Electric' : type === 'heat_pump' ? '💨 Heat Pump' : '🛢️ Oil'}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* Toggle options */}
          <div className="space-y-2">
            {[
              { key: 'hasAC', label: 'Central Air Conditioning', icon: '❄️' },
              { key: 'hasChimney', label: 'Fireplace / Chimney', icon: '🏠' },
              { key: 'hasSeptic', label: 'Septic System', icon: '🕳️' },
              { key: 'hasSumpPump', label: 'Sump Pump', icon: '🚰' },
            ].map(({ key, label, icon }) => (
              <Card
                key={key}
                padding="sm"
                variant={(profile as unknown as Record<string, unknown>)[key] ? 'selected' : 'interactive'}
                onClick={() => setProfile({ ...profile, [key]: !(profile as unknown as Record<string, unknown>)[key] })}
              >
                <div className="flex items-center gap-3">
                  <span>{icon}</span>
                  <span className="text-sm font-medium flex-1" style={{ color: 'var(--text)' }}>{label}</span>
                  <div
                    className="w-10 h-6 rounded-full transition-colors flex items-center px-0.5"
                    style={{
                      background: (profile as unknown as Record<string, unknown>)[key] ? 'var(--emerald)' : 'var(--glass-border)',
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full bg-white shadow transition-transform"
                      style={{
                        transform: (profile as unknown as Record<string, unknown>)[key] ? 'translateX(16px)' : 'translateX(0)',
                      }}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Features */}
      {step === 'features' && (
        <div className="space-y-3">
          <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>
            What features does your home have?
          </p>
          <div className="space-y-2">
            {[
              { key: 'hasGarage', label: 'Garage', icon: '🚗' },
              { key: 'hasDeck', label: 'Deck or Patio', icon: '🪵' },
              { key: 'hasYard', label: 'Yard / Lawn', icon: '🌿' },
            ].map(({ key, label, icon }) => (
              <Card
                key={key}
                padding="sm"
                variant={(profile as unknown as Record<string, unknown>)[key] ? 'selected' : 'interactive'}
                onClick={() => setProfile({ ...profile, [key]: !(profile as unknown as Record<string, unknown>)[key] })}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{icon}</span>
                  <span className="text-sm font-medium flex-1" style={{ color: 'var(--text)' }}>{label}</span>
                  <div
                    className="w-10 h-6 rounded-full transition-colors flex items-center px-0.5"
                    style={{
                      background: (profile as unknown as Record<string, unknown>)[key] ? 'var(--emerald)' : 'var(--glass-border)',
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full bg-white shadow transition-transform"
                      style={{
                        transform: (profile as unknown as Record<string, unknown>)[key] ? 'translateX(16px)' : 'translateX(0)',
                      }}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div
            className="rounded-xl p-3 mt-4"
            style={{ background: 'var(--accent-soft)' }}
          >
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-sub)' }}>
              Based on your answers, we will create a personalized maintenance schedule with the tasks
              that matter for your home. You can always adjust later.
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 mt-6">
        {currentIdx > 0 && (
          <Button variant="secondary" onClick={goBack} className="flex-1">
            Back
          </Button>
        )}
        <Button
          variant="primary"
          onClick={goNext}
          loading={step === 'features' && isLoading}
          className="flex-1"
        >
          {step === 'features' ? 'Create My Schedule' : 'Next'}
        </Button>
      </div>
    </div>
  );
}
