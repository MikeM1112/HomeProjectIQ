import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { XP_VALUES } from '@/lib/constants';
import { checkAndAwardBadges } from '@/lib/badges';
import { updateLoanSchema } from '@/lib/validations/toolbox';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

  const parsed = updateLoanSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  // Check current status before updating
  const { data: existing } = await supabase
    .from('tool_loans')
    .select('status')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: 'Loan not found' }, { status: 404 });
  }

  const updateData: Record<string, unknown> = { ...parsed.data };
  const isMarkedReturned =
    parsed.data.status === 'returned' && existing.status !== 'returned';

  if (isMarkedReturned) {
    updateData.return_date = new Date().toISOString();
  }

  const { data: loan, error } = await supabase
    .from('tool_loans')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: 'Failed to update loan' }, { status: 500 });
  }

  // Award XP when marking as returned
  let newBadges: string[] = [];
  if (isMarkedReturned) {
    await supabase.rpc('increment_xp', {
      p_user_id: user.id,
      p_amount: XP_VALUES.TOOL_RETURNED,
    });

    try {
      newBadges = await checkAndAwardBadges(supabase, user.id);
    } catch {
      newBadges = [];
    }
  }

  return NextResponse.json({ ...loan, newBadges });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase
    .from('tool_loans')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: 'Failed to delete loan' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
