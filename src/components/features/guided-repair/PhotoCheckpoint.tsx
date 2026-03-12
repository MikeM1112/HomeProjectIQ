'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useCheckpoints } from '@/hooks/useGuidedRepair';

export function PhotoCheckpoint({ checkpointId, sessionId }: { checkpointId: string; sessionId: string }) {
  const { updateCheckpoint } = useCheckpoints(sessionId);
  const [uploading, setUploading] = useState(false);

  const handleCapture = async () => {
    setUploading(true);
    try {
      // Simulate photo upload and AI validation
      await updateCheckpoint({
        session_id: sessionId,
        checkpoint_id: checkpointId,
        ai_validation_status: 'passed',
        ai_feedback: 'Step completed correctly. Good work!',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSkip = async () => {
    await updateCheckpoint({
      session_id: sessionId,
      checkpoint_id: checkpointId,
      ai_validation_status: 'skipped',
      ai_feedback: 'Step skipped by user',
    });
  };

  return (
    <div className="flex gap-2">
      <Button size="sm" loading={uploading} onClick={handleCapture}>
        📸 Verify Step
      </Button>
      <Button size="sm" variant="ghost" onClick={handleSkip}>
        Skip
      </Button>
    </div>
  );
}
