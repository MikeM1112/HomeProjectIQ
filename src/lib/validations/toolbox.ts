import { z } from 'zod';

export const createLoanSchema = z.object({
  tool_id: z.string().min(1),
  tool_name: z.string().min(1),
  tool_emoji: z.string().min(1).default('🔧'),
  borrower_name: z.string().min(1, 'Borrower name is required').max(100),
  lent_date: z.string().optional(),
  due_date: z.string().nullable().optional(),
  notes: z.string().max(500).nullable().optional(),
});

export const updateLoanSchema = z.object({
  status: z.enum(['out', 'returned', 'overdue']).optional(),
  return_date: z.string().nullable().optional(),
  due_date: z.string().nullable().optional(),
  notes: z.string().max(500).nullable().optional(),
});
