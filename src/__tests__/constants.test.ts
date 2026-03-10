import { describe, it, expect } from 'vitest';
import {
  ROUTES,
  XP_VALUES,
  LEVEL_THRESHOLDS,
  BADGE_DEFINITIONS,
  SKILL_TREES,
  TOOLS,
  QUERY_KEYS,
} from '@/lib/constants';

describe('ROUTES', () => {
  it('defines all required routes', () => {
    expect(ROUTES.HOME).toBe('/');
    expect(ROUTES.LOGIN).toBe('/login');
    expect(ROUTES.SIGNUP).toBe('/signup');
    expect(ROUTES.DASHBOARD).toBe('/dashboard');
    expect(ROUTES.ONBOARDING).toBe('/onboarding');
    expect(ROUTES.LOGBOOK).toBe('/logbook');
    expect(ROUTES.TOOLBOX).toBe('/toolbox');
    expect(ROUTES.ADMIN).toBe('/admin');
  });

  it('all routes start with /', () => {
    for (const route of Object.values(ROUTES)) {
      expect(route).toMatch(/^\//);
    }
  });
});

describe('XP_VALUES', () => {
  it('has positive values for all XP rewards', () => {
    for (const value of Object.values(XP_VALUES)) {
      expect(value).toBeGreaterThan(0);
    }
  });

  it('FIRST_PROJECT is the highest reward', () => {
    const max = Math.max(...Object.values(XP_VALUES));
    expect(XP_VALUES.FIRST_PROJECT).toBe(max);
  });

  it('has correct specific values', () => {
    expect(XP_VALUES.PROJECT_COMPLETE).toBe(50);
    expect(XP_VALUES.LOGBOOK_ENTRY).toBe(15);
    expect(XP_VALUES.FIRST_PROJECT).toBe(100);
    expect(XP_VALUES.TOOL_ADDED).toBe(5);
    expect(XP_VALUES.AI_ASSESSMENT).toBe(30);
  });
});

describe('LEVEL_THRESHOLDS', () => {
  it('has 5 levels', () => {
    expect(LEVEL_THRESHOLDS).toHaveLength(5);
  });

  it('levels are ordered and contiguous', () => {
    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
      expect(LEVEL_THRESHOLDS[i].level).toBe(i + 1);
      if (i > 0) {
        expect(LEVEL_THRESHOLDS[i].minXp).toBe(LEVEL_THRESHOLDS[i - 1].maxXp + 1);
      }
    }
  });

  it('starts at 0 and ends at Infinity', () => {
    expect(LEVEL_THRESHOLDS[0].minXp).toBe(0);
    expect(LEVEL_THRESHOLDS[4].maxXp).toBe(Infinity);
  });

  it('has labels for all levels', () => {
    const labels = LEVEL_THRESHOLDS.map((l) => l.label);
    expect(labels).toEqual(['Rookie', 'Apprentice', 'Handy', 'Skilled', 'Master']);
  });
});

describe('BADGE_DEFINITIONS', () => {
  it('has 10 badges', () => {
    expect(BADGE_DEFINITIONS).toHaveLength(10);
  });

  it('all badges have required fields', () => {
    for (const badge of BADGE_DEFINITIONS) {
      expect(badge.id).toBeTruthy();
      expect(badge.label).toBeTruthy();
      expect(badge.icon).toBeTruthy();
      expect(badge.condition).toBeTruthy();
    }
  });

  it('badge IDs are unique', () => {
    const ids = BADGE_DEFINITIONS.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('SKILL_TREES', () => {
  it('has 8 skill trees', () => {
    expect(SKILL_TREES).toHaveLength(8);
  });

  it('all skills have max level 5', () => {
    for (const skill of SKILL_TREES) {
      expect(skill.maxLevel).toBe(5);
    }
  });

  it('includes core home improvement skills', () => {
    const ids = SKILL_TREES.map((s) => s.id);
    expect(ids).toContain('plumbing');
    expect(ids).toContain('electrical');
    expect(ids).toContain('carpentry');
    expect(ids).toContain('hvac');
  });

  it('skill IDs are unique', () => {
    const ids = SKILL_TREES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('TOOLS', () => {
  it('has 40 tools', () => {
    expect(TOOLS).toHaveLength(40);
  });

  it('all tools have required fields', () => {
    for (const tool of TOOLS) {
      expect(tool.id).toBeTruthy();
      expect(tool.name).toBeTruthy();
      expect(tool.category).toBeTruthy();
      expect(tool.emoji).toBeTruthy();
    }
  });

  it('tool IDs are unique', () => {
    const ids = TOOLS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has tools in all 5 categories', () => {
    const categories = new Set(TOOLS.map((t) => t.category));
    expect(categories.size).toBe(5);
    expect(categories).toContain('Measuring');
    expect(categories).toContain('Hand Tools');
    expect(categories).toContain('Power Tools');
    expect(categories).toContain('Safety');
    expect(categories).toContain('Specialty');
  });
});

describe('QUERY_KEYS', () => {
  it('defines all required keys', () => {
    expect(QUERY_KEYS.USER).toBe('user');
    expect(QUERY_KEYS.PROJECTS).toBe('projects');
    expect(QUERY_KEYS.LOGBOOK).toBe('logbook');
    expect(QUERY_KEYS.TOOLBOX).toBe('toolbox');
    expect(QUERY_KEYS.FLAGS).toBe('flags');
  });
});
