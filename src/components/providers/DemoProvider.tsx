'use client';

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { DemoContext } from '@/hooks/useDemo';
import { DemoBanner } from '@/components/demo/DemoBanner';
import { QUERY_KEYS } from '@/lib/constants';
import {
  DEMO_USER,
  DEMO_PROJECTS,
  DEMO_LOGBOOK,
  DEMO_TOOLBOX,
  DEMO_LEADERBOARD,
  DEMO_API_ROUTES,
} from '@/lib/demo-data';

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const patchedRef = useRef(false);

  // Seed React Query cache on mount
  useEffect(() => {
    queryClient.setQueryData([QUERY_KEYS.USER], DEMO_USER);
    queryClient.setQueryData([QUERY_KEYS.PROJECTS], DEMO_PROJECTS);
    queryClient.setQueryData([QUERY_KEYS.LOGBOOK], DEMO_LOGBOOK);
    queryClient.setQueryData([QUERY_KEYS.TOOLBOX], DEMO_TOOLBOX);
    queryClient.setQueryData([QUERY_KEYS.FLAGS], []);
    queryClient.setQueryData([QUERY_KEYS.FRIENDS], DEMO_LEADERBOARD);
  }, [queryClient]);

  // Intercept fetch calls to /api/* so hooks/mutations work
  useEffect(() => {
    if (patchedRef.current) return;
    patchedRef.current = true;

    const originalFetch = window.fetch;

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;

      if (url.startsWith('/api/')) {
        // For POST/PATCH/DELETE, return success with current data
        if (init?.method && init.method !== 'GET') {
          const routeData = DEMO_API_ROUTES[url] ?? { success: true };
          return new Response(JSON.stringify(routeData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        // For GET, return mock data
        // Handle parameterized routes like /api/logbook/[id]
        const basePath = Object.keys(DEMO_API_ROUTES).find(
          (route) => url === route || url.startsWith(route + '/')
        );
        const data = basePath ? DEMO_API_ROUTES[basePath] : { data: [] };

        return new Response(JSON.stringify(data), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return originalFetch(input, init);
    };

    return () => {
      window.fetch = originalFetch;
      patchedRef.current = false;
    };
  }, []);

  return (
    <DemoContext.Provider value={{ isDemo: true }}>
      <DemoBanner />
      <div className="pt-[41px]">
        {children}
      </div>
    </DemoContext.Provider>
  );
}
