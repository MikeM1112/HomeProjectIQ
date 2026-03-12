import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const toolReadinessSchema = z.object({
  project_id: z.string().uuid(),
});

type ReadinessLevel = 'FULLY_READY' | 'PARTIALLY_READY' | 'NOT_READY';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const parsed = toolReadinessSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { project_id } = parsed.data;

  // Verify project belongs to user
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', project_id)
    .eq('user_id', user.id)
    .single();

  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

  // Get required tools from project_required_tools table
  const { data: reqTools } = await supabase
    .from('project_required_tools')
    .select('tool_id')
    .eq('project_id', project_id);

  const requiredTools: string[] = (reqTools ?? []).map((t) => t.tool_id);

  if (requiredTools.length === 0) {
    return NextResponse.json({
      readiness: 'FULLY_READY' as ReadinessLevel,
      owned: [],
      borrowable: [],
      missing: [],
      required: [],
    });
  }

  // Get user's toolbox
  const { data: toolboxItems } = await supabase
    .from('toolbox_items')
    .select('tool_id')
    .eq('user_id', user.id);

  const ownedToolIds = new Set((toolboxItems ?? []).map((t) => t.tool_id));

  // Get borrowable tools from social network
  const { data: friendshipsOut } = await supabase
    .from('friendships')
    .select('addressee_id')
    .eq('requester_id', user.id)
    .eq('status', 'accepted');

  const { data: friendshipsIn } = await supabase
    .from('friendships')
    .select('requester_id')
    .eq('addressee_id', user.id)
    .eq('status', 'accepted');

  const friendIds = [
    ...(friendshipsOut ?? []).map((f) => f.addressee_id),
    ...(friendshipsIn ?? []).map((f) => f.requester_id),
  ];
  let borrowableMap: Record<string, string[]> = {};

  if (friendIds.length > 0) {
    const { data: friendTools } = await supabase
      .from('toolbox_items')
      .select('tool_id, user_id, profiles!inner(display_name)')
      .in('user_id', friendIds)
      .eq('is_available', true);

    for (const ft of friendTools ?? []) {
      if (!borrowableMap[ft.tool_id]) borrowableMap[ft.tool_id] = [];
      const name = (ft as any).profiles?.display_name ?? 'Friend';
      borrowableMap[ft.tool_id].push(name);
    }
  }

  // Categorize each required tool
  const owned: string[] = [];
  const borrowable: { tool_id: string; from: string[] }[] = [];
  const missing: string[] = [];

  for (const toolId of requiredTools) {
    if (ownedToolIds.has(toolId)) {
      owned.push(toolId);
    } else if (borrowableMap[toolId]) {
      borrowable.push({ tool_id: toolId, from: borrowableMap[toolId] });
    } else {
      missing.push(toolId);
    }
  }

  // Determine readiness level
  let readiness: ReadinessLevel;
  if (missing.length === 0 && borrowable.length === 0) {
    readiness = 'FULLY_READY';
  } else if (missing.length === 0) {
    readiness = 'FULLY_READY';
  } else if (owned.length + borrowable.length > 0) {
    readiness = 'PARTIALLY_READY';
  } else {
    readiness = 'NOT_READY';
  }

  return NextResponse.json({
    readiness,
    required: requiredTools,
    owned,
    borrowable,
    missing,
    readiness_percent: Math.round(((owned.length + borrowable.length) / requiredTools.length) * 100),
  });
}
