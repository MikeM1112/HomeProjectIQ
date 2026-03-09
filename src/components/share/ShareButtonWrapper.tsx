'use client';

import { ShareButton } from './ShareButton';

interface ShareButtonWrapperProps {
  projectId: string;
  title: string;
  confidence: number;
  verdict: string;
  savings: number;
}

export function ShareButtonWrapper(props: ShareButtonWrapperProps) {
  return (
    <div className="flex justify-center">
      <ShareButton {...props} />
    </div>
  );
}
