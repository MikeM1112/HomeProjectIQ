'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';

export function PWAInit() {
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);

  useEffect(() => {
    // Register service worker
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

    // Handle install prompt
    const handleInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Check if user is in standalone mode (already installed)
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
        || (navigator as unknown as Record<string, boolean>).standalone === true;

      if (!isStandalone) {
        // Check if user has dismissed before
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (!dismissed) {
          setShowInstallBanner(true);
        }
      }
    };

    // Show install prompt if not standalone and not dismissed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || (navigator as unknown as Record<string, boolean>).standalone === true;

    if (!isStandalone) {
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        // Show banner after a short delay
        const timer = setTimeout(() => setShowInstallBanner(true), 2000);
        window.addEventListener('beforeinstallprompt', handleInstallPrompt);
        return () => {
          clearTimeout(timer);
          window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
        };
      }
    }

    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    };
  }, []);

  // Request geolocation on mount (for location-aware features)
  useEffect(() => {
    if ('geolocation' in navigator) {
      const geoGranted = localStorage.getItem('geo-granted');
      if (!geoGranted) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            localStorage.setItem('geo-granted', 'true');
            localStorage.setItem('geo-lat', String(pos.coords.latitude));
            localStorage.setItem('geo-lng', String(pos.coords.longitude));
          },
          () => {
            // User denied — that's fine, we just won't use location
          },
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
        );
      }
    }
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt && 'prompt' in deferredPrompt) {
      (deferredPrompt as { prompt: () => void }).prompt();
      setShowInstallBanner(false);
    } else {
      // iOS/Safari: show manual instructions
      setShowInstallBanner(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (!showInstallBanner) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 max-w-[480px] mx-auto animate-slideUp">
      <div className="glass rounded-2xl p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <span className="text-3xl">📱</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--ink)]">Add to Home Screen</p>
            <p className="text-xs text-[var(--ink-sub)] mt-0.5">
              Pin HomeProjectIQ for instant access — works offline too!
            </p>
          </div>
          <button onClick={handleDismiss} className="text-[var(--ink-dim)] text-lg" aria-label="Dismiss">
            &times;
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          <Button size="sm" onClick={handleInstall} className="flex-1">
            Install App
          </Button>
          <Button size="sm" variant="ghost" onClick={handleDismiss}>
            Later
          </Button>
        </div>
      </div>
    </div>
  );
}
