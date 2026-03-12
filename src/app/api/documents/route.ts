import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createDocumentSchema, updateDocumentSchema } from '@/lib/validations/timeline';
import { XP_VALUES } from '@/lib/constants';
import type { DocumentType } from '@/types/app';

const VALID_DOC_TYPES = new Set<DocumentType>([
  'receipt', 'warranty', 'manual', 'inspection_report',
  'insurance', 'permit', 'contract', 'photo', 'other',
]);

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get('property_id');
  const docType = searchParams.get('type');

  let query = supabase
    .from('documents')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (propertyId) query = query.eq('property_id', propertyId);
  if (docType && VALID_DOC_TYPES.has(docType as DocumentType)) {
    query = query.eq('document_type', docType as DocumentType);
  }

  const { data: documents, error } = await query;
  if (error) return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  return NextResponse.json({ data: documents });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = createDocumentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { data: doc, error } = await supabase
    .from('documents')
    .insert({ ...parsed.data, user_id: user.id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });

  await supabase.rpc('increment_xp', { p_user_id: user.id, p_amount: XP_VALUES.DOCUMENT_UPLOADED });

  return NextResponse.json(doc);
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { document_id, ...updateData } = body as Record<string, unknown>;
  if (!document_id || typeof document_id !== 'string') {
    return NextResponse.json({ error: 'document_id required' }, { status: 400 });
  }

  const parsed = updateDocumentSchema.safeParse(updateData);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { data: doc, error } = await supabase
    .from('documents')
    .update(parsed.data)
    .eq('id', document_id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
  return NextResponse.json(doc);
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { document_id } = body as Record<string, unknown>;
  if (!document_id || typeof document_id !== 'string') {
    return NextResponse.json({ error: 'document_id required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', document_id)
    .eq('user_id', user.id);

  if (error) return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  return NextResponse.json({ success: true });
}
