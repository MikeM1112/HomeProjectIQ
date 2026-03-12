'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/constants';
import type {
  CapabilityScore, RiskScore, Alert, Recommendation,
  ToolReadinessResult, DIYDecisionResult, TrustScore,
} from '@/types/app';

// ── Capability Score ──
async function fetchCapabilityScore(): Promise<CapabilityScore | null> {
  const res = await fetch('/api/intelligence/capability-score');
  if (!res.ok) throw new Error('Failed to fetch capability score');
  const json = await res.json();
  return json.data ?? null;
}

async function calculateCapabilityScore(): Promise<CapabilityScore> {
  const res = await fetch('/api/intelligence/capability-score', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to calculate score');
  return res.json();
}

// ── Risk Radar ──
async function fetchRiskScores(): Promise<RiskScore[]> {
  const res = await fetch('/api/intelligence/risk-radar');
  if (!res.ok) throw new Error('Failed to fetch risk scores');
  const json = await res.json();
  return json.data ?? [];
}

async function calculateRiskScores(): Promise<RiskScore[]> {
  const res = await fetch('/api/intelligence/risk-radar', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to calculate risk scores');
  const json = await res.json();
  return json.data ?? [];
}

// ── Alerts ──
async function fetchAlerts(): Promise<Alert[]> {
  const res = await fetch('/api/alerts');
  if (!res.ok) throw new Error('Failed to fetch alerts');
  const json = await res.json();
  return json.data ?? [];
}

async function updateAlertApi(data: { alert_id: string; is_read?: boolean; is_dismissed?: boolean }): Promise<Alert> {
  const res = await fetch('/api/alerts', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update alert');
  return res.json();
}

// ── Recommendations ──
async function fetchRecommendations(): Promise<Recommendation[]> {
  const res = await fetch('/api/intelligence/recommendations');
  if (!res.ok) throw new Error('Failed to fetch recommendations');
  const json = await res.json();
  return json.data ?? [];
}

async function updateRecommendationApi(data: {
  recommendation_id: string;
  is_completed?: boolean;
  is_dismissed?: boolean;
}): Promise<Recommendation> {
  const res = await fetch('/api/intelligence/recommendations', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update recommendation');
  return res.json();
}

export function useCapabilityScore() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEYS.CAPABILITY_SCORE],
    queryFn: fetchCapabilityScore,
    staleTime: 1000 * 60 * 10,
  });

  const recalculate = useMutation({
    mutationFn: calculateCapabilityScore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CAPABILITY_SCORE] });
    },
  });

  return {
    score: query.data,
    isLoading: query.isLoading,
    recalculate: recalculate.mutateAsync,
    isCalculating: recalculate.isPending,
  };
}

export function useRiskRadar() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEYS.RISK_SCORES],
    queryFn: fetchRiskScores,
    staleTime: 1000 * 60 * 10,
  });

  const recalculate = useMutation({
    mutationFn: calculateRiskScores,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RISK_SCORES] });
    },
  });

  const criticalCount = (query.data ?? []).filter((r) => r.risk_level === 'critical').length;
  const highCount = (query.data ?? []).filter((r) => r.risk_level === 'high').length;

  return {
    risks: query.data ?? [],
    criticalCount,
    highCount,
    isLoading: query.isLoading,
    recalculate: recalculate.mutateAsync,
    isCalculating: recalculate.isPending,
  };
}

export function useAlerts() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEYS.ALERTS],
    queryFn: fetchAlerts,
    staleTime: 1000 * 60 * 2,
  });

  const updateMutation = useMutation({
    mutationFn: updateAlertApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ALERTS] });
    },
  });

  const unreadCount = (query.data ?? []).filter((a) => !a.is_read).length;

  return {
    alerts: query.data ?? [],
    unreadCount,
    isLoading: query.isLoading,
    markRead: (alertId: string) => updateMutation.mutateAsync({ alert_id: alertId, is_read: true }),
    dismiss: (alertId: string) => updateMutation.mutateAsync({ alert_id: alertId, is_dismissed: true }),
  };
}

export function useRecommendations() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEYS.RECOMMENDATIONS],
    queryFn: fetchRecommendations,
    staleTime: 1000 * 60 * 5,
  });

  const updateMutation = useMutation({
    mutationFn: updateRecommendationApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RECOMMENDATIONS] });
    },
  });

  return {
    recommendations: query.data ?? [],
    isLoading: query.isLoading,
    complete: (id: string) => updateMutation.mutateAsync({ recommendation_id: id, is_completed: true }),
    dismiss: (id: string) => updateMutation.mutateAsync({ recommendation_id: id, is_dismissed: true }),
  };
}

// ── Tool Readiness ──
async function fetchToolReadiness(projectId: string): Promise<ToolReadinessResult> {
  const res = await fetch('/api/intelligence/tool-readiness', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ project_id: projectId }),
  });
  if (!res.ok) throw new Error('Failed to fetch tool readiness');
  return res.json();
}

export function useToolReadiness(projectId?: string) {
  const query = useQuery({
    queryKey: [QUERY_KEYS.TOOL_READINESS, projectId],
    queryFn: () => fetchToolReadiness(projectId!),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5,
  });

  return {
    readiness: query.data,
    isLoading: query.isLoading,
  };
}

// ── DIY Decision ──
async function fetchDiyDecision(projectId: string, hourlyValue?: number): Promise<DIYDecisionResult> {
  const res = await fetch('/api/intelligence/diy-decision', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ project_id: projectId, user_hourly_value: hourlyValue ?? 30 }),
  });
  if (!res.ok) throw new Error('Failed to fetch DIY decision');
  return res.json();
}

export function useDiyDecision(projectId?: string) {
  const query = useQuery({
    queryKey: [QUERY_KEYS.DIY_DECISION, projectId],
    queryFn: () => fetchDiyDecision(projectId!),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 10,
  });

  return {
    decision: query.data,
    isLoading: query.isLoading,
  };
}

// ── Trust Score ──
async function fetchTrustScore(userId?: string): Promise<TrustScore> {
  const params = userId ? `?user_id=${userId}` : '';
  const res = await fetch(`/api/social/trust-score${params}`);
  if (!res.ok) throw new Error('Failed to fetch trust score');
  return res.json();
}

export function useTrustScore(userId?: string) {
  const query = useQuery({
    queryKey: [QUERY_KEYS.TRUST_SCORE, userId],
    queryFn: () => fetchTrustScore(userId),
    staleTime: 1000 * 60 * 5,
  });

  return {
    trustScore: query.data,
    isLoading: query.isLoading,
  };
}
