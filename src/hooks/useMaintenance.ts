'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import type { HomeProfile } from '@/lib/maintenance';

const QUERY_KEY = 'maintenance';

export interface MaintenanceTaskRow {
  id: string;
  user_id: string;
  task_id: string;
  title: string;
  category: string;
  frequency: string;
  season: string | null;
  importance: string;
  last_completed_at: string | null;
  next_due_at: string | null;
  is_dismissed: boolean;
  snoozed_until: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface HomeProfileRow {
  id: string;
  user_id: string;
  home_type: string;
  home_age: string;
  heating_type: string;
  has_ac: boolean;
  has_chimney: boolean;
  has_septic: boolean;
  has_sump_pump: boolean;
  has_garage: boolean;
  has_deck: boolean;
  has_yard: boolean;
  setup_completed_at: string | null;
}

interface MaintenanceResponse {
  tasks: MaintenanceTaskRow[];
  homeProfile: HomeProfileRow | null;
  isSetup: boolean;
}

async function fetchMaintenance(): Promise<MaintenanceResponse> {
  const res = await fetch('/api/maintenance');
  if (res.status === 401) return { tasks: [], homeProfile: null, isSetup: false };
  if (!res.ok) throw new Error('Failed to fetch maintenance data');
  return res.json();
}

export function useMaintenance() {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: fetchMaintenance,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

  const setupMutation = useMutation({
    mutationFn: async (profile: HomeProfile) => {
      const res = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error('Failed to set up maintenance');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });

  const completeMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const res = await fetch(`/api/maintenance/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'complete' }),
      });
      if (!res.ok) throw new Error('Failed to complete task');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const dismissMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const res = await fetch(`/api/maintenance/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'dismiss' }),
      });
      if (!res.ok) throw new Error('Failed to dismiss task');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });

  const snoozeMutation = useMutation({
    mutationFn: async ({ taskId, days }: { taskId: string; days: number }) => {
      const res = await fetch(`/api/maintenance/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'snooze', snooze_days: days }),
      });
      if (!res.ok) throw new Error('Failed to snooze task');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });

  const completeTask = useCallback(
    (taskId: string) => completeMutation.mutateAsync(taskId),
    [completeMutation]
  );

  const dismissTask = useCallback(
    (taskId: string) => dismissMutation.mutateAsync(taskId),
    [dismissMutation]
  );

  const snoozeTask = useCallback(
    (taskId: string, days: number) => snoozeMutation.mutateAsync({ taskId, days }),
    [snoozeMutation]
  );

  const setupHome = useCallback(
    (profile: HomeProfile) => setupMutation.mutateAsync(profile),
    [setupMutation]
  );

  return {
    tasks: data?.tasks ?? [],
    homeProfile: data?.homeProfile ?? null,
    isSetup: data?.isSetup ?? false,
    isLoading,
    error,
    refetch,
    completeTask,
    dismissTask,
    snoozeTask,
    setupHome,
    isCompleting: completeMutation.isPending,
    isSettingUp: setupMutation.isPending,
  };
}
