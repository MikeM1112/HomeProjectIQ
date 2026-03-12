import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createHandyProfileSchema, updateHandyProfileSchema } from '@/lib/validations/intelligence';

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const neighborhood = searchParams.get('neighborhood');
  const myProfile = searchParams.get('me') === 'true';

  if (myProfile) {
    const { data: profile, error } = await supabase
      .from('handy_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    return NextResponse.json({ data: profile });
  }

  let query = supabase
    .from('handy_profiles')
    .select('*')
    .eq('is_available', true)
    .order('rating', { ascending: false });

  if (neighborhood) query = query.eq('neighborhood', neighborhood);

  const { data: profiles, error } = await query;
  if (error) return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });
  return NextResponse.json({ data: profiles });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = createHandyProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { data: profile, error } = await supabase
    .from('handy_profiles')
    .upsert({ ...parsed.data, user_id: user.id }, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
  return NextResponse.json(profile);
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = updateHandyProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { data: profile, error } = await supabase
    .from('handy_profiles')
    .update(parsed.data)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  return NextResponse.json(profile);
}
