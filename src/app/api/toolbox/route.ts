import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { XP_VALUES } from '@/lib/constants';
import { checkAndAwardBadges } from '@/lib/badges';
import { updateStreak } from '@/lib/streaks';
import { z } from 'zod';

const addToolSchema = z.object({
  tool_id: z.string().min(1),
  tool_name: z.string().min(1),
  category: z.string().min(1),
});

const removeToolSchema = z.object({
  tool_id: z.string().min(1),
});

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get('limit')) || 100, 200);
  const offset = Math.max(Number(searchParams.get('offset')) || 0, 0);

  const { data: items, error, count } = await supabase
    .from('toolbox_items')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .order('added_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch toolbox' }, { status: 500 });
  }

  return NextResponse.json({ data: items, total: count ?? 0, limit, offset });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON', code: 'PARSE_ERROR' }, { status: 400 });
  }

  const parsed = addToolSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', code: 'VALIDATION_ERROR' },
      { status: 400 }
    );
  }

  // Check if tool already exists before upserting
  const { data: existing } = await supabase
    .from('toolbox_items')
    .select('id')
    .eq('user_id', user.id)
    .eq('tool_id', parsed.data.tool_id)
    .maybeSingle();

  const isNewTool = !existing;

  const { data: item, error } = await supabase
    .from('toolbox_items')
    .upsert(
      {
        user_id: user.id,
        tool_id: parsed.data.tool_id,
        tool_name: parsed.data.tool_name,
        category: parsed.data.category,
      },
      { onConflict: 'user_id,tool_id' }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: 'Failed to add tool' }, { status: 500 });
  }

  // Only award XP on first add, not re-adds
  let newBadges: string[] = [];
  if (isNewTool) {
    const { error: xpError } = await supabase.rpc('increment_xp', { p_user_id: user.id, p_amount: XP_VALUES.TOOL_ADDED });
    if (xpError) {
      console.error('Failed to award toolbox XP:', xpError.message);
    }

    // Award badges + update streak
    [newBadges] = await Promise.all([
      checkAndAwardBadges(supabase, user.id).catch(() => [] as string[]),
      updateStreak(supabase, user.id).catch(() => 0),
    ]);
  }

  return NextResponse.json({ ...item, newBadges });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let deleteBody: unknown;
  try {
    deleteBody = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON', code: 'PARSE_ERROR' }, { status: 400 });
  }

  const parsed = removeToolSchema.safeParse(deleteBody);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', code: 'VALIDATION_ERROR' },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from('toolbox_items')
    .delete()
    .eq('user_id', user.id)
    .eq('tool_id', parsed.data.tool_id);

  if (error) {
    return NextResponse.json({ error: 'Failed to remove tool' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
