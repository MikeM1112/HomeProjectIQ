'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/constants';
import type { Property, PropertyZone, HomeSystem, Household } from '@/types/app';

interface PropertiesResponse {
  data: Property[];
  households: Household[];
}

async function fetchProperties(): Promise<PropertiesResponse> {
  const res = await fetch('/api/properties');
  if (!res.ok) throw new Error('Failed to fetch properties');
  return res.json();
}

async function createPropertyApi(data: {
  name: string;
  household_id?: string;
  address?: string;
  home_type?: string;
  year_built?: number;
  square_footage?: number;
  floors?: number;
  bedrooms?: number;
  bathrooms?: number;
}): Promise<Property> {
  const res = await fetch('/api/properties', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create property');
  return res.json();
}

async function fetchZones(propertyId: string): Promise<PropertyZone[]> {
  const res = await fetch(`/api/properties/${propertyId}/zones`);
  if (!res.ok) throw new Error('Failed to fetch zones');
  const json = await res.json();
  return json.data ?? [];
}

async function createZoneApi(data: { property_id: string; name: string; zone_type: string }): Promise<PropertyZone> {
  const res = await fetch(`/api/properties/${data.property_id}/zones`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create zone');
  return res.json();
}

async function fetchSystems(propertyId: string): Promise<HomeSystem[]> {
  const res = await fetch(`/api/properties/${propertyId}/systems`);
  if (!res.ok) throw new Error('Failed to fetch systems');
  const json = await res.json();
  return json.data ?? [];
}

async function createSystemApi(data: {
  property_id: string;
  name: string;
  system_type: string;
  brand?: string;
  model?: string;
  condition?: string;
}): Promise<HomeSystem> {
  const res = await fetch(`/api/properties/${data.property_id}/systems`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create system');
  return res.json();
}

export function useProperties() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEYS.PROPERTIES],
    queryFn: fetchProperties,
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: createPropertyApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROPERTIES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER] });
    },
  });

  return {
    properties: query.data?.data ?? [],
    households: query.data?.households ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createProperty: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}

export function usePropertyZones(propertyId: string | undefined) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEYS.ZONES, propertyId],
    queryFn: () => fetchZones(propertyId!),
    enabled: !!propertyId,
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: createZoneApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ZONES, propertyId] });
    },
  });

  return {
    zones: query.data ?? [],
    isLoading: query.isLoading,
    createZone: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}

export function usePropertySystems(propertyId: string | undefined) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEYS.SYSTEMS, propertyId],
    queryFn: () => fetchSystems(propertyId!),
    enabled: !!propertyId,
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: createSystemApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SYSTEMS, propertyId] });
    },
  });

  return {
    systems: query.data ?? [],
    isLoading: query.isLoading,
    createSystem: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}
