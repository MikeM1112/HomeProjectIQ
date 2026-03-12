'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/constants';
import type { HandyProfile, ToolboxItem } from '@/types/app';

interface NetworkData {
  friends: HandyProfile[];
  borrowableTools: ToolboxItem[];
}

async function fetchMyProfile(): Promise<HandyProfile | null> {
  const res = await fetch('/api/social/handy-profiles?me=true');
  if (!res.ok) throw new Error('Failed to fetch profile');
  const json = await res.json();
  return json.data ?? null;
}

async function fetchProfiles(neighborhood?: string): Promise<HandyProfile[]> {
  const url = neighborhood ? `/api/social/handy-profiles?neighborhood=${encodeURIComponent(neighborhood)}` : '/api/social/handy-profiles';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch profiles');
  const json = await res.json();
  return json.data ?? [];
}

async function upsertProfileApi(data: {
  display_name?: string;
  bio?: string;
  skills?: string[];
  is_available?: boolean;
  neighborhood?: string;
}): Promise<HandyProfile> {
  const res = await fetch('/api/social/handy-profiles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save profile');
  return res.json();
}

async function updateProfileApi(data: Partial<HandyProfile>): Promise<HandyProfile> {
  const res = await fetch('/api/social/handy-profiles', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
}

async function fetchNetwork(): Promise<NetworkData> {
  const res = await fetch('/api/social/network');
  if (!res.ok) throw new Error('Failed to fetch network');
  const json = await res.json();
  return json.data ?? { friends: [], borrowableTools: [] };
}

export function useHandyProfile() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEYS.HANDY_PROFILES, 'me'],
    queryFn: fetchMyProfile,
    staleTime: 1000 * 60 * 5,
  });

  const upsertMutation = useMutation({
    mutationFn: upsertProfileApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.HANDY_PROFILES] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProfileApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.HANDY_PROFILES] });
    },
  });

  return {
    profile: query.data,
    isLoading: query.isLoading,
    saveProfile: upsertMutation.mutateAsync,
    updateProfile: updateMutation.mutateAsync,
    isSaving: upsertMutation.isPending,
  };
}

export function useHandyProfiles(neighborhood?: string) {
  const query = useQuery({
    queryKey: [QUERY_KEYS.HANDY_PROFILES, neighborhood],
    queryFn: () => fetchProfiles(neighborhood),
    staleTime: 1000 * 60 * 5,
  });

  return {
    profiles: query.data ?? [],
    isLoading: query.isLoading,
  };
}

export function useSocialNetwork() {
  const query = useQuery({
    queryKey: [QUERY_KEYS.SOCIAL_NETWORK],
    queryFn: fetchNetwork,
    staleTime: 1000 * 60 * 5,
  });

  return {
    friends: query.data?.friends ?? [],
    borrowableTools: query.data?.borrowableTools ?? [],
    isLoading: query.isLoading,
  };
}
