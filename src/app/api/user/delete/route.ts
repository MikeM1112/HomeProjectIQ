import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function DELETE() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = createAdminClient();

  // Delete user data in order (respecting foreign key constraints)
  // Logbook entries, toolbox, projects, then profile — cascading deletes
  // should handle most, but be explicit for safety
  await admin.from('logbook_entries').delete().eq('user_id', user.id);
  await admin.from('toolbox_items').delete().eq('user_id', user.id);
  await admin.from('projects').delete().eq('user_id', user.id);
  await admin.from('profiles').delete().eq('id', user.id);

  // Delete the auth user (requires admin/service role)
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    console.error('Failed to delete auth user:', error.message);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
