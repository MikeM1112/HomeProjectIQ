import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateAlertSchema } from '@/lib/validations/intelligence';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: alerts, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_dismissed', false)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
  return NextResponse.json({ data: alerts });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { alert_id, ...updateData } = body as Record<string, unknown>;
  if (!alert_id || typeof alert_id !== 'string') {
    return NextResponse.json({ error: 'alert_id required' }, { status: 400 });
  }

  const parsed = updateAlertSchema.safeParse(updateData);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { data: alert, error } = await supabase
    .from('alerts')
    .update(parsed.data)
    .eq('id', alert_id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: 'Failed to update alert' }, { status: 500 });
  return NextResponse.json(alert);
}
