'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/constants';
import type { AppUser } from '@/types/app';

async function fetchUser(): Promise<AppUser | null> {
  const res = await fetch('/api/user');
  if (res.status === 401) return null;
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}

export function useUser() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEYS.USER],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  return { user: data ?? null, isLoading, error, refetch };
}
