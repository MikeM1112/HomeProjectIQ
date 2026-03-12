import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createZoneSchema } from '@/lib/validations/property';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: zones, error } = await supabase
    .from('property_zones')
    .select('*')
    .eq('property_id', id)
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: 'Failed to fetch zones' }, { status: 500 });
  return NextResponse.json({ data: zones });
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

  const parsed = createZoneSchema.safeParse({ ...body as Record<string, unknown>, property_id: id });
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { data: zone, error } = await supabase
    .from('property_zones')
    .insert(parsed.data)
    .select()
    .single();

  if (error) return NextResponse.json({ error: 'Failed to create zone' }, { status: 500 });
  return NextResponse.json(zone);
}
