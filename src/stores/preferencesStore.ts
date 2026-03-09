import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CurrencyCode, UnitSystem } from '@/lib/global';

interface PreferencesState {
  locale: string;
  currency: CurrencyCode;
  units: UnitSystem;
  setLocale: (locale: string) => void;
  setCurrency: (currency: CurrencyCode) => void;
  setUnits: (units: UnitSystem) => void;
  setAll: (prefs: { locale?: string; currency?: CurrencyCode; units?: UnitSystem }) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      locale: 'en',
      currency: 'USD',
      units: 'imperial',
      setLocale: (locale) => set({ locale }),
      setCurrency: (currency) => set({ currency }),
      setUnits: (units) => set({ units }),
      setAll: (prefs) =>
        set((state) => ({
          locale: prefs.locale ?? state.locale,
          currency: prefs.currency ?? state.currency,
          units: prefs.units ?? state.units,
        })),
    }),
    {
      name: 'hpiq-preferences',
    }
  )
);
