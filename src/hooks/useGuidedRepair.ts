'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/constants';
import type { GuidedSession, StepCheckpoint } from '@/types/app';

async function fetchSessions(projectId?: string): Promise<GuidedSession[]> {
  const url = projectId ? `/api/guided-repair?project_id=${projectId}` : '/api/guided-repair';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch sessions');
  const json = await res.json();
  return json.data ?? [];
}

async function createSessionApi(data: {
  project_id: string;
  total_steps: number;
  notes?: string;
}): Promise<GuidedSession> {
  const res = await fetch('/api/guided-repair', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create session');
  return res.json();
}

async function updateSessionApi(data: {
  session_id: string;
  status?: string;
  current_step?: number;
}): Promise<GuidedSession> {
  const res = await fetch('/api/guided-repair', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update session');
  return res.json();
}

async function fetchCheckpoints(sessionId: string): Promise<StepCheckpoint[]> {
  const res = await fetch(`/api/guided-repair/${sessionId}/checkpoints`);
  if (!res.ok) throw new Error('Failed to fetch checkpoints');
  const json = await res.json();
  return json.data ?? [];
}

async function createCheckpointApi(data: {
  session_id: string;
  step_number: number;
  title: string;
  instructions?: string;
}): Promise<StepCheckpoint> {
  const res = await fetch(`/api/guided-repair/${data.session_id}/checkpoints`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create checkpoint');
  return res.json();
}

async function updateCheckpointApi(data: {
  session_id: string;
  checkpoint_id: string;
  photo_url?: string;
  ai_validation_status?: string;
  ai_feedback?: string;
}): Promise<StepCheckpoint> {
  const res = await fetch(`/api/guided-repair/${data.session_id}/checkpoints`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update checkpoint');
  return res.json();
}

export function useGuidedSessions(projectId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEYS.GUIDED_SESSIONS, projectId],
    queryFn: () => fetchSessions(projectId),
    staleTime: 1000 * 60 * 2,
  });

  const createMutation = useMutation({
    mutationFn: createSessionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GUIDED_SESSIONS] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateSessionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GUIDED_SESSIONS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER] });
    },
  });

  const activeSession = (query.data ?? []).find((s) => s.status === 'active');

  return {
    sessions: query.data ?? [],
    activeSession,
    isLoading: query.isLoading,
    createSession: createMutation.mutateAsync,
    updateSession: updateMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
}

export function useCheckpoints(sessionId: string | undefined) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEYS.CHECKPOINTS, sessionId],
    queryFn: () => fetchCheckpoints(sessionId!),
    enabled: !!sessionId,
    staleTime: 1000 * 60 * 2,
  });

  const createMutation = useMutation({
    mutationFn: createCheckpointApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHECKPOINTS, sessionId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCheckpointApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHECKPOINTS, sessionId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GUIDED_SESSIONS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER] });
    },
  });

  const completedSteps = (query.data ?? []).filter((c) => c.ai_validation_status === 'passed').length;
  const totalSteps = (query.data ?? []).length;

  return {
    checkpoints: query.data ?? [],
    completedSteps,
    totalSteps,
    isLoading: query.isLoading,
    createCheckpoint: createMutation.mutateAsync,
    updateCheckpoint: updateMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}
