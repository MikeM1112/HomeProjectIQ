'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { useUser } from '@/hooks/useUser';
import { useUIStore } from '@/stores/uiStore';
import { createClient } from '@/lib/supabase/client';

export default function AccountPage() {
  const router = useRouter();
  const { user, isLoading, refetch } = useUser();
  const { showToast } = useUIStore();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  // Sync name state when user loads
  useEffect(() => {
    if (user?.display_name) {
      setName(user.display_name);
    }
  }, [user?.display_name]);

  const handleSaveName = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_name: name }),
      });
      if (res.ok) {
        showToast('Name updated', 'success');
        refetch();
      } else {
        showToast('Failed to update name', 'error');
      }
    } catch {
      showToast('Failed to update name', 'error');
    }
    setSaving(false);
  };

  const handleResetPassword = async () => {
    if (!user?.email) {
      showToast('No email address found', 'error');
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(user.email);
    if (!error) showToast('Password reset email sent', 'success');
    else showToast('Failed to send reset email', 'error');
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch('/api/user/delete', { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      showToast('Account deleted successfully.', 'success');
      setShowDelete(false);
      setDeleteConfirm('');
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
    } catch {
      showToast('Failed to delete account. Please try again.', 'error');
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar title="Account" showBack backHref="/dashboard" />
        <PageWrapper>
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" />
          </div>
        </PageWrapper>
      </>
    );
  }

  if (!user) return null;

  return (
    <>
      <Navbar title="Account" showBack backHref="/dashboard" />
      <PageWrapper>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar src={user.avatar_url} name={user.display_name ?? ''} size="xl" />
            <div>
              <p className="font-semibold">{user.display_name}</p>
              <p className="text-sm text-ink-sub">Member since {new Date(user.created_at).getFullYear()}</p>
            </div>
          </div>

          <Card>
            <h3 className="font-serif text-base mb-3">Display Name</h3>
            <div className="flex gap-2">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              <Button size="sm" loading={saving} onClick={handleSaveName}>Save</Button>
            </div>
          </Card>

          <Card>
            <h3 className="font-serif text-base mb-1">Email</h3>
            <p className="text-sm text-ink-sub">{user.email ?? 'Not available'}</p>
          </Card>

          <Card>
            <h3 className="font-serif text-base mb-3">Password</h3>
            <Button variant="secondary" onClick={handleResetPassword}>
              Send Password Reset Email
            </Button>
          </Card>

          <Button variant="secondary" onClick={handleLogout} className="w-full">
            Log Out
          </Button>

          <Card className="border-danger/20">
            <h3 className="font-serif text-base text-danger mb-2">Danger Zone</h3>
            <Button variant="destructive" size="sm" onClick={() => setShowDelete(true)}>
              Delete Account
            </Button>
          </Card>
        </div>
      </PageWrapper>

      <Modal
        isOpen={showDelete}
        onClose={() => { setShowDelete(false); setDeleteConfirm(''); }}
        title="Delete Account"
        footer={
          <Button
            variant="destructive"
            disabled={deleteConfirm !== 'DELETE'}
            onClick={handleDeleteAccount}
          >
            Permanently Delete
          </Button>
        }
      >
        <p className="text-sm text-ink-sub mb-4">
          This action cannot be undone. Type <strong>DELETE</strong> to confirm.
        </p>
        <Input
          value={deleteConfirm}
          onChange={(e) => setDeleteConfirm(e.target.value)}
          placeholder="Type DELETE"
        />
      </Modal>
    </>
  );
}
