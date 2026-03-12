import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateRecommendationSchema } from '@/lib/validations/intelligence';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: recommendations, error } = await supabase
    .from('recommendations')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_dismissed', false)
    .order('priority', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
  return NextResponse.json({ data: recommendations });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { recommendation_id, ...updateData } = body as Record<string, unknown>;
  if (!recommendation_id || typeof recommendation_id !== 'string') {
    return NextResponse.json({ error: 'recommendation_id required' }, { status: 400 });
  }

  const parsed = updateRecommendationSchema.safeParse(updateData);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { data: rec, error } = await supabase
    .from('recommendations')
    .update(parsed.data)
    .eq('id', recommendation_id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: 'Failed to update recommendation' }, { status: 500 });
  return NextResponse.json(rec);
}
