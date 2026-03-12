import { z } from 'zod';

export const createTimelineEventSchema = z.object({
  property_id: z.string().uuid().optional().nullable(),
  project_id: z.string().uuid().optional().nullable(),
  event_type: z.enum(['repair', 'maintenance', 'inspection', 'purchase', 'warranty', 'incident', 'upgrade', 'other']),
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional().nullable(),
  cost: z.number().min(0).optional().nullable(),
  photo_urls: z.array(z.string().url()).max(10).optional(),
  event_date: z.string().optional(),
});

export const updateTimelineEventSchema = z.object({
  event_type: z.enum(['repair', 'maintenance', 'inspection', 'purchase', 'warranty', 'incident', 'upgrade', 'other']).optional(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional().nullable(),
  cost: z.number().min(0).optional().nullable(),
  photo_urls: z.array(z.string().url()).max(10).optional(),
  event_date: z.string().optional(),
});

export const createDocumentSchema = z.object({
  property_id: z.string().uuid().optional().nullable(),
  document_type: z.enum(['receipt', 'warranty', 'manual', 'inspection_report', 'insurance', 'permit', 'contract', 'photo', 'other']),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
  file_url: z.string().url(),
  file_type: z.string().max(100).optional().nullable(),
  file_size: z.number().int().positive().optional().nullable(),
  expires_at: z.string().optional().nullable(),
});

export const updateDocumentSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional().nullable(),
  document_type: z.enum(['receipt', 'warranty', 'manual', 'inspection_report', 'insurance', 'permit', 'contract', 'photo', 'other']).optional(),
  expires_at: z.string().optional().nullable(),
});

export type CreateTimelineEventInput = z.infer<typeof createTimelineEventSchema>;
export type UpdateTimelineEventInput = z.infer<typeof updateTimelineEventSchema>;
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
