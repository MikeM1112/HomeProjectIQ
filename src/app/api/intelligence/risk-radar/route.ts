import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { RiskLevel } from '@/types/app';

function calculateRiskLevel(score: number): RiskLevel {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'moderate';
  return 'low';
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: scores, error } = await supabase
    .from('risk_scores')
    .select('*')
    .eq('user_id', user.id)
    .order('calculated_at', { ascending: false });

  if (error) return NextResponse.json({ error: 'Failed to fetch risk scores' }, { status: 500 });
  return NextResponse.json({ data: scores });
}

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Get all properties for the user
  const { data: memberships } = await supabase
    .from('household_members')
    .select('household_id')
    .eq('user_id', user.id);

  if (!memberships?.length) {
    return NextResponse.json({ data: [], message: 'No properties found' });
  }

  const householdIds = memberships.map((m) => m.household_id);

  const { data: properties } = await supabase
    .from('properties')
    .select('id')
    .in('household_id', householdIds);

  if (!properties?.length) {
    return NextResponse.json({ data: [], message: 'No properties found' });
  }

  const propertyIds = properties.map((p) => p.id);

  const { data: systems } = await supabase
    .from('systems')
    .select('*')
    .in('property_id', propertyIds);

  if (!systems?.length) {
    return NextResponse.json({ data: [], message: 'No systems found' });
  }

  const now = new Date();
  const riskScores = systems.map((system) => {
    const factors: string[] = [];
    let riskScore = 0;

    // Age-based risk
    if (system.install_date) {
      const installDate = new Date(system.install_date);
      const ageYears = (now.getTime() - installDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      const lifespan = system.expected_lifespan_years || 15;
      const ageRatio = ageYears / lifespan;

      if (ageRatio > 1) {
        riskScore += 40;
        factors.push('Past expected lifespan');
      } else if (ageRatio > 0.8) {
        riskScore += 25;
        factors.push('Approaching end of lifespan');
      } else if (ageRatio > 0.5) {
        riskScore += 10;
      }
    } else {
      riskScore += 15;
      factors.push('Unknown installation date');
    }

    // Condition-based risk
    const conditionRisk: Record<string, number> = { excellent: 0, good: 5, fair: 20, poor: 40, critical: 60 };
    riskScore += conditionRisk[system.condition] ?? 10;
    if (system.condition === 'poor' || system.condition === 'critical') {
      factors.push(`System condition: ${system.condition}`);
    }

    // Service recency
    if (system.last_serviced_at) {
      const lastService = new Date(system.last_serviced_at);
      const monthsSinceService = (now.getTime() - lastService.getTime()) / (30 * 24 * 60 * 60 * 1000);
      if (monthsSinceService > 24) {
        riskScore += 15;
        factors.push('Not serviced in over 2 years');
      } else if (monthsSinceService > 12) {
        riskScore += 5;
      }
    } else {
      riskScore += 10;
      factors.push('No service history recorded');
    }

    riskScore = Math.min(riskScore, 100);

    return {
      user_id: user.id,
      property_id: system.property_id,
      system_id: system.id,
      system_type: system.system_type,
      risk_score: riskScore,
      risk_level: calculateRiskLevel(riskScore),
      contributing_factors: JSON.stringify(factors),
      calculated_at: now.toISOString(),
    };
  });

  const { data: saved, error } = await supabase
    .from('risk_scores')
    .insert(riskScores)
    .select();

  if (error) return NextResponse.json({ error: 'Failed to save risk scores' }, { status: 500 });
  return NextResponse.json({ data: saved });
}
