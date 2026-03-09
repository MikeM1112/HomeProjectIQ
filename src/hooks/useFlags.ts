'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/constants';
import type { FeatureFlag } from '@/types/app';

async function fetchFlags(): Promise<FeatureFlag[]> {
  const res = await fetch('/api/admin/flags');
  if (!res.ok) throw new Error('Failed to fetch flags');
  return res.json();
}

async function toggleFlag(data: {
  flag_name: string;
  is_enabled: boolean;
}): Promise<FeatureFlag> {
  const res = await fetch('/api/admin/flags', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to toggle flag');
  return res.json();
}

export function useFlags() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEYS.FLAGS],
    queryFn: fetchFlags,
    staleTime: 1000 * 60,
  });

  const mutation = useMutation({
    mutationFn: toggleFlag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FLAGS] });
    },
  });

  return {
    flags: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    toggleFlag: mutation.mutateAsync,
    isToggling: mutation.isPending,
  };
}
