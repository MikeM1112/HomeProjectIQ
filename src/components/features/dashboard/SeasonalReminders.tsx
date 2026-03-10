'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const SEASONAL_TASKS = {
  spring: [
    { emoji: '🌧️', task: 'Clean gutters & downspouts', category: 'Exterior', priority: 'high' },
    { emoji: '❄️', task: 'Inspect roof for winter damage', category: 'Exterior', priority: 'high' },
    { emoji: '🪟', task: 'Clean windows inside & out', category: 'Interior', priority: 'medium' },
    { emoji: '🌿', task: 'Prep garden beds & mulch', category: 'Landscaping', priority: 'medium' },
    { emoji: '🔧', task: 'Service HVAC — switch to cooling', category: 'HVAC', priority: 'high' },
    { emoji: '🚿', task: 'Check outdoor faucets for freeze damage', category: 'Plumbing', priority: 'medium' },
  ],
  summer: [
    { emoji: '🏠', task: 'Power wash siding & deck', category: 'Exterior', priority: 'medium' },
    { emoji: '🎨', task: 'Touch up exterior paint', category: 'Painting', priority: 'low' },
    { emoji: '🌡️', task: 'Replace HVAC filters', category: 'HVAC', priority: 'high' },
    { emoji: '🪳', task: 'Inspect for pests & seal entry points', category: 'Exterior', priority: 'medium' },
    { emoji: '💡', task: 'Check outdoor lighting & replace bulbs', category: 'Electrical', priority: 'low' },
    { emoji: '🚰', task: 'Test sump pump', category: 'Plumbing', priority: 'high' },
  ],
  fall: [
    { emoji: '🍂', task: 'Clean gutters after leaf fall', category: 'Exterior', priority: 'high' },
    { emoji: '🔥', task: 'Service furnace before winter', category: 'HVAC', priority: 'high' },
    { emoji: '🪵', task: 'Inspect & clean fireplace/chimney', category: 'Interior', priority: 'high' },
    { emoji: '🧊', task: 'Winterize outdoor faucets', category: 'Plumbing', priority: 'high' },
    { emoji: '🌬️', task: 'Seal windows & doors — check weatherstripping', category: 'Interior', priority: 'medium' },
    { emoji: '🔋', task: 'Test smoke & CO detectors', category: 'Safety', priority: 'high' },
  ],
  winter: [
    { emoji: '🧊', task: 'Prevent ice dams — check attic insulation', category: 'Exterior', priority: 'high' },
    { emoji: '🚿', task: 'Insulate exposed pipes', category: 'Plumbing', priority: 'high' },
    { emoji: '🔌', task: 'Check GFCI outlets', category: 'Electrical', priority: 'medium' },
    { emoji: '🛁', task: 'Re-caulk bathtub & shower', category: 'Plumbing', priority: 'medium' },
    { emoji: '🪤', task: 'Set rodent traps — check for entry points', category: 'Interior', priority: 'medium' },
    { emoji: '🧹', task: 'Deep clean dryer vent', category: 'Safety', priority: 'high' },
  ],
} as const;

function getCurrentSeason(): keyof typeof SEASONAL_TASKS {
  const month = new Date().getMonth(); // 0-11
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
}

const SEASON_META = {
  spring: { label: 'Spring', icon: '🌱', color: 'var(--emerald)' },
  summer: { label: 'Summer', icon: '☀️', color: 'var(--gold)' },
  fall: { label: 'Fall', icon: '🍂', color: 'var(--accent)' },
  winter: { label: 'Winter', icon: '❄️', color: 'var(--info)' },
};

export function SeasonalReminders() {
  const season = getCurrentSeason();
  const tasks = SEASONAL_TASKS[season];
  const meta = SEASON_META[season];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif text-lg" style={{ color: 'var(--text)' }}>
          {meta.icon} {meta.label} Maintenance
        </h3>
        <Badge variant="default">{tasks.length} tasks</Badge>
      </div>
      <div className="space-y-2">
        {tasks.map((task, i) => (
          <Card key={i} padding="sm">
            <div className="flex items-center gap-3">
              <span className="text-xl">{task.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{task.task}</p>
                <p className="text-xs" style={{ color: 'var(--text-dim)' }}>{task.category}</p>
              </div>
              <Badge variant={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'default'}>
                {task.priority}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
