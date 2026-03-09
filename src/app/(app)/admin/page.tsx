'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { useUser } from '@/hooks/useUser';
import { useFlags } from '@/hooks/useFlags';
import { useUIStore } from '@/stores/uiStore';
import { formatDate } from '@/lib/utils';

export default function AdminPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const { flags, isLoading: flagsLoading, toggleFlag, isToggling } = useFlags();
  const { showToast } = useUIStore();

  useEffect(() => {
    if (!userLoading && user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, userLoading, router]);

  if (userLoading || flagsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (user?.role !== 'admin') return null;

  const handleToggle = async (flagName: string, currentValue: boolean) => {
    try {
      await toggleFlag({ flag_name: flagName, is_enabled: !currentValue });
      showToast(`${flagName} ${!currentValue ? 'enabled' : 'disabled'}`, 'success');
    } catch {
      showToast('Failed to update flag', 'error');
    }
  };

  return (
    <>
      <Navbar title="Admin" showBack backHref="/dashboard" />
      <PageWrapper>
        <h2 className="font-serif text-xl mb-4">Feature Flags</h2>
        <div className="space-y-3">
          {flags.map((flag) => (
            <Card key={flag.id} padding="sm">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <code className="text-xs bg-surface-muted px-2 py-0.5 rounded font-mono">{flag.flag_name}</code>
                  {flag.description && (
                    <p className="text-xs text-ink-sub mt-1">{flag.description}</p>
                  )}
                  {flag.updated_at && (
                    <p className="text-[10px] text-ink-dim mt-0.5">Updated {formatDate(flag.updated_at)}</p>
                  )}
                </div>
                <button
                  onClick={() => handleToggle(flag.flag_name, flag.is_enabled)}
                  disabled={isToggling}
                  className={`relative w-11 h-6 rounded-full transition-colors ${flag.is_enabled ? 'bg-success' : 'bg-border'}`}
                  role="switch"
                  aria-checked={flag.is_enabled}
                  aria-label={`Toggle ${flag.flag_name}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${flag.is_enabled ? 'translate-x-5' : ''}`}
                  />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </PageWrapper>
    </>
  );
}
