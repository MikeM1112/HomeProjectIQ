'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useGuidedSessions, useCheckpoints } from '@/hooks/useGuidedRepair';
import { StepCard } from './StepCard';
import { RepairProgress } from './RepairProgress';

export function GuidedRepairSession({ projectId }: { projectId: string }) {
  const { activeSession, createSession, updateSession, isCreating } = useGuidedSessions(projectId);
  const { checkpoints, completedSteps, totalSteps } = useCheckpoints(activeSession?.id);

  if (!activeSession) {
    return (
      <Card padding="lg" className="text-center">
        <span className="text-4xl">🧭</span>
        <h3 className="text-lg font-semibold text-[var(--text)] mt-3">Guided Repair Mode</h3>
        <p className="text-sm text-[var(--text-sub)] mt-1 mb-4">Get step-by-step guidance with AI photo validation</p>
        <Button loading={isCreating} onClick={() => createSession({ project_id: projectId, total_steps: 5 })}>
          Start Guided Repair
        </Button>
      </Card>
    );
  }

  const currentCheckpoint = checkpoints.find((c) => c.step_number === activeSession.current_step);

  return (
    <div className="space-y-4">
      <RepairProgress current={completedSteps} total={activeSession.total_steps} status={activeSession.status} />

      {activeSession.status === 'completed' ? (
        <Card padding="lg" className="text-center">
          <span className="text-4xl">🎉</span>
          <h3 className="text-lg font-semibold text-[var(--text)] mt-3">Repair Complete!</h3>
          <p className="text-sm text-[var(--text-sub)] mt-1">All steps verified successfully</p>
        </Card>
      ) : (
        <>
          {currentCheckpoint && (
            <StepCard
              checkpoint={currentCheckpoint}
              sessionId={activeSession.id}
              isActive
            />
          )}

          <div className="flex gap-2">
            {activeSession.status === 'active' && (
              <Button variant="secondary" size="sm" onClick={() => updateSession({ session_id: activeSession.id, status: 'paused' })}>
                Pause
              </Button>
            )}
            {activeSession.status === 'paused' && (
              <Button size="sm" onClick={() => updateSession({ session_id: activeSession.id, status: 'active' })}>
                Resume
              </Button>
            )}
          </div>
        </>
      )}

      {checkpoints.filter((c) => c.ai_validation_status === 'passed').length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-[var(--text-sub)]">Completed Steps</h4>
          {checkpoints.filter((c) => c.ai_validation_status === 'passed').map((cp) => (
            <StepCard key={cp.id} checkpoint={cp} sessionId={activeSession.id} />
          ))}
        </div>
      )}
    </div>
  );
}
