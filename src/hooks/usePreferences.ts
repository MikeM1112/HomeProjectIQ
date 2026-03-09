import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePreferencesStore } from '@/stores/preferencesStore';
import { QUERY_KEYS } from '@/lib/constants';
import type { CurrencyCode, UnitSystem } from '@/lib/global';

interface PreferencesUpdate {
  locale?: string;
  currency?: CurrencyCode;
  units?: UnitSystem;
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();
  const setAll = usePreferencesStore((s) => s.setAll);

  return useMutation({
    mutationFn: async (updates: PreferencesUpdate) => {
      const res = await fetch('/api/user/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update preferences');
      return res.json();
    },
    onSuccess: (_data, variables) => {
      // Update local store immediately
      setAll(variables);
      // Invalidate user query to refetch profile
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER] });
    },
  });
}
