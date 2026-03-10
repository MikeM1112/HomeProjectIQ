'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { generateShoppingList, getAisleGuide, formatPrice, STORES } from '@/lib/shopping';
import type { DiagnosisResult } from '@/types/app';

export function AisleGuide({ diagnosis }: { diagnosis: DiagnosisResult }) {
  const items = useMemo(() => generateShoppingList(diagnosis), [diagnosis]);
  const [selectedStore, setSelectedStore] = useState(STORES[0].id);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const aisles = useMemo(() => getAisleGuide(selectedStore, items), [selectedStore, items]);
  const store = STORES.find(s => s.id === selectedStore)!;

  const toggleCheck = (name: string) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const totalItems = aisles.reduce((s, a) => s + a.items.length, 0);
  const checkedCount = checkedItems.size;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-serif font-bold text-ink">Aisle Guide</h3>
        <span className="text-xs text-ink-dim">{checkedCount}/{totalItems} found</span>
      </div>

      {/* Store selector */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {STORES.map(s => (
          <button
            key={s.id}
            onClick={() => { setSelectedStore(s.id); setCheckedItems(new Set()); }}
            className={`tag pressable whitespace-nowrap ${selectedStore === s.id ? 'text-white' : 'text-ink-sub bg-surface-3'}`}
            style={selectedStore === s.id ? { background: s.color } : undefined}
          >
            {s.icon} {s.name}
          </button>
        ))}
      </div>

      {/* Aisle list */}
      {aisles.map((aisle, i) => (
        <Card key={i} className="glass glass-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: store.color, color: 'white' }}>
              {aisle.aisle}
            </span>
            <span className="text-sm font-semibold text-ink">{aisle.department}</span>
          </div>
          <div className="space-y-1.5">
            {aisle.items.map((item, j) => {
              const isChecked = checkedItems.has(item.n);
              return (
                <button
                  key={j}
                  onClick={() => toggleCheck(item.n)}
                  className="flex items-center gap-2 w-full text-left pressable"
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    isChecked ? 'bg-success border-success' : 'border-border'
                  }`}>
                    {isChecked && <span className="text-white text-[10px]">{'\u2713'}</span>}
                  </div>
                  <span className={`flex-1 text-sm ${isChecked ? 'line-through text-ink-dim' : 'text-ink'}`}>
                    {item.n}
                  </span>
                  <span className="text-xs text-ink-dim">{formatPrice(item.pr)}</span>
                </button>
              );
            })}
          </div>
        </Card>
      ))}

      {aisles.length === 0 && (
        <p className="text-sm text-ink-dim text-center py-8">No items available at this store</p>
      )}
    </div>
  );
}
