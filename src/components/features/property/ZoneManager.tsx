'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { usePropertyZones } from '@/hooks/useProperties';
import type { ZoneType } from '@/types/app';

const ZONE_OPTIONS: { id: ZoneType; label: string; icon: string }[] = [
  { id: 'interior', label: 'Interior', icon: '🏠' },
  { id: 'exterior', label: 'Exterior', icon: '🏡' },
  { id: 'garage', label: 'Garage', icon: '🚗' },
  { id: 'yard', label: 'Yard', icon: '🌳' },
  { id: 'roof', label: 'Roof', icon: '🏗️' },
  { id: 'basement', label: 'Basement', icon: '🔦' },
  { id: 'attic', label: 'Attic', icon: '📦' },
];

export function ZoneManager({ propertyId }: { propertyId: string }) {
  const { zones, isLoading, createZone, isCreating } = usePropertyZones(propertyId);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [zoneType, setZoneType] = useState<ZoneType>('interior');

  const handleAdd = async () => {
    if (!name.trim()) return;
    await createZone({ property_id: propertyId, name: name.trim(), zone_type: zoneType });
    setName('');
    setShowAdd(false);
  };

  if (isLoading) return <div className="text-[var(--text-sub)] text-sm">Loading zones...</div>;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[var(--text)]">Zones</h3>
        <Button size="sm" variant="secondary" onClick={() => setShowAdd(!showAdd)}>+ Add Zone</Button>
      </div>

      {showAdd && (
        <Card padding="sm">
          <input type="text" placeholder="Zone name (e.g., Kitchen)" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 rounded-lg bg-[var(--glass)] border border-[var(--glass-border)] text-[var(--text)] text-sm placeholder:text-[var(--text-sub)] mb-2" />
          <div className="flex flex-wrap gap-1.5 mb-2">
            {ZONE_OPTIONS.map((z) => (
              <button key={z.id} onClick={() => setZoneType(z.id)} className={`px-2 py-1 rounded-lg text-xs border transition-colors ${zoneType === z.id ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]' : 'border-[var(--glass-border)] text-[var(--text-sub)]'}`}>
                {z.icon} {z.label}
              </button>
            ))}
          </div>
          <Button size="sm" loading={isCreating} onClick={handleAdd}>Add</Button>
        </Card>
      )}

      {zones.length === 0 ? (
        <p className="text-sm text-[var(--text-sub)]">No zones added yet</p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {zones.map((zone) => (
            <Card key={zone.id} padding="sm">
              <span className="text-lg">{ZONE_OPTIONS.find((z) => z.id === zone.zone_type)?.icon ?? '📍'}</span>
              <p className="text-sm font-medium text-[var(--text)]">{zone.name}</p>
              <p className="text-xs text-[var(--text-sub)] capitalize">{zone.zone_type}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
