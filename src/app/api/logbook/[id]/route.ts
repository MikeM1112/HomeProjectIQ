import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  // Atomic: delete entry + reverse XP + reverse savings in single transaction
  const { data: deleted, error } = await supabase.rpc('delete_logbook_with_xp', {
    p_user_id: user.id,
    p_entry_id: id,
  });

  if (error) {
    console.error('Failed to delete logbook entry with XP:', error.message);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }

  if (!deleted) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
