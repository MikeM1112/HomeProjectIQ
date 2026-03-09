import type { SupabaseClient } from '@supabase/supabase-js';
import { BADGE_DEFINITIONS, TOOLS } from '@/lib/constants';
import { CATEGORIES } from '@/lib/project-data';

/**
 * Checks and awards badges based on current user stats.
 * Returns array of newly earned badge IDs.
 */
export async function checkAndAwardBadges(
  supabase: SupabaseClient,
  userId: string
): Promise<string[]> {
  // Fetch current user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('badges, total_savings, streak, xp')
    .eq('id', userId)
    .single();

  if (!profile) return [];

  const currentBadges: string[] = profile.badges ?? [];
  const newBadges: string[] = [];

  // Fetch counts
  const [projectsRes, logbookRes, toolboxRes, categoriesRes] = await Promise.all([
    supabase.from('projects').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('logbook_entries').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('toolbox_items').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('projects').select('category_id').eq('user_id', userId),
  ]);

  const projectCount = projectsRes.count ?? 0;
  const logbookCount = logbookRes.count ?? 0;
  const toolCount = toolboxRes.count ?? 0;
  const uniqueCategories = new Set((categoriesRes.data ?? []).map((p) => p.category_id)).size;
  const totalCategories = CATEGORIES.length;

  // Check each badge condition
  const conditions: Record<string, boolean> = {
    first_project: projectCount >= 1,
    five_projects: projectCount >= 5,
    ten_projects: projectCount >= 10,
    saved_500: (profile.total_savings ?? 0) >= 50000, // cents
    saved_1000: (profile.total_savings ?? 0) >= 100000, // cents
    streak_7: (profile.streak ?? 0) >= 7,
    streak_30: (profile.streak ?? 0) >= 30,
    all_categories: uniqueCategories >= totalCategories,
    logbook_10: logbookCount >= 10,
    tools_20: toolCount >= 20,
  };

  for (const [badgeId, met] of Object.entries(conditions)) {
    if (met && !currentBadges.includes(badgeId)) {
      newBadges.push(badgeId);
    }
  }

  // Update profile with new badges
  if (newBadges.length > 0) {
    const updatedBadges = [...currentBadges, ...newBadges];
    await supabase
      .from('profiles')
      .update({ badges: updatedBadges })
      .eq('id', userId);
  }

  return newBadges;
}
