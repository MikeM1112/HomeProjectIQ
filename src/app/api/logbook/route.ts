import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createLogbookEntrySchema } from '@/lib/validations/logbook';
import { XP_VALUES } from '@/lib/constants';
import { rateLimiters } from '@/lib/rate-limit';

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get('limit')) || 50, 100);
  const offset = Math.max(Number(searchParams.get('offset')) || 0, 0);

  const { data: entries, error, count } = await supabase
    .from('logbook_entries')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .order('repair_date', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
  }

  return NextResponse.json({ data: entries, total: count ?? 0, limit, offset });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rateResult = rateLimiters.logbook(user.id);
  if (!rateResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait.', code: 'RATE_LIMITED' },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON', code: 'PARSE_ERROR' }, { status: 400 });
  }

  const parsed = createLogbookEntrySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', code: 'VALIDATION_ERROR' },
      { status: 400 }
    );
  }

  const xpAwarded = XP_VALUES.LOGBOOK_ENTRY;

  // Atomic: insert entry + award XP + update savings in single transaction
  const { data: entryId, error } = await supabase.rpc('create_logbook_with_xp', {
    p_user_id: user.id,
    p_title: parsed.data.title,
    p_category_id: parsed.data.category_id,
    p_repair_date: parsed.data.repair_date,
    p_labor_type: parsed.data.labor_type,
    p_xp_amount: xpAwarded,
    p_cost: parsed.data.cost ?? null,
    p_notes: parsed.data.notes ?? null,
  });

  if (error) {
    console.error('Failed to create logbook entry with XP:', error.message);
    return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 });
  }

  // Fetch the created entry to return it
  const { data: entry } = await supabase
    .from('logbook_entries')
    .select('*')
    .eq('id', entryId)
    .single();

  return NextResponse.json(entry);
}
