import { describe, it, expect } from 'vitest';
import { loginSchema, signupSchema } from '@/lib/validations/auth';
import { createProjectSchema, updateProjectSchema } from '@/lib/validations/project';
import { createLogbookEntrySchema } from '@/lib/validations/logbook';

describe('loginSchema', () => {
  it('validates a correct login', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'secret123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'secret123',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing fields', () => {
    expect(loginSchema.safeParse({}).success).toBe(false);
    expect(loginSchema.safeParse({ email: 'test@example.com' }).success).toBe(false);
    expect(loginSchema.safeParse({ password: 'test' }).success).toBe(false);
  });
});

describe('signupSchema', () => {
  it('validates a correct signup', () => {
    const result = signupSchema.safeParse({
      display_name: 'Alex',
      email: 'alex@example.com',
      password: 'Secure1pass',
    });
    expect(result.success).toBe(true);
  });

  it('rejects short display name', () => {
    const result = signupSchema.safeParse({
      display_name: 'A',
      email: 'a@b.com',
      password: 'Secure1pass',
    });
    expect(result.success).toBe(false);
  });

  it('rejects password without uppercase', () => {
    const result = signupSchema.safeParse({
      display_name: 'Alex',
      email: 'alex@example.com',
      password: 'nouppercase1',
    });
    expect(result.success).toBe(false);
  });

  it('rejects password without lowercase', () => {
    const result = signupSchema.safeParse({
      display_name: 'Alex',
      email: 'alex@example.com',
      password: 'NOLOWERCASE1',
    });
    expect(result.success).toBe(false);
  });

  it('rejects password without number', () => {
    const result = signupSchema.safeParse({
      display_name: 'Alex',
      email: 'alex@example.com',
      password: 'NoNumberHere',
    });
    expect(result.success).toBe(false);
  });

  it('rejects password under 8 characters', () => {
    const result = signupSchema.safeParse({
      display_name: 'Alex',
      email: 'alex@example.com',
      password: 'Sh0rt',
    });
    expect(result.success).toBe(false);
  });
});

describe('createProjectSchema', () => {
  it('validates a valid project', () => {
    const result = createProjectSchema.safeParse({
      category_id: 'plumbing',
      title: 'Fix kitchen faucet',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty category_id', () => {
    const result = createProjectSchema.safeParse({
      category_id: '',
      title: 'Fix something',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty title', () => {
    const result = createProjectSchema.safeParse({
      category_id: 'plumbing',
      title: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects title over 200 chars', () => {
    const result = createProjectSchema.safeParse({
      category_id: 'plumbing',
      title: 'A'.repeat(201),
    });
    expect(result.success).toBe(false);
  });

  it('defaults intake_answers to empty object', () => {
    const result = createProjectSchema.safeParse({
      category_id: 'plumbing',
      title: 'Test',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.intake_answers).toEqual({});
    }
  });
});

describe('updateProjectSchema', () => {
  it('allows valid status values', () => {
    const statuses = ['planning', 'in_progress', 'completed', 'hired_pro'];
    for (const status of statuses) {
      const result = updateProjectSchema.safeParse({ status });
      expect(result.success).toBe(true);
    }
  });

  it('rejects invalid status', () => {
    const result = updateProjectSchema.safeParse({ status: 'invalid' });
    expect(result.success).toBe(false);
  });

  it('allows optional actual_cost as non-negative integer', () => {
    expect(updateProjectSchema.safeParse({ actual_cost: 0 }).success).toBe(true);
    expect(updateProjectSchema.safeParse({ actual_cost: 15000 }).success).toBe(true);
  });

  it('rejects negative actual_cost', () => {
    const result = updateProjectSchema.safeParse({ actual_cost: -100 });
    expect(result.success).toBe(false);
  });

  it('allows empty object (all fields optional)', () => {
    const result = updateProjectSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

describe('createLogbookEntrySchema', () => {
  it('validates a valid logbook entry', () => {
    const result = createLogbookEntrySchema.safeParse({
      title: 'Fixed the sink',
      category_id: 'plumbing',
      repair_date: '2026-03-10',
      labor_type: 'diy',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid category_id', () => {
    const result = createLogbookEntrySchema.safeParse({
      title: 'Test',
      category_id: 'nonexistent_category',
      repair_date: '2026-03-10',
      labor_type: 'diy',
    });
    expect(result.success).toBe(false);
  });

  it('validates all labor types', () => {
    const types = ['diy', 'hired_pro', 'warranty'];
    for (const labor_type of types) {
      const result = createLogbookEntrySchema.safeParse({
        title: 'Test',
        category_id: 'plumbing',
        repair_date: '2026-03-10',
        labor_type,
      });
      expect(result.success).toBe(true);
    }
  });

  it('rejects title over 100 chars', () => {
    const result = createLogbookEntrySchema.safeParse({
      title: 'A'.repeat(101),
      category_id: 'plumbing',
      repair_date: '2026-03-10',
      labor_type: 'diy',
    });
    expect(result.success).toBe(false);
  });

  it('rejects notes over 1000 chars', () => {
    const result = createLogbookEntrySchema.safeParse({
      title: 'Test',
      category_id: 'plumbing',
      repair_date: '2026-03-10',
      labor_type: 'diy',
      notes: 'A'.repeat(1001),
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative cost', () => {
    const result = createLogbookEntrySchema.safeParse({
      title: 'Test',
      category_id: 'plumbing',
      repair_date: '2026-03-10',
      labor_type: 'diy',
      cost: -500,
    });
    expect(result.success).toBe(false);
  });
});
