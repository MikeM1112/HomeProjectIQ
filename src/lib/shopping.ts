import type { DiagnosisResult, ShopItem } from '@/types/app';

export interface Store {
  id: string;
  name: string;
  color: string;
  icon: string;
  baseUrl: string;
}

export interface AisleInfo {
  aisle: string;
  department: string;
  items: ShopItem[];
}

export interface StorePrice {
  store: Store;
  price: number;
  available: boolean;
  isCheapest: boolean;
}

export interface ShoppingListItem extends ShopItem {
  checked: boolean;
  storePrices: StorePrice[];
}

export interface StoreTotal {
  store: Store;
  total: number;
  itemCount: number;
  hasAll: boolean;
}

export interface OptimizerResult {
  strategy: string;
  description: string;
  stores: Store[];
  total: number;
  savings: number;
}

export const STORES: Store[] = [
  { id: 'homedepot', name: 'Home Depot', color: '#F96305', icon: '\u{1F3E0}', baseUrl: 'https://www.homedepot.com' },
  { id: 'lowes', name: "Lowe's", color: '#004990', icon: '\u{1F527}', baseUrl: 'https://www.lowes.com' },
  { id: 'amazon', name: 'Amazon', color: '#FF9900', icon: '\u{1F4E6}', baseUrl: 'https://www.amazon.com' },
  { id: 'ace', name: 'Ace Hardware', color: '#D40000', icon: '\u{1F6E0}\uFE0F', baseUrl: 'https://www.acehardware.com' },
  { id: 'menards', name: 'Menards', color: '#2B6B2B', icon: '\u{1FAB5}', baseUrl: 'https://www.menards.com' },
];

const AISLE_MAP: Record<string, { aisle: string; department: string }> = {
  'drywall': { aisle: 'Aisle 12', department: 'Building Materials' },
  'compound': { aisle: 'Aisle 12', department: 'Building Materials' },
  'spackle': { aisle: 'Aisle 12', department: 'Building Materials' },
  'paint': { aisle: 'Aisle 15', department: 'Paint' },
  'primer': { aisle: 'Aisle 15', department: 'Paint' },
  'brush': { aisle: 'Aisle 15', department: 'Paint' },
  'roller': { aisle: 'Aisle 15', department: 'Paint' },
  'tape': { aisle: 'Aisle 15', department: 'Paint' },
  'sandpaper': { aisle: 'Aisle 13', department: 'Tools' },
  'knife': { aisle: 'Aisle 13', department: 'Tools' },
  'saw': { aisle: 'Aisle 10', department: 'Tools' },
  'pipe': { aisle: 'Aisle 7', department: 'Plumbing' },
  'faucet': { aisle: 'Aisle 7', department: 'Plumbing' },
  'fitting': { aisle: 'Aisle 7', department: 'Plumbing' },
  'valve': { aisle: 'Aisle 7', department: 'Plumbing' },
  'wire': { aisle: 'Aisle 8', department: 'Electrical' },
  'outlet': { aisle: 'Aisle 8', department: 'Electrical' },
  'switch': { aisle: 'Aisle 8', department: 'Electrical' },
  'bulb': { aisle: 'Aisle 8', department: 'Electrical' },
  'screw': { aisle: 'Aisle 11', department: 'Hardware' },
  'nail': { aisle: 'Aisle 11', department: 'Hardware' },
  'anchor': { aisle: 'Aisle 11', department: 'Hardware' },
  'tile': { aisle: 'Aisle 18', department: 'Flooring' },
  'grout': { aisle: 'Aisle 18', department: 'Flooring' },
  'caulk': { aisle: 'Aisle 14', department: 'Adhesives & Sealants' },
  'adhesive': { aisle: 'Aisle 14', department: 'Adhesives & Sealants' },
  'filter': { aisle: 'Aisle 6', department: 'HVAC' },
  'wood': { aisle: 'Aisle 20', department: 'Lumber' },
  'stain': { aisle: 'Aisle 16', department: 'Stains & Finishes' },
  'seal': { aisle: 'Aisle 16', department: 'Stains & Finishes' },
  'concrete': { aisle: 'Aisle 22', department: 'Concrete & Masonry' },
  'mortar': { aisle: 'Aisle 22', department: 'Concrete & Masonry' },
};

