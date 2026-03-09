'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useUIStore } from '@/stores/uiStore';

interface ShareButtonProps {
  projectId: string;
  title: string;
  verdict: string;
}

export function ShareButton({ projectId, title, verdict }: ShareButtonProps) {
  const [shared, setShared] = useState(false);
  const { showToast } = useUIStore();

  const shareUrl = `${window.location.origin}/share/${projectId}`;
  const shareText = `I just assessed "${title}" with HomeProjectIQ — verdict: ${verdict}! Check it out:`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `HomeProjectIQ: ${title}`,
          text: shareText,
          url: shareUrl,
        });
        setShared(true);
        showToast('Shared successfully!', 'success');
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          fallbackCopy();
        }
      }
    } else {
      fallbackCopy();
    }
  };

  const fallbackCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShared(true);
      showToast('Link copied to clipboard!', 'success');
    } catch {
      showToast('Could not copy link', 'error');
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleShare}
      className="gap-2"
    >
      {shared ? '✓ Shared' : '🔗 Share Result'}
    </Button>
  );
}
