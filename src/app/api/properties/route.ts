import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createPropertySchema, createHouseholdSchema } from '@/lib/validations/property';
import { XP_VALUES } from '@/lib/constants';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Get household memberships first
  const { data: memberships } = await supabase
    .from('household_members')
    .select('household_id')
    .eq('user_id', user.id);

  if (!memberships?.length) {
    return NextResponse.json({ data: [], households: [] });
  }

  const householdIds = memberships.map((m) => m.household_id);

  const [{ data: households }, { data: properties }] = await Promise.all([
    supabase.from('households').select('*').in('id', householdIds),
    supabase.from('properties').select('*').in('household_id', householdIds).order('created_at', { ascending: false }),
  ]);

  return NextResponse.json({ data: properties ?? [], households: households ?? [] });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // If no household_id provided, create a default household
  const input = body as Record<string, unknown>;
  if (!input.household_id) {
    const householdParsed = createHouseholdSchema.safeParse({ name: input.name || 'My Home' });
    if (!householdParsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { data: household, error: hError } = await supabase
      .from('households')
      .insert({ name: householdParsed.data.name, created_by: user.id })
      .select()
      .single();

    if (hError) return NextResponse.json({ error: 'Failed to create household' }, { status: 500 });

    await supabase.from('household_members').insert({
      household_id: household.id,
      user_id: user.id,
      role: 'owner',
    });

    input.household_id = household.id;
  }

  const parsed = createPropertySchema.safeParse(input);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
  }

  const { data: property, error } = await supabase
    .from('properties')
    .insert(parsed.data)
    .select()
    .single();

  if (error) return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });

  await supabase.rpc('increment_xp', { p_user_id: user.id, p_amount: XP_VALUES.PROPERTY_SETUP });

  return NextResponse.json(property);
}
