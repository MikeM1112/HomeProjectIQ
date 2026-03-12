import { z } from 'zod';

export const createSessionSchema = z.object({
  project_id: z.string().uuid(),
  total_steps: z.number().int().min(1).max(100),
  notes: z.string().max(2000).optional().nullable(),
});

export const updateSessionSchema = z.object({
  status: z.enum(['active', 'paused', 'completed', 'abandoned']).optional(),
  current_step: z.number().int().min(1).optional(),
  notes: z.string().max(2000).optional().nullable(),
});

export const createCheckpointSchema = z.object({
  session_id: z.string().uuid(),
  step_number: z.number().int().min(1),
  title: z.string().min(1).max(200),
  instructions: z.string().max(5000).optional().nullable(),
  photo_url: z.string().url().optional().nullable(),
});

export const updateCheckpointSchema = z.object({
  photo_url: z.string().url().optional().nullable(),
  ai_validation_status: z.enum(['pending', 'passed', 'failed', 'skipped']).optional(),
  ai_feedback: z.string().max(2000).optional().nullable(),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
export type CreateCheckpointInput = z.infer<typeof createCheckpointSchema>;
export type UpdateCheckpointInput = z.infer<typeof updateCheckpointSchema>;
