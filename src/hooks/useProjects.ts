'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/constants';
import type { Project } from '@/types/app';

async function fetchProjects(): Promise<Project[]> {
  const res = await fetch('/api/analyze');
  if (!res.ok) throw new Error('Failed to fetch projects');
  const json = await res.json();
  return json.data ?? json;
}

async function createProject(data: {
  category_id: string;
  intake_answers: Record<string, string>;
}): Promise<Project> {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create project');
  return res.json();
}

export function useProjects() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEYS.PROJECTS],
    queryFn: fetchProjects,
    staleTime: 1000 * 60 * 2,
  });

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER] });
    },
  });

  return {
    projects: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createProject: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}
