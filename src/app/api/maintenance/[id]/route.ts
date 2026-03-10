import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimiters } from '@/lib/rate-limit';

const XP_MAINTENANCE_COMPLETE = 15;

/**
 * PATCH /api/maintenance/[id] — Mark complete, dismiss, or snooze a task
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rateResult = rateLimiters.general(user.id);
  if (!rateResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait.', code: 'RATE_LIMITED' },
      { status: 429 }
    );
  }

  const { id } = await params;

  let body: { action: 'complete' | 'dismiss' | 'snooze'; snooze_days?: number; notes?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { action, snooze_days, notes } = body;

  if (!action || !['complete', 'dismiss', 'snooze'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  // Verify ownership
  const { data: task } = await supabase
    .from('maintenance_tasks')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  if (action === 'complete') {
    // Use the atomic RPC function to complete + award XP
    const { data: result, error } = await supabase.rpc('complete_maintenance_task', {
      p_user_id: user.id,
      p_task_id: id,
      p_xp_amount: XP_MAINTENANCE_COMPLETE,
    });

    if (error) {
      console.error('Failed to complete maintenance task:', error.message);
      return NextResponse.json({ error: 'Failed to complete task' }, { status: 500 });
    }

    // Fetch updated task
    const { data: updated } = await supabase
      .from('maintenance_tasks')
      .select('*')
      .eq('id', id)
      .single();

    return NextResponse.json({
      task: updated,
      xp_awarded: XP_MAINTENANCE_COMPLETE,
      ...((result as Record<string, unknown>) ?? {}),
    });
  }

  if (action === 'dismiss') {
    const { error } = await supabase
      .from('maintenance_tasks')
      .update({
        is_dismissed: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Failed to dismiss task:', error.message);
      return NextResponse.json({ error: 'Failed to dismiss task' }, { status: 500 });
    }

    return NextResponse.json({ success: true, action: 'dismissed' });
  }

  if (action === 'snooze') {
    const days = snooze_days ?? 7;
    const snoozedUntil = new Date();
    snoozedUntil.setDate(snoozedUntil.getDate() + days);

    const { error } = await supabase
      .from('maintenance_tasks')
      .update({
        snoozed_until: snoozedUntil.toISOString(),
        next_due_at: snoozedUntil.toISOString(),
        notes: notes ?? task.notes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Failed to snooze task:', error.message);
      return NextResponse.json({ error: 'Failed to snooze task' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      action: 'snoozed',
      snoozed_until: snoozedUntil.toISOString(),
    });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
