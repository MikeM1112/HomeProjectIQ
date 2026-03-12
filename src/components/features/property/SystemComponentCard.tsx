'use client';

import type { HomeSystem } from '@/types/app';

export function SystemComponentCard({ system }: { system: HomeSystem }) {
  const age = system.install_date
    ? Math.round((Date.now() - new Date(system.install_date).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

  const warrantyActive = system.warranty_expiry
    ? new Date(system.warranty_expiry) > new Date()
    : false;

  return (
    <div className="mt-3 pt-3 border-t border-[var(--glass-border)] space-y-2 text-sm" onClick={(e) => e.stopPropagation()}>
      {system.model && (
        <div className="flex justify-between">
          <span className="text-[var(--text-sub)]">Model</span>
          <span className="text-[var(--text)]">{system.model}</span>
        </div>
      )}
      {age !== null && (
        <div className="flex justify-between">
          <span className="text-[var(--text-sub)]">Age</span>
          <span className="text-[var(--text)]">{age} years</span>
        </div>
      )}
      {system.expected_lifespan_years && (
        <div className="flex justify-between">
          <span className="text-[var(--text-sub)]">Expected Lifespan</span>
          <span className="text-[var(--text)]">{system.expected_lifespan_years} years</span>
        </div>
      )}
      {system.warranty_expiry && (
        <div className="flex justify-between">
          <span className="text-[var(--text-sub)]">Warranty</span>
          <span className={warrantyActive ? 'text-green-400' : 'text-[var(--text-sub)]'}>
            {warrantyActive ? 'Active' : 'Expired'} ({new Date(system.warranty_expiry).toLocaleDateString()})
          </span>
        </div>
      )}
      {system.last_serviced_at && (
        <div className="flex justify-between">
          <span className="text-[var(--text-sub)]">Last Serviced</span>
          <span className="text-[var(--text)]">{new Date(system.last_serviced_at).toLocaleDateString()}</span>
        </div>
      )}
      {system.notes && <p className="text-[var(--text-sub)] text-xs italic">{system.notes}</p>}
    </div>
  );
}
