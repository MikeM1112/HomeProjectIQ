'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/constants';
import type { Project } from '@/types/app';

interface OutcomeData {
  outcome_status: 'success' | 'partial' | 'failed';
  outcome_actual_cost?: number | null;
  outcome_actual_hours?: number | null;
  outcome_difficulty?: 'easier' | 'as_expected' | 'harder' | null;
  outcome_complications?: string | null;
  outcome_would_diy_again?: boolean | null;
}

interface OutcomeResponse {
  project: Project;
  xp_awarded: number;
}

async function submitOutcome(
  projectId: string,
  data: OutcomeData
): Promise<OutcomeResponse> {
  const res = await fetch(`/api/projects/${projectId}/outcome`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to submit outcome');
  }

  return res.json();
}

export function useOutcome(projectId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: OutcomeData) => submitOutcome(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECT, projectId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER] });
    },
  });

  return {
    submitOutcome: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}
