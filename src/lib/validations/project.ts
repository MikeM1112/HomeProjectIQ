import { z } from 'zod';

export const createProjectSchema = z.object({
  category_id: z.string().min(1, 'Category is required'),
  title: z.string().min(1, 'Title is required').max(200),
  intake_answers: z.record(z.string()).default({}),
});

export const updateProjectSchema = z.object({
  status: z
    .enum(['planning', 'in_progress', 'completed', 'hired_pro'])
    .optional(),
  actual_cost: z.number().int().nonnegative().optional().nullable(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
