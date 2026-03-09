'use client';

import { useEffect, useState } from 'react';

interface XPAnimationProps {
  amount: number;
  show: boolean;
  onComplete?: () => void;
}

export function XPAnimation({ amount, show, onComplete }: XPAnimationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] pointer-events-none">
      <span
        className="text-2xl font-bold gradient-text animate-xpIn block"
        style={{ textShadow: '0 0 20px var(--accent)' }}
      >
        +{amount} XP
      </span>
    </div>
  );
}
