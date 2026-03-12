import { z } from 'zod';

export const createHouseholdSchema = z.object({
  name: z.string().min(1).max(100),
});

export const createPropertySchema = z.object({
  household_id: z.string().uuid(),
  name: z.string().min(1).max(200),
  address: z.string().max(500).optional().nullable(),
  home_type: z.string().min(1).default('single_family'),
  year_built: z.number().int().min(1800).max(2100).optional().nullable(),
  square_footage: z.number().int().positive().optional().nullable(),
  lot_size_sqft: z.number().int().positive().optional().nullable(),
  floors: z.number().int().min(1).max(10).optional().nullable(),
  bedrooms: z.number().int().min(0).optional().nullable(),
  bathrooms: z.number().min(0).optional().nullable(),
});

export const updatePropertySchema = z.object({
  name: z.string().min(1).max(200).optional(),
  address: z.string().max(500).optional().nullable(),
  home_type: z.string().min(1).optional(),
  year_built: z.number().int().min(1800).max(2100).optional().nullable(),
  square_footage: z.number().int().positive().optional().nullable(),
  lot_size_sqft: z.number().int().positive().optional().nullable(),
  floors: z.number().int().min(1).max(10).optional().nullable(),
  bedrooms: z.number().int().min(0).optional().nullable(),
  bathrooms: z.number().min(0).optional().nullable(),
});

export const createZoneSchema = z.object({
  property_id: z.string().uuid(),
  name: z.string().min(1).max(100),
  zone_type: z.enum(['interior', 'exterior', 'garage', 'yard', 'roof', 'basement', 'attic']).default('interior'),
  floor_number: z.number().int().optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

export const createSystemSchema = z.object({
  property_id: z.string().uuid(),
  name: z.string().min(1).max(200),
  system_type: z.enum(['hvac', 'plumbing', 'electrical', 'roofing', 'foundation', 'appliance', 'exterior', 'interior', 'landscaping', 'security', 'other']),
  brand: z.string().max(200).optional().nullable(),
  model: z.string().max(200).optional().nullable(),
  install_date: z.string().optional().nullable(),
  warranty_expiry: z.string().optional().nullable(),
  expected_lifespan_years: z.number().int().positive().optional().nullable(),
  condition: z.enum(['excellent', 'good', 'fair', 'poor', 'critical']).default('good'),
  notes: z.string().max(2000).optional().nullable(),
});

export const updateSystemSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  brand: z.string().max(200).optional().nullable(),
  model: z.string().max(200).optional().nullable(),
  install_date: z.string().optional().nullable(),
  warranty_expiry: z.string().optional().nullable(),
  expected_lifespan_years: z.number().int().positive().optional().nullable(),
  condition: z.enum(['excellent', 'good', 'fair', 'poor', 'critical']).optional(),
  last_serviced_at: z.string().optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

export type CreateHouseholdInput = z.infer<typeof createHouseholdSchema>;
export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
export type CreateZoneInput = z.infer<typeof createZoneSchema>;
export type CreateSystemInput = z.infer<typeof createSystemSchema>;
export type UpdateSystemInput = z.infer<typeof updateSystemSchema>;
