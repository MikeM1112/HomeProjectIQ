'use client';

import { useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { generateShoppingList, getStoreTotals, formatPrice, STORES } from '@/lib/shopping';
import type { DiagnosisResult } from '@/types/app';

export function StoreComparison({ diagnosis }: { diagnosis: DiagnosisResult }) {
  const items = useMemo(() => generateShoppingList(diagnosis), [diagnosis]);
  const totals = useMemo(() => getStoreTotals(items), [items]);

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-serif font-bold text-ink">Price Comparison</h3>
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-sm" style={{ minWidth: STORES.length * 90 + 160 }}>
          <thead>
            <tr>
              <th className="text-left text-xs text-ink-dim font-medium py-2 pr-2 sticky left-0 bg-surface-base z-10">Product</th>
              {STORES.map(store => (
                <th key={store.id} className="text-center text-[10px] font-semibold py-2 px-1" style={{ color: store.color }}>
                  {store.icon}<br />{store.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-t border-border">
                <td className="text-xs text-ink py-2 pr-2 sticky left-0 bg-surface-base z-10 max-w-[120px] truncate">{item.n}</td>
                {STORES.map(store => {
                  const sp = item.storePrices.find(p => p.store.id === store.id);
                  if (!sp?.available) {
                    return <td key={store.id} className="text-center text-[10px] text-ink-dim py-2">--</td>;
                  }
                  return (
                    <td key={store.id} className={`text-center text-xs py-2 ${sp.isCheapest ? 'text-success font-bold' : 'text-ink-sub'}`}>
                      {formatPrice(sp.price)}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr className="border-t-2 border-brand">
              <td className="text-sm font-bold text-ink py-2 pr-2 sticky left-0 bg-surface-base z-10">Total</td>
              {STORES.map(store => {
                const t = totals.find(tt => tt.store.id === store.id);
                const isLowest = t && t.hasAll && t.total === Math.min(...totals.filter(x => x.hasAll).map(x => x.total));
                return (
                  <td key={store.id} className={`text-center text-sm font-bold py-2 ${isLowest ? 'text-success' : 'text-ink'}`}>
                    {t ? formatPrice(t.total) : '--'}
                    {t?.hasAll && <span className="block text-[8px] text-success">{'\u2713'} All items</span>}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
