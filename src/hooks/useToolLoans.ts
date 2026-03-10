'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/constants';
import type { ToolLoan } from '@/types/app';

async function fetchLoans(): Promise<ToolLoan[]> {
  const res = await fetch('/api/toolbox/loans');
  if (!res.ok) throw new Error('Failed to fetch loans');
  const json = await res.json();
  return json.data ?? [];
}

async function createLoanApi(data: {
  tool_id: string;
  tool_name: string;
  tool_emoji: string;
  borrower_name: string;
  due_date?: string | null;
  notes?: string | null;
}): Promise<ToolLoan> {
  const res = await fetch('/api/toolbox/loans', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create loan');
  return res.json();
}

async function returnLoanApi(id: string): Promise<ToolLoan> {
  const res = await fetch(`/api/toolbox/loans/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'returned' }),
  });
  if (!res.ok) throw new Error('Failed to return loan');
  return res.json();
}

async function deleteLoanApi(id: string): Promise<void> {
  const res = await fetch(`/api/toolbox/loans/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete loan');
}

export function useToolLoans() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEYS.TOOL_LOANS],
    queryFn: fetchLoans,
    staleTime: 1000 * 60 * 5,
  });

  const loans = query.data ?? [];
  const today = new Date().toISOString().split('T')[0];

  const activeLoans = loans.filter((l) => l.status === 'out');
  const overdueLoans = activeLoans.filter(
    (l) => l.due_date && l.due_date.split('T')[0] < today
  );

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TOOL_LOANS] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER] });
  };

  const createMutation = useMutation({
    mutationFn: createLoanApi,
    onSuccess: invalidate,
  });

  const returnMutation = useMutation({
    mutationFn: returnLoanApi,
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLoanApi,
    onSuccess: invalidate,
  });

  return {
    loans,
    activeLoans,
    overdueLoans,
    isLoading: query.isLoading,
    error: query.error,
    createLoan: createMutation.mutateAsync,
    returnLoan: returnMutation.mutateAsync,
    deleteLoan: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isReturning: returnMutation.isPending,
  };
}
