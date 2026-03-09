import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Updates user streak based on last_active_at.
 * - Consecutive day: increment streak
 * - Same day: no-op
 * - Gap: reset to 1
 */
export async function updateStreak(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('streak, last_active_at')
    .eq('id', userId)
    .single();

  if (!profile) return 0;

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const lastActiveStr = profile.last_active_at
    ? new Date(profile.last_active_at).toISOString().slice(0, 10)
    : null;

  // Same day — no-op
  if (lastActiveStr === todayStr) {
    return profile.streak ?? 0;
  }

  let newStreak: number;

  if (lastActiveStr) {
    const lastDate = new Date(lastActiveStr);
    const today = new Date(todayStr);
    const diffMs = today.getTime() - lastDate.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Consecutive day
      newStreak = (profile.streak ?? 0) + 1;
    } else {
      // Gap — reset
      newStreak = 1;
    }
  } else {
    // First activity
    newStreak = 1;
  }

  await supabase
    .from('profiles')
    .update({ streak: newStreak, last_active_at: now.toISOString() })
    .eq('id', userId);

  return newStreak;
}
