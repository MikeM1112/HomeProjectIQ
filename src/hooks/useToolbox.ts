'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/constants';
import type { ToolboxItem } from '@/types/app';

async function fetchToolbox(): Promise<ToolboxItem[]> {
  const res = await fetch('/api/toolbox');
  if (!res.ok) throw new Error('Failed to fetch toolbox');
  const json = await res.json();
  return json.data ?? json;
}

async function addTool(data: {
  tool_id: string;
  tool_name: string;
  category: string;
}): Promise<ToolboxItem> {
  const res = await fetch('/api/toolbox', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add tool');
  return res.json();
}

async function removeTool(toolId: string): Promise<void> {
  const res = await fetch('/api/toolbox', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tool_id: toolId }),
  });
  if (!res.ok) throw new Error('Failed to remove tool');
}

export function useToolbox() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEYS.TOOLBOX],
    queryFn: fetchToolbox,
    staleTime: 1000 * 60 * 5,
  });

  const addMutation = useMutation({
    mutationFn: addTool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TOOLBOX] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeTool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TOOLBOX] });
    },
  });

  return {
    tools: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    addTool: addMutation.mutateAsync,
    removeTool: removeMutation.mutateAsync,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
}
