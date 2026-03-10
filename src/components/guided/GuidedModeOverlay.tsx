'use client';

import { useGuidedStore } from '@/stores/guidedStore';
import { GuidedMode } from './GuidedMode';

export function GuidedModeOverlay() {
  const isActive = useGuidedStore((s) => s.isActive);
  if (!isActive) return null;
  return <GuidedMode />;
}
