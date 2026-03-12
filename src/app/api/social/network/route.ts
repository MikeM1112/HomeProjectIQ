import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Get accepted friendships
  const { data: friendships, error: fError } = await supabase
    .from('friendships')
    .select('*')
    .eq('status', 'accepted')
    .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

  if (fError) return NextResponse.json({ error: 'Failed to fetch network' }, { status: 500 });

  // Extract friend user IDs
  const friendIds = (friendships ?? []).map((f) =>
    f.requester_id === user.id ? f.addressee_id : f.requester_id
  );

  if (!friendIds.length) {
    return NextResponse.json({ data: { friends: [], borrowableTools: [] } });
  }

  // Get friend profiles and their toolbox items
  const [{ data: profiles }, { data: tools }] = await Promise.all([
    supabase.from('handy_profiles').select('*').in('user_id', friendIds),
    supabase.from('toolbox_items').select('*').in('user_id', friendIds),
  ]);

  // Check which tools the user doesn't own
  const { data: userTools } = await supabase
    .from('toolbox_items')
    .select('tool_id')
    .eq('user_id', user.id);

  const ownedToolIds = new Set((userTools ?? []).map((t) => t.tool_id));
  const borrowableTools = (tools ?? []).filter((t) => !ownedToolIds.has(t.tool_id));

  return NextResponse.json({
    data: {
      friends: profiles ?? [],
      borrowableTools,
    },
  });
}
