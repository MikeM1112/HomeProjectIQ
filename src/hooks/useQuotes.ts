'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/constants';
import type { QuoteRequest } from '@/types/app';
import type { CreateQuoteInput } from '@/lib/validations/quote';

async function fetchQuotes(): Promise<QuoteRequest[]> {
  const res = await fetch('/api/quotes');
  if (!res.ok) throw new Error('Failed to fetch quotes');
  const json = await res.json();
  return json.data ?? [];
}

async function createQuoteRequest(data: CreateQuoteInput): Promise<QuoteRequest> {
  const res = await fetch('/api/quotes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to create quote' }));
    throw new Error(err.error ?? 'Failed to create quote');
  }
  const json = await res.json();
  return json.data;
}

async function cancelQuoteRequest(id: string): Promise<QuoteRequest> {
  const res = await fetch(`/api/quotes/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'cancelled' }),
  });
  if (!res.ok) throw new Error('Failed to cancel quote');
  const json = await res.json();
  return json.data;
}

export function useQuotes() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEYS.QUOTES],
    queryFn: fetchQuotes,
    staleTime: 1000 * 60 * 2,
  });

  const createMutation = useMutation({
    mutationFn: createQuoteRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.QUOTES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: cancelQuoteRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.QUOTES] });
    },
  });

  const quotes = query.data ?? [];
  const activeQuotes = quotes.filter(
    (q) => q.status === 'pending' || q.status === 'matched' || q.status === 'quoted',
  );

  return {
    quotes,
    activeQuotes,
    isLoading: query.isLoading,
    error: query.error,
    createQuote: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    cancelQuote: cancelMutation.mutateAsync,
    isCancelling: cancelMutation.isPending,
  };
}
