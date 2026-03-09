'use server';

import { cookies } from 'next/headers';
import { locales } from './config';

const DEFAULT_LOCALE = 'en';
const COOKIE_NAME = 'NEXT_LOCALE';

export async function getUserLocale(): Promise<string> {
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  // Only return the locale if it's valid, otherwise fall back to default
  if (value && (locales as readonly string[]).includes(value)) {
    return value;
  }
  return DEFAULT_LOCALE;
}

export async function setUserLocale(locale: string): Promise<void> {
  if (!(locales as readonly string[]).includes(locale)) return;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, locale);
}
