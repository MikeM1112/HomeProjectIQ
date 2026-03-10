'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  generateShoppingList, getBestStore, getStoreTotals, formatPrice,
  STORES, type ShoppingListItem, type Store,
} from '@/lib/shopping';
import type { DiagnosisResult } from '@/types/app';

interface ShoppingListProps {
  diagnosis: DiagnosisResult;
}

export function ShoppingList({ diagnosis }: ShoppingListProps) {
  const items = useMemo(() => generateShoppingList(diagnosis), [diagnosis]);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [filterStore, setFilterStore] = useState<string | null>(null);
  const [groupByStore, setGroupByStore] = useState(false);

  const bestStore = useMemo(() => getBestStore(items), [items]);
  const storeTotals = useMemo(() => getStoreTotals(items), [items]);

  const toggleCheck = (name: string) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const filteredItems = filterStore
    ? items.filter(item => item.storePrices.some(sp => sp.store.id === filterStore && sp.available))
    : items;

  const totalCost = filteredItems.reduce((sum, item) => {
    if (filterStore) {
      const sp = item.storePrices.find(p => p.store.id === filterStore);
      return sum + (sp?.price || item.pr);
    }
    return sum + item.pr;
  }, 0);

  return (
    <div className="space-y-4">
      {/* Best store recommendation */}
      {bestStore?.hasAll && (
        <Card className="glass glass-sm shadow-[var(--card-shadow)] border-l-4" style={{ borderLeftColor: bestStore.store.color }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{bestStore.store.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink">
                {bestStore.store.name} has everything
              </p>
              <p className="text-xs text-ink-sub">
                All {items.length} items available — {formatPrice(bestStore.total)} total
              </p>
            </div>
            <span className="tag bg-success-soft text-success text-[11px]">Best</span>
          </div>
        </Card>
      )}

      {/* Store filter pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        <button
          onClick={() => setFilterStore(null)}
          className={`tag pressable whitespace-nowrap ${!filterStore ? 'gradient-accent text-white' : 'bg-surface-3 text-ink-sub'}`}
        >
          All Stores
        </button>
        {STORES.map((store) => (
          <button
            key={store.id}
            onClick={() => setFilterStore(store.id === filterStore ? null : store.id)}
            className={`tag pressable whitespace-nowrap ${
              filterStore === store.id ? 'text-white' : 'text-ink-sub'
            }`}
            style={filterStore === store.id ? { background: store.color } : { background: 'var(--surface-3)' }}
          >
            {store.icon} {store.name}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="space-y-2">
        {filteredItems.map((item, i) => {
          const isChecked = checkedItems.has(item.n);
          const storePrice = filterStore
            ? item.storePrices.find(sp => sp.store.id === filterStore)
            : item.storePrices.find(sp => sp.isCheapest);
          const displayPrice = storePrice?.price || item.pr;

          return (
            <Card
              key={i}
              className={`glass glass-sm shadow-[var(--card-shadow)] pressable ${isChecked ? 'opacity-50' : ''}`}
              onClick={() => toggleCheck(item.n)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-[10px] border-2 flex items-center justify-center transition-all ${
                  isChecked ? 'bg-success border-success' : 'border-border'
                }`}>
                  {isChecked && <span className="text-white text-xs">{'\u2713'}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isChecked ? 'line-through text-ink-dim' : 'text-ink'}`}>
                    {item.n}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-ink-dim">{item.sz}</span>
                    {storePrice && (
                      <span
                        className="tag text-[10px] text-white"
                        style={{ background: storePrice.store.color, padding: '1px 6px' }}
                      >
                        {storePrice.store.name}
                      </span>
                    )}
                    <span className={`text-[10px] ${
                      item.stock === 'In Stock' ? 'text-success' : 'text-warning'
                    }`}>
                      {item.stock}
                    </span>
                  </div>
                </div>
                <p className="text-sm font-semibold text-ink">{formatPrice(displayPrice)}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Sticky total */}
      <div className="glass glass-sm shadow-[var(--card-shadow)] flex items-center justify-between sticky bottom-0 rounded-[20px]">
        <div>
          <p className="text-xs text-ink-dim">
            {checkedItems.size}/{filteredItems.length} items checked
          </p>
          <p className="text-lg font-bold text-ink">{formatPrice(totalCost)}</p>
        </div>
        <Button size="sm">Share List</Button>
      </div>
    </div>
  );
}
