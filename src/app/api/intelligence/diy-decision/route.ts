import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const diyDecisionSchema = z.object({
  project_id: z.string().uuid(),
  user_hourly_value: z.number().min(0).default(30),
});

type Recommendation = 'DIY' | 'HIRE_PRO' | 'CONSIDER_BOTH';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const parsed = diyDecisionSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { project_id, user_hourly_value } = parsed.data;

  // Get project with diagnosis data
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', project_id)
    .eq('user_id', user.id)
    .single();

  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

  // Get user profile for skill level
  const { data: profile } = await supabase
    .from('profiles')
    .select('xp, skills')
    .eq('id', user.id)
    .single();

  // Extract cost data from project columns
  const diyCostLow = project.estimated_diy_lo ?? 50;
  const diyCostHigh = project.estimated_diy_hi ?? 150;
  const proCostLow = project.estimated_pro_lo ?? 200;
  const proCostHigh = project.estimated_pro_hi ?? 500;
  const difficulty = project.confidence >= 85 ? 3 : project.confidence >= 70 ? 5 : 7;
  const estimatedHours = 2; // default estimate

  // Calculate user skill factor (0-1 based on XP and category skills)
  const userXp = profile?.xp ?? 0;
  const skillFactor = Math.min(userXp / 1000, 1);

  // Check tool readiness from project_required_tools table
  const { data: reqTools } = await supabase
    .from('project_required_tools')
    .select('tool_id')
    .eq('project_id', project_id);

  const requiredTools: string[] = (reqTools ?? []).map((t) => t.tool_id);
  const { data: toolboxItems } = await supabase
    .from('toolbox_items')
    .select('tool_id')
    .eq('user_id', user.id);

  const ownedToolIds = new Set((toolboxItems ?? []).map((t) => t.tool_id));
  const missingTools = requiredTools.filter((t) => !ownedToolIds.has(t));
  const estimatedToolCost = missingTools.length * 15; // rough avg $15/tool

  // DIY cost calculation
  const materialCost = (diyCostLow + diyCostHigh) / 2;
  const timeCost = estimatedHours * user_hourly_value;
  const totalDiyCost = materialCost + estimatedToolCost + timeCost;

  // Pro cost calculation
  const totalProCost = (proCostLow + proCostHigh) / 2;

  // Savings
  const savings = totalProCost - totalDiyCost;

  // Decision factors
  const costAdvantage = savings > 0;
  const hasSkill = skillFactor >= (difficulty / 10);
  const hasTools = missingTools.length <= 1;
  const isSafe = difficulty <= 7;

  // Determine recommendation
  let recommendation: Recommendation;
  let reasoning: string[] = [];

  if (!isSafe) {
    recommendation = 'HIRE_PRO';
    reasoning.push('High difficulty rating — professional recommended for safety');
  } else if (costAdvantage && hasSkill && hasTools) {
    recommendation = 'DIY';
    reasoning.push(`Estimated savings of $${Math.round(savings)}`);
    if (hasSkill) reasoning.push('Your skill level matches this repair');
    if (hasTools) reasoning.push('You have the necessary tools');
  } else if (costAdvantage && (!hasSkill || !hasTools)) {
    recommendation = 'CONSIDER_BOTH';
    if (!hasSkill) reasoning.push('This repair is above your current experience level');
    if (!hasTools) reasoning.push(`You're missing ${missingTools.length} tool(s)`);
    reasoning.push(`DIY could still save $${Math.round(savings)}`);
  } else {
    recommendation = 'HIRE_PRO';
    reasoning.push('Professional repair is more cost-effective for this job');
  }

  return NextResponse.json({
    recommendation,
    reasoning,
    diy_cost: {
      materials: Math.round(materialCost),
      tools: estimatedToolCost,
      time_value: Math.round(timeCost),
      total: Math.round(totalDiyCost),
    },
    pro_cost: {
      low: proCostLow,
      high: proCostHigh,
      average: Math.round(totalProCost),
    },
    savings: Math.round(savings),
    factors: {
      difficulty,
      skill_factor: Math.round(skillFactor * 100),
      tool_readiness: requiredTools.length > 0
        ? Math.round(((requiredTools.length - missingTools.length) / requiredTools.length) * 100)
        : 100,
      safety_ok: isSafe,
    },
  });
}
