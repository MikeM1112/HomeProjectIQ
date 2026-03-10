'use client';

import { createContext, useContext } from 'react';

export interface DemoContextValue {
  isDemo: boolean;
}

export const DemoContext = createContext<DemoContextValue>({ isDemo: false });

export function useDemo() {
  const ctx = useContext(DemoContext);
  return { isDemo: ctx.isDemo };
}

/** Prefix a path with /demo when in demo mode */
export function useDemoPath(path: string) {
  const { isDemo } = useDemo();
  return isDemo ? `/demo${path}` : path;
}
