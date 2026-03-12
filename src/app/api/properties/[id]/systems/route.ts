import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createSystemSchema, updateSystemSchema } from '@/lib/validations/property';
import { XP_VALUES } from '@/lib/constants';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: systems, error } = await supabase
    .from('systems')
    .select('*, system_components(*)')
    .eq('property_id', id)
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: 'Failed to fetch systems' }, { status: 500 });
  return NextResponse.json({ data: systems });
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

  const parsed = createSystemSchema.safeParse({ ...body as Record<string, unknown>, property_id: id });
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { data: system, error } = await supabase
    .from('systems')
    .insert(parsed.data)
    .select()
    .single();

  if (error) return NextResponse.json({ error: 'Failed to create system' }, { status: 500 });

  await supabase.rpc('increment_xp', { p_user_id: user.id, p_amount: XP_VALUES.SYSTEM_ADDED });

  return NextResponse.json(system);
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { system_id, ...updateData } = body as Record<string, unknown>;
  if (!system_id || typeof system_id !== 'string') {
    return NextResponse.json({ error: 'system_id required' }, { status: 400 });
  }

  const parsed = updateSystemSchema.safeParse(updateData);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { data: system, error } = await supabase
    .from('systems')
    .update(parsed.data)
    .eq('id', system_id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: 'Failed to update system' }, { status: 500 });
  return NextResponse.json(system);
}
