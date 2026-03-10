import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { XP_VALUES } from '@/lib/constants';
import { checkAndAwardBadges } from '@/lib/badges';
import { createLoanSchema } from '@/lib/validations/toolbox';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: loans, error } = await supabase
    .from('tool_loans')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch loans' }, { status: 500 });
  }

  return NextResponse.json({ data: loans });
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
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = createLoanSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { data: loan, error } = await supabase
    .from('tool_loans')
    .insert({
      user_id: user.id,
      tool_id: parsed.data.tool_id,
      tool_name: parsed.data.tool_name,
      tool_emoji: parsed.data.tool_emoji,
      borrower_name: parsed.data.borrower_name,
      lent_date: parsed.data.lent_date ?? new Date().toISOString(),
      due_date: parsed.data.due_date ?? null,
      notes: parsed.data.notes ?? null,
      status: 'out',
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: 'Failed to create loan' }, { status: 500 });
  }

  // Award XP for lending
  await supabase.rpc('increment_xp', {
    p_user_id: user.id,
    p_amount: XP_VALUES.TOOL_LENT,
  });

  let newBadges: string[] = [];
  try {
    newBadges = await checkAndAwardBadges(supabase, user.id);
  } catch {
    newBadges = [];
  }

  return NextResponse.json({ ...loan, newBadges });
}
