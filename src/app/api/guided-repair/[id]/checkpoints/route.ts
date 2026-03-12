import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createCheckpointSchema, updateCheckpointSchema } from '@/lib/validations/guided-repair';
import { XP_VALUES } from '@/lib/constants';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: checkpoints, error } = await supabase
    .from('step_checkpoints')
    .select('*')
    .eq('session_id', id)
    .order('step_number', { ascending: true });

  if (error) return NextResponse.json({ error: 'Failed to fetch checkpoints' }, { status: 500 });
  return NextResponse.json({ data: checkpoints });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = createCheckpointSchema.safeParse({ ...body as Record<string, unknown>, session_id: id });
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { data: checkpoint, error } = await supabase
    .from('step_checkpoints')
    .insert(parsed.data)
    .select()
    .single();

  if (error) return NextResponse.json({ error: 'Failed to create checkpoint' }, { status: 500 });
  return NextResponse.json(checkpoint);
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { checkpoint_id, ...updateData } = body as Record<string, unknown>;
  if (!checkpoint_id || typeof checkpoint_id !== 'string') {
    return NextResponse.json({ error: 'checkpoint_id required' }, { status: 400 });
  }

  const parsed = updateCheckpointSchema.safeParse(updateData);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const updatePayload: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.ai_validation_status === 'passed') {
    updatePayload.completed_at = new Date().toISOString();
  }

  const { data: checkpoint, error } = await supabase
    .from('step_checkpoints')
    .update(updatePayload)
    .eq('id', checkpoint_id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: 'Failed to update checkpoint' }, { status: 500 });

  if (parsed.data.ai_validation_status === 'passed') {
    await supabase.rpc('increment_xp', { p_user_id: user.id, p_amount: XP_VALUES.GUIDED_STEP_COMPLETE });
  }

  return NextResponse.json(checkpoint);
}
