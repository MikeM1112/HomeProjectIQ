import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createTimelineEventSchema, updateTimelineEventSchema } from '@/lib/validations/timeline';

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get('limit')) || 50, 200);
  const offset = Math.max(Number(searchParams.get('offset')) || 0, 0);
  const propertyId = searchParams.get('property_id');

  let query = supabase
    .from('timeline_events')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .order('event_date', { ascending: false })
    .range(offset, offset + limit - 1);

  if (propertyId) query = query.eq('property_id', propertyId);

  const { data: events, error, count } = await query;
  if (error) return NextResponse.json({ error: 'Failed to fetch timeline' }, { status: 500 });
  return NextResponse.json({ data: events, total: count ?? 0, limit, offset });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = createTimelineEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { data: event, error } = await supabase
    .from('timeline_events')
    .insert({ ...parsed.data, user_id: user.id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  return NextResponse.json(event);
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { event_id, ...updateData } = body as Record<string, unknown>;
  if (!event_id || typeof event_id !== 'string') {
    return NextResponse.json({ error: 'event_id required' }, { status: 400 });
  }

  const parsed = updateTimelineEventSchema.safeParse(updateData);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { data: event, error } = await supabase
    .from('timeline_events')
    .update(parsed.data)
    .eq('id', event_id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  return NextResponse.json(event);
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { event_id } = body as Record<string, unknown>;
  if (!event_id || typeof event_id !== 'string') {
    return NextResponse.json({ error: 'event_id required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('timeline_events')
    .delete()
    .eq('id', event_id)
    .eq('user_id', user.id);

  if (error) return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  return NextResponse.json({ success: true });
}
