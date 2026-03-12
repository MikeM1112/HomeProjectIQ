'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/constants';
import type { TimelineEvent, HomeDocument } from '@/types/app';

async function fetchTimeline(propertyId?: string): Promise<TimelineEvent[]> {
  const url = propertyId ? `/api/timeline?property_id=${propertyId}` : '/api/timeline';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch timeline');
  const json = await res.json();
  return json.data ?? [];
}

async function createEventApi(data: {
  event_type: string;
  title: string;
  description?: string;
  cost?: number;
  property_id?: string;
  project_id?: string;
  event_date?: string;
}): Promise<TimelineEvent> {
  const res = await fetch('/api/timeline', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create event');
  return res.json();
}

async function deleteEventApi(eventId: string): Promise<void> {
  const res = await fetch('/api/timeline', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event_id: eventId }),
  });
  if (!res.ok) throw new Error('Failed to delete event');
}

async function fetchDocuments(propertyId?: string, docType?: string): Promise<HomeDocument[]> {
  const params = new URLSearchParams();
  if (propertyId) params.set('property_id', propertyId);
  if (docType) params.set('type', docType);
  const url = `/api/documents${params.toString() ? `?${params}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch documents');
  const json = await res.json();
  return json.data ?? [];
}

async function createDocumentApi(data: {
  document_type: string;
  title: string;
  file_url: string;
  description?: string;
  property_id?: string;
  file_type?: string;
  file_size?: number;
}): Promise<HomeDocument> {
  const res = await fetch('/api/documents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create document');
  return res.json();
}

async function deleteDocumentApi(documentId: string): Promise<void> {
  const res = await fetch('/api/documents', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ document_id: documentId }),
  });
  if (!res.ok) throw new Error('Failed to delete document');
}

export function useTimeline(propertyId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEYS.TIMELINE, propertyId],
    queryFn: () => fetchTimeline(propertyId),
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: createEventApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TIMELINE] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEventApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TIMELINE] });
    },
  });

  return {
    events: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createEvent: createMutation.mutateAsync,
    deleteEvent: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}

export function useDocuments(propertyId?: string, docType?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEYS.DOCUMENTS, propertyId, docType],
    queryFn: () => fetchDocuments(propertyId, docType),
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: createDocumentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DOCUMENTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDocumentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DOCUMENTS] });
    },
  });

  return {
    documents: query.data ?? [],
    isLoading: query.isLoading,
    createDocument: createMutation.mutateAsync,
    deleteDocument: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}
