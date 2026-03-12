import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PropertyDetailClient } from './PropertyDetailClient';

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  return <PropertyDetailClient propertyId={id} />;
}