function mockStorePrice(basePrice: number, storeId: string): number {
  // Deterministic pseudo-random price variance per store
  const hash = storeId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const variance = ((hash % 30) - 15) / 100; // -15% to +15%
  return Math.round(basePrice * (1 + variance));
}

function mockAvailability(storeId: string, itemName: string): boolean {
  // Most items available at most stores; small random unavailability
  const hash = (storeId + itemName).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return hash % 10 !== 0; // 90% availability
}

export function generateShoppingList(diagnosis: DiagnosisResult): ShoppingListItem[] {
  return diagnosis.shop.map((item) => {
    const storePrices = STORES.map((store) => ({
      store,
      price: mockStorePrice(item.pr, store.id + item.n),
      available: mockAvailability(store.id, item.n),
      isCheapest: false,
    }));
    // Mark cheapest
    const available = storePrices.filter(sp => sp.available);
    if (available.length > 0) {
      const min = Math.min(...available.map(sp => sp.price));
      available.forEach(sp => { sp.isCheapest = sp.price === min; });
    }
    return { ...item, checked: false, storePrices };
  });
}

export function getStoreTotals(items: ShoppingListItem[]): StoreTotal[] {
  return STORES.map((store) => {
    let total = 0;
    let count = 0;
    let hasAll = true;
    items.forEach((item) => {
      const sp = item.storePrices.find(p => p.store.id === store.id);
      if (sp?.available) {
        total += sp.price;
        count++;
      } else {
        hasAll = false;
      }
    });
    return { store, total, itemCount: count, hasAll };
  });
}

export function getBestStore(items: ShoppingListItem[]): StoreTotal | null {
  const totals = getStoreTotals(items);
  // Prefer stores that have everything, then lowest price
  const complete = totals.filter(t => t.hasAll).sort((a, b) => a.total - b.total);
  if (complete.length > 0) return complete[0];
  return totals.sort((a, b) => b.itemCount - a.itemCount || a.total - b.total)[0] || null;
}

export function getAisleGuide(storeId: string, items: ShoppingListItem[]): AisleInfo[] {
  const groups: Record<string, AisleInfo> = {};
  items.forEach((item) => {
    const sp = item.storePrices.find(p => p.store.id === storeId);
    if (!sp?.available) return;
    const nameLower = item.n.toLowerCase();
    let mapped = { aisle: 'Aisle 1', department: 'General' };
    for (const [keyword, info] of Object.entries(AISLE_MAP)) {
      if (nameLower.includes(keyword)) { mapped = info; break; }
    }
    const key = mapped.aisle;
    if (!groups[key]) groups[key] = { ...mapped, items: [] };
    groups[key].items.push(item);
  });
  return Object.values(groups).sort((a, b) => {
    const numA = parseInt(a.aisle.replace(/\D/g, '')) || 0;
    const numB = parseInt(b.aisle.replace(/\D/g, '')) || 0;
    return numA - numB;
  });
}

export function getOptimizerResults(items: ShoppingListItem[]): OptimizerResult[] {
  const totals = getStoreTotals(items);
  const best = getBestStore(items);
  const cheapestPerItem = items.reduce((sum, item) => {
    const available = item.storePrices.filter(sp => sp.available);
    if (available.length === 0) return sum;
    return sum + Math.min(...available.map(sp => sp.price));
  }, 0);

  const results: OptimizerResult[] = [];

  if (best?.hasAll) {
    results.push({
      strategy: 'One-Stop Shop',
      description: `${best.store.name} has everything you need`,
      stores: [best.store],
      total: best.total,
      savings: 0,
    });
  }

  results.push({
    strategy: 'Lowest Cost',
    description: 'Shop multiple stores for the best price on each item',
    stores: STORES.filter(s => items.some(i => i.storePrices.find(sp => sp.store.id === s.id && sp.isCheapest))),
    total: cheapestPerItem,
    savings: best ? best.total - cheapestPerItem : 0,
  });

  // Balanced: pick top 2 cheapest stores
  const top2 = totals.sort((a, b) => a.total - b.total).slice(0, 2);
  if (top2.length >= 2) {
    results.push({
      strategy: 'Best Balance',
      description: `${top2[0].store.name} + ${top2[1].store.name} for coverage and price`,
      stores: top2.map(t => t.store),
      total: Math.round((top2[0].total + top2[1].total) / 2),
      savings: best ? Math.round(best.total * 0.08) : 0,
    });
  }

  return results;
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
