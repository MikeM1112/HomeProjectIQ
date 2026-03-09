'use client';

import { useEffect } from 'react';
import { BADGE_DEFINITIONS } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { useUIStore } from '@/stores/uiStore';

export function BadgeCelebration() {
  const { badgeCelebration, dismissBadgeCelebration } = useUIStore();

  useEffect(() => {
    if (badgeCelebration) {
      // Auto-dismiss after 5s
      const timer = setTimeout(dismissBadgeCelebration, 5000);
      return () => clearTimeout(timer);
    }
  }, [badgeCelebration, dismissBadgeCelebration]);

  if (!badgeCelebration) return null;

  const badge = BADGE_DEFINITIONS.find((b) => b.id === badgeCelebration);
  if (!badge) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade" onClick={dismissBadgeCelebration} />
      <div className="relative z-10 glass rounded-3xl p-8 text-center animate-pop max-w-xs mx-4">
        <div className="text-6xl mb-3 animate-float">{badge.icon}</div>
        <h2 className="font-serif text-xl font-bold gradient-text mb-1">Badge Earned!</h2>
        <p className="text-lg font-semibold text-[var(--ink)] mb-1">{badge.label}</p>
        <p className="text-sm text-[var(--ink-sub)] mb-4">{badge.condition}</p>
        <Button size="sm" onClick={dismissBadgeCelebration}>
          Awesome!
        </Button>
      </div>
    </div>
  );
}
