import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { IntelligenceClient } from './IntelligenceClient';

export default async function IntelligencePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  return <IntelligenceClient />;
}
