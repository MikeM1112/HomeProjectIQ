import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { XP_VALUES } from '@/lib/constants';

const outcomeSchema = z.object({
  outcome_status: z.enum(['success', 'partial', 'failed']),
  outcome_actual_cost: z.number().nonnegative().optional().nullable(),
  outcome_actual_hours: z.number().nonnegative().optional().nullable(),
  outcome_difficulty: z.enum(['easier', 'as_expected', 'harder']).optional().nullable(),
  outcome_complications: z.string().max(2000).optional().nullable(),
  outcome_would_diy_again: z.boolean().optional().nullable(),
});

export type OutcomeInput = z.infer<typeof outcomeSchema>;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON', code: 'PARSE_ERROR' }, { status: 400 });
  }

  const parsed = outcomeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Verify project exists and user owns it
  const { data: project } = await supabase
    .from('projects')
    .select('user_id')
    .eq('id', id)
    .single();

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  if (project.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Atomic: update outcome + award XP in single database transaction
  const { data: result, error: rpcError } = await supabase.rpc('submit_outcome_with_xp', {
    p_user_id: user.id,
    p_project_id: id,
    p_outcome_status: parsed.data.outcome_status,
    p_xp_amount: XP_VALUES.OUTCOME_FEEDBACK,
    p_outcome_actual_cost: parsed.data.outcome_actual_cost ?? null,
    p_outcome_actual_hours: parsed.data.outcome_actual_hours ?? null,
    p_outcome_difficulty: parsed.data.outcome_difficulty ?? null,
    p_outcome_complications: parsed.data.outcome_complications ?? null,
    p_outcome_would_diy_again: parsed.data.outcome_would_diy_again ?? null,
  });

  if (rpcError) {
    console.error('Failed to submit outcome with XP:', rpcError.message);
    return NextResponse.json(
      { error: 'Failed to update outcome' },
      { status: 500 }
    );
  }

  // Fetch updated project
  const { data: updatedProject } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  const xpAwarded = (result as Record<string, number>)?.xp_awarded ?? 0;

  return NextResponse.json({
    project: updatedProject,
    xp_awarded: xpAwarded,
  });
}
