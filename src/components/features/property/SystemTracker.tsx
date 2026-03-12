'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { usePropertySystems } from '@/hooks/useProperties';
import { SystemComponentCard } from './SystemComponentCard';
import type { SystemType } from '@/types/app';

const SYSTEM_OPTIONS: { id: SystemType; label: string; icon: string }[] = [
  { id: 'hvac', label: 'HVAC', icon: '❄️' },
  { id: 'plumbing', label: 'Plumbing', icon: '🔧' },
  { id: 'electrical', label: 'Electrical', icon: '⚡' },
  { id: 'roofing', label: 'Roofing', icon: '🏠' },
  { id: 'foundation', label: 'Foundation', icon: '🧱' },
  { id: 'appliance', label: 'Appliance', icon: '🍳' },
  { id: 'exterior', label: 'Exterior', icon: '🏡' },
  { id: 'security', label: 'Security', icon: '🔒' },
  { id: 'landscaping', label: 'Landscaping', icon: '🌿' },
  { id: 'other', label: 'Other', icon: '📋' },
];

const CONDITION_COLORS: Record<string, string> = {
  excellent: 'text-green-400',
  good: 'text-emerald-400',
  fair: 'text-yellow-400',
  poor: 'text-orange-400',
  critical: 'text-red-400',
};

export function SystemTracker({ propertyId }: { propertyId: string }) {
  const { systems, isLoading, createSystem, isCreating } = usePropertySystems(propertyId);
  const [showAdd, setShowAdd] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', system_type: 'hvac' as SystemType, brand: '', condition: 'good' });

  const handleAdd = async () => {
    if (!form.name.trim()) return;
    await createSystem({
      property_id: propertyId,
      name: form.name.trim(),
      system_type: form.system_type,
      brand: form.brand || undefined,
      condition: form.condition,
    });
    setForm({ name: '', system_type: 'hvac', brand: '', condition: 'good' });
    setShowAdd(false);
  };

  if (isLoading) return <div className="text-[var(--text-sub)] text-sm">Loading systems...</div>;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[var(--text)]">Home Systems</h3>
        <Button size="sm" variant="secondary" onClick={() => setShowAdd(!showAdd)}>+ Add System</Button>
      </div>

      {showAdd && (
        <Card padding="sm">
          <div className="space-y-2">
            <input type="text" placeholder="System name (e.g., Central AC)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-2 rounded-lg bg-[var(--glass)] border border-[var(--glass-border)] text-[var(--text)] text-sm placeholder:text-[var(--text-sub)]" />
            <div className="flex flex-wrap gap-1.5">
              {SYSTEM_OPTIONS.map((s) => (
                <button key={s.id} onClick={() => setForm({ ...form, system_type: s.id })} className={`px-2 py-1 rounded-lg text-xs border transition-colors ${form.system_type === s.id ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]' : 'border-[var(--glass-border)] text-[var(--text-sub)]'}`}>
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
            <input type="text" placeholder="Brand (optional)" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="w-full p-2 rounded-lg bg-[var(--glass)] border border-[var(--glass-border)] text-[var(--text)] text-sm placeholder:text-[var(--text-sub)]" />
            <Button size="sm" loading={isCreating} onClick={handleAdd}>Add System</Button>
          </div>
        </Card>
      )}

      {systems.length === 0 ? (
        <p className="text-sm text-[var(--text-sub)]">No systems tracked yet</p>
      ) : (
        <div className="space-y-2">
          {systems.map((system) => {
            const opt = SYSTEM_OPTIONS.find((s) => s.id === system.system_type);
            return (
              <Card key={system.id} variant="interactive" padding="sm" onClick={() => setExpanded(expanded === system.id ? null : system.id)}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{opt?.icon ?? '📋'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--text)] truncate">{system.name}</p>
                    <div className="flex items-center gap-2 text-xs text-[var(--text-sub)]">
                      <span className="capitalize">{system.system_type}</span>
                      {system.brand && <span>· {system.brand}</span>}
                      <span className={`capitalize ${CONDITION_COLORS[system.condition]}`}>{system.condition}</span>
                    </div>
                  </div>
                  <span className="text-[var(--text-sub)] text-sm">{expanded === system.id ? '▲' : '▼'}</span>
                </div>
                {expanded === system.id && <SystemComponentCard system={system} />}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
