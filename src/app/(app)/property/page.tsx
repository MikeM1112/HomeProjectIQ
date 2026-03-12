import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PropertyListClient } from './PropertyListClient';

export default async function PropertyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  return <PropertyListClient />;
}
