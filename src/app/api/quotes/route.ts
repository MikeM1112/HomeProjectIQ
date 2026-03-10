import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createQuoteSchema } from '@/lib/validations/quote';
import type { Json } from '@/types/database';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('quote_requests')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = createQuoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { materials_json, tools_json, ...rest } = parsed.data;
  const { data: quote, error: insertError } = await supabase
    .from('quote_requests')
    .insert({
      user_id: user.id,
      ...rest,
      materials_json: materials_json as unknown as Json,
      tools_json: tools_json as unknown as Json,
    })
    .select()
    .single();

  if (insertError) {
    console.error('Failed to create quote request:', insertError.message);
    return NextResponse.json({ error: 'Failed to create quote request' }, { status: 500 });
  }

  // If linked to a project, update its status to hired_pro
  if (parsed.data.project_id) {
    await supabase
      .from('projects')
      .update({ status: 'hired_pro' })
      .eq('id', parsed.data.project_id)
      .eq('user_id', user.id);
  }

  return NextResponse.json({ data: quote }, { status: 201 });
}
