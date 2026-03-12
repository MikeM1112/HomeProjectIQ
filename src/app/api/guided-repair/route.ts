import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createSessionSchema, updateSessionSchema } from '@/lib/validations/guided-repair';
import { XP_VALUES } from '@/lib/constants';

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('project_id');

  let query = supabase
    .from('guided_sessions')
    .select('*, step_checkpoints(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (projectId) {
    query = query.eq('project_id', projectId);
  }

  const { data: sessions, error } = await query;
  if (error) return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  return NextResponse.json({ data: sessions });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = createSessionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { data: session, error } = await supabase
    .from('guided_sessions')
    .insert({ ...parsed.data, user_id: user.id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  return NextResponse.json(session);
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { session_id, ...updateData } = body as Record<string, unknown>;
  if (!session_id || typeof session_id !== 'string') {
    return NextResponse.json({ error: 'session_id required' }, { status: 400 });
  }

  const parsed = updateSessionSchema.safeParse(updateData);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const updatePayload: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.status === 'completed') {
    updatePayload.completed_at = new Date().toISOString();
  } else if (parsed.data.status === 'paused') {
    updatePayload.paused_at = new Date().toISOString();
  }

  const { data: session, error } = await supabase
    .from('guided_sessions')
    .update(updatePayload)
    .eq('id', session_id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });

  if (parsed.data.status === 'completed') {
    await supabase.rpc('increment_xp', { p_user_id: user.id, p_amount: XP_VALUES.GUIDED_SESSION_COMPLETE });
  }

  return NextResponse.json(session);
}
