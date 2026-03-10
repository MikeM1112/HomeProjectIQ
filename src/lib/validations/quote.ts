import { z } from 'zod';

export const createQuoteSchema = z.object({
  project_id: z.string().uuid().optional().nullable(),
  title: z.string().min(1, 'Title is required').max(200),
  category_id: z.string().min(1, 'Category is required'),
  estimated_pro_lo: z.number().int().nonnegative().optional().nullable(),
  estimated_pro_hi: z.number().int().nonnegative().optional().nullable(),
  estimated_diy_lo: z.number().int().nonnegative().optional().nullable(),
  estimated_diy_hi: z.number().int().nonnegative().optional().nullable(),
  materials_json: z.array(z.unknown()).default([]),
  tools_json: z.array(z.unknown()).default([]),
  call_script: z.string().max(5000).default(''),
  zip_code: z.string().min(3, 'Zip code is required').max(10),
  preferred_timeline: z.enum(['asap', 'this_week', 'this_month', 'flexible']).default('flexible'),
  contact_preference: z.enum(['in_app', 'email', 'phone']).default('in_app'),
  contact_phone: z.string().max(20).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

export const updateQuoteSchema = z.object({
  status: z.enum(['cancelled']),
});

export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;
export type UpdateQuoteInput = z.infer<typeof updateQuoteSchema>;
