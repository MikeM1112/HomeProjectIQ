import { z } from 'zod';
import { CATEGORIES } from '@/lib/project-data';

const validCategoryIds = CATEGORIES.map((c) => c.id);

export const createLogbookEntrySchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be under 100 characters'),
  category_id: z.string().refine((val) => validCategoryIds.includes(val), {
    message: 'Please select a valid category',
  }),
  repair_date: z.string().min(1, 'Date is required'),
  labor_type: z.enum(['diy', 'hired_pro', 'warranty'], {
    required_error: 'Please select a labor type',
  }),
  cost: z.number().int().nonnegative('Cost cannot be negative').optional(),
  notes: z.string().max(1000, 'Notes must be under 1,000 characters').optional(),
});

export type CreateLogbookEntryInput = z.infer<typeof createLogbookEntrySchema>;
