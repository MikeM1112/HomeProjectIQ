import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimiters } from '@/lib/rate-limit';
import {
  filterTasksForHome,
  calculateNextDueDate,
  type HomeProfile,
} from '@/lib/maintenance';

/**
 * GET /api/maintenance — List user's maintenance tasks with due status
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch user's maintenance tasks
  const { data: tasks, error } = await supabase
    .from('maintenance_tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('next_due_at', { ascending: true });

  if (error) {
    console.error('Failed to fetch maintenance tasks:', error.message);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }

  // Fetch home profile
  const { data: homeProfile } = await supabase
    .from('home_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return NextResponse.json({
    tasks: tasks ?? [],
    homeProfile: homeProfile ?? null,
    isSetup: (tasks ?? []).length > 0,
  });
}

/**
 * POST /api/maintenance — Initialize maintenance tasks for user based on home profile
 */
export async function POST(request: Request) {
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

  let body: HomeProfile;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Upsert home profile
  const { error: profileError } = await supabase
    .from('home_profiles')
    .upsert({
      user_id: user.id,
      home_type: body.homeType,
      home_age: body.homeAge,
      heating_type: body.heatingType,
      has_ac: body.hasAC,
      has_chimney: body.hasChimney,
      has_septic: body.hasSeptic,
      has_sump_pump: body.hasSumpPump,
      has_garage: body.hasGarage,
      has_deck: body.hasDeck,
      has_yard: body.hasYard,
      setup_completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

  if (profileError) {
    console.error('Failed to upsert home profile:', profileError.message);
    return NextResponse.json({ error: 'Failed to save home profile' }, { status: 500 });
  }

  // Filter applicable tasks
  const applicableTasks = filterTasksForHome(body);

  // Delete existing tasks and re-create
  await supabase
    .from('maintenance_tasks')
    .delete()
    .eq('user_id', user.id);

  // Prepare task rows
  const now = new Date();
  const taskRows = applicableTasks.map((task) => ({
    user_id: user.id,
    task_id: task.id,
    title: task.title,
    category: task.category,
    frequency: task.frequency,
    season: task.season,
    importance: task.importance,
    next_due_at: calculateNextDueDate(task.frequency, now).toISOString(),
    is_dismissed: false,
  }));

  const { data: created, error: insertError } = await supabase
    .from('maintenance_tasks')
    .insert(taskRows)
    .select();

  if (insertError) {
    console.error('Failed to create maintenance tasks:', insertError.message);
    return NextResponse.json({ error: 'Failed to create tasks' }, { status: 500 });
  }

  return NextResponse.json({
    tasks: created ?? [],
    count: (created ?? []).length,
  });
}
