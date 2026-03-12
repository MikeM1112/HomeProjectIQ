import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SocialClient } from './SocialClient';

export default async function SocialPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  return <SocialClient />;
}
