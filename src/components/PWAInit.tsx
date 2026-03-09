'use client';

import { useEffect } from 'react';

export function PWAInit() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'activated') {
                  window.dispatchEvent(new CustomEvent('swUpdateAvailable'));
                }
              });
            }
          });
        })
        .catch((err) => {
          console.warn('SW registration failed:', err);
        });
    }

    const handleInstallPrompt = (e: Event) => {
      e.preventDefault();
      (window as unknown as Record<string, unknown>).deferredPrompt = e;
      window.dispatchEvent(new CustomEvent('pwaInstallReady'));
    };

    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    };
  }, []);

  return null;
}
