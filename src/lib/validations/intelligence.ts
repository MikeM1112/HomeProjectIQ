import { z } from 'zod';

export const updateAlertSchema = z.object({
  is_read: z.boolean().optional(),
  is_dismissed: z.boolean().optional(),
});

export const updateRecommendationSchema = z.object({
  is_completed: z.boolean().optional(),
  is_dismissed: z.boolean().optional(),
});

export const createHandyProfileSchema = z.object({
  display_name: z.string().min(1).max(100).optional().nullable(),
  bio: z.string().max(1000).optional().nullable(),
  skills: z.array(z.string()).max(20).optional(),
  is_available: z.boolean().optional(),
  neighborhood: z.string().max(200).optional().nullable(),
});

export const updateHandyProfileSchema = z.object({
  display_name: z.string().min(1).max(100).optional().nullable(),
  bio: z.string().max(1000).optional().nullable(),
  skills: z.array(z.string()).max(20).optional(),
  is_available: z.boolean().optional(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  neighborhood: z.string().max(200).optional().nullable(),
});

export type UpdateAlertInput = z.infer<typeof updateAlertSchema>;
export type UpdateRecommendationInput = z.infer<typeof updateRecommendationSchema>;
export type CreateHandyProfileInput = z.infer<typeof createHandyProfileSchema>;
export type UpdateHandyProfileInput = z.infer<typeof updateHandyProfileSchema>;
