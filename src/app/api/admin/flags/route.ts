import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const updateFlagSchema = z.object({
  flag_name: z.string().min(1),
  is_enabled: z.boolean(),
});

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null, isAdmin: false };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  return {
    supabase,
    user,
    isAdmin: profile?.role === 'admin',
  };
}

export async function GET() {
  const { supabase, isAdmin } = await requireAdmin();

  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data: flags, error } = await supabase
    .from('feature_flags')
    .select('*')
    .order('flag_name');

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch flags' }, { status: 500 });
  }

  return NextResponse.json(flags);
}

export async function PATCH(request: Request) {
  const { supabase, user, isAdmin } = await requireAdmin();

  if (!isAdmin || !user) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON', code: 'PARSE_ERROR' }, { status: 400 });
  }

  const parsed = updateFlagSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', code: 'VALIDATION_ERROR' },
      { status: 400 }
    );
  }

  const { data: flag, error } = await supabase
    .from('feature_flags')
    .update({
      is_enabled: parsed.data.is_enabled,
      updated_by: user.id,
    })
    .eq('flag_name', parsed.data.flag_name)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: 'Failed to update flag' }, { status: 500 });
  }

  return NextResponse.json(flag);
}
