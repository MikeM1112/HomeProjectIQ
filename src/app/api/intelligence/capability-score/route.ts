import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { CapabilityLevel } from '@/types/app';

function calculateCapabilityLevel(score: number): CapabilityLevel {
  if (score >= 90) return 'expert';
  if (score >= 70) return 'proficient';
  if (score >= 50) return 'capable';
  if (score >= 30) return 'developing';
  return 'beginner';
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: scores, error } = await supabase
    .from('capability_scores')
    .select('*')
    .eq('user_id', user.id)
    .order('calculated_at', { ascending: false })
    .limit(1);

  if (error) return NextResponse.json({ error: 'Failed to fetch score' }, { status: 500 });
  return NextResponse.json({ data: scores?.[0] ?? null });
}

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Calculate capability score from user data
  const [
    { data: tools },
    { data: projects },
    { data: maintenance },
    { data: documents },
    { data: profile },
  ] = await Promise.all([
    supabase.from('toolbox_items').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('projects').select('id, status', { count: 'exact' }).eq('user_id', user.id),
    supabase.from('maintenance_tasks').select('id, last_completed_at').eq('user_id', user.id).eq('is_dismissed', false),
    supabase.from('documents').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('profiles').select('*').eq('id', user.id).single(),
  ]);

  const toolCount = tools?.length ?? 0;
  const toolReadiness = Math.min(Math.round((toolCount / 20) * 100), 100);

  const completedProjects = projects?.filter((p) => p.status === 'completed')?.length ?? 0;
  const repairExperience = Math.min(Math.round((completedProjects / 10) * 100), 100);

  const totalMaintenance = maintenance?.length ?? 0;
  const completedMaintenance = maintenance?.filter((m) => m.last_completed_at)?.length ?? 0;
  const maintenanceCompletion = totalMaintenance > 0 ? Math.round((completedMaintenance / totalMaintenance) * 100) : 0;

  const docCount = documents?.length ?? 0;
  const documentationScore = Math.min(Math.round((docCount / 10) * 100), 100);

  const hasEmergencyTools = toolCount >= 10;
  const hasMaintPlan = totalMaintenance >= 5;
  const emergencyPreparedness = (hasEmergencyTools ? 50 : 0) + (hasMaintPlan ? 50 : 0);

  const overall = Math.round(
    toolReadiness * 0.2 +
    repairExperience * 0.25 +
    maintenanceCompletion * 0.25 +
    documentationScore * 0.15 +
    emergencyPreparedness * 0.15
  );

  const suggestions: string[] = [];
  if (toolReadiness < 50) suggestions.push('Add more tools to your toolbox to improve readiness');
  if (repairExperience < 30) suggestions.push('Complete more DIY projects to build experience');
  if (maintenanceCompletion < 50) suggestions.push('Stay on top of maintenance tasks');
  if (documentationScore < 30) suggestions.push('Upload receipts and warranties for your home');

  const score = {
    user_id: user.id,
    overall_score: overall,
    tool_readiness: toolReadiness,
    repair_experience: repairExperience,
    maintenance_completion: maintenanceCompletion,
    documentation_score: documentationScore,
    emergency_preparedness: emergencyPreparedness,
    capability_level: calculateCapabilityLevel(overall),
    suggestions: JSON.stringify(suggestions),
    calculated_at: new Date().toISOString(),
  };

  const { data: saved, error } = await supabase
    .from('capability_scores')
    .insert(score)
    .select()
    .single();

  if (error) return NextResponse.json({ error: 'Failed to save score' }, { status: 500 });
  return NextResponse.json(saved);
}
