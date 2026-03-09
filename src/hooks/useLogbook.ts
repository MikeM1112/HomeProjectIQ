'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/constants';
import type { LogbookEntry } from '@/types/app';
import type { CreateLogbookEntryInput } from '@/lib/validations/logbook';

async function fetchLogbook(): Promise<LogbookEntry[]> {
  const res = await fetch('/api/logbook');
  if (!res.ok) throw new Error('Failed to fetch logbook');
  const json = await res.json();
  return json.data ?? json;
}

async function createEntry(data: CreateLogbookEntryInput): Promise<LogbookEntry> {
  const res = await fetch('/api/logbook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create entry');
  return res.json();
}

async function deleteEntry(id: string): Promise<void> {
  const res = await fetch(`/api/logbook/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete entry');
}

export function useLogbook() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEYS.LOGBOOK],
    queryFn: fetchLogbook,
    staleTime: 1000 * 60 * 2,
  });

  const createMutation = useMutation({
    mutationFn: createEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOGBOOK] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOGBOOK] });
    },
  });

  return {
    entries: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createEntry: createMutation.mutateAsync,
    deleteEntry: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
