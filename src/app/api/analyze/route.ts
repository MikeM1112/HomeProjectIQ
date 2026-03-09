import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { DIAGNOSES, CATEGORIES } from '@/lib/project-data';
import { XP_VALUES } from '@/lib/constants';
import { rateLimiters } from '@/lib/rate-limit';
import { z } from 'zod';

const analyzeSchema = z.object({
  category_id: z.string().min(1),
  intake_answers: z.record(z.string()).default({}).refine(
    (obj) => Object.keys(obj).length <= 10,
    { message: 'Too many intake answers' }
  ),
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
  const limit = Math.min(Number(searchParams.get('limit')) || 50, 100);
  const offset = Math.max(Number(searchParams.get('offset')) || 0, 0);

  const { data: projects, error, count } = await supabase
    .from('projects')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }

  return NextResponse.json({ data: projects, total: count ?? 0, limit, offset });
}

export async function POST(request: Request) {
  // Rate limit by IP for anonymous users
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const rateResult = rateLimiters.analyze(ip);
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

  const parsed = analyzeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', code: 'VALIDATION_ERROR' },
      { status: 400 }
    );
  }

  const { category_id, intake_answers } = parsed.data;
  const diagnosis = DIAGNOSES[category_id];

  if (!diagnosis) {
    return NextResponse.json(
      { error: 'Category not found', code: 'NOT_FOUND' },
      { status: 404 }
    );
  }

  const category = CATEGORIES.find((c) => c.id === category_id);
  let confidence = diagnosis.conf;

  // Apply confidence modifiers based on intake answers
  const answerValues = Object.values(intake_answers);
  for (const answer of answerValues) {
    const lower = answer.toLowerCase();
    if (lower.includes('no experience') || lower.includes('never')) {
      confidence = Math.max(0, confidence - 10);
    }
    if (lower.includes('experienced') || lower.includes('done before')) {
      confidence = Math.min(100, confidence + 5);
    }
  }

  let verdict: 'diy_easy' | 'diy_caution' | 'hire_pro';
  if (confidence >= 85) verdict = 'diy_easy';
  else if (confidence >= 70) verdict = 'diy_caution';
  else verdict = 'hire_pro';

  // Create project if authenticated
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: existingProjects } = await supabase
      .from('projects')
      .select('id')
      .eq('user_id', user.id);

    const isFirstProject = !existingProjects || existingProjects.length === 0;
    const xpAwarded = isFirstProject
      ? XP_VALUES.FIRST_PROJECT
      : XP_VALUES.PROJECT_COMPLETE;

    // Atomic: insert project + award XP in single database transaction
    const { error: rpcError } = await supabase.rpc('create_project_with_xp', {
      p_user_id: user.id,
      p_category_id: category_id,
      p_title: diagnosis.title,
      p_confidence: confidence,
      p_verdict: verdict,
      p_intake_answers: intake_answers,
      p_estimated_diy_lo: diagnosis.diy.lo,
      p_estimated_diy_hi: diagnosis.diy.hi,
      p_estimated_pro_lo: diagnosis.pro.lo,
      p_estimated_pro_hi: diagnosis.pro.hi,
      p_xp_amount: xpAwarded,
    });

    if (rpcError) {
      console.error('Failed to create project with XP:', rpcError.message);
    }
  }

  return NextResponse.json({
    ...diagnosis,
    conf: confidence,
    category: category?.label ?? category_id,
  });
}
