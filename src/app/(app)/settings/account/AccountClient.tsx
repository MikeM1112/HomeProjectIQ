'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  User,
  Home,
  Clock,
  Bell,
  Handshake,
  Lock,
  Palette,
  Mail,
  KeyRound,
  Trash2,
  LogOut,
  ChevronRight,
  DollarSign,
  Ruler,
  Globe,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { ThemeToggle } from '@/components/settings/ThemeToggle';
import { useUser } from '@/hooks/useUser';
import { useProperties } from '@/hooks/useProperties';
import { useUIStore } from '@/stores/uiStore';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function SettingsSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.div variants={fadeUp}>
      <GlassPanel padding="md">
        <div className="flex items-center gap-2 mb-3">
          <span style={{ color: 'var(--accent)' }}>{icon}</span>
          <h3
            className="text-sm font-semibold"
            style={{ color: 'var(--text)' }}
          >
            {title}
          </h3>
        </div>
        {children}
      </GlassPanel>
    </motion.div>
  );
}

function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div
      className="flex items-center justify-between py-2.5 border-b last:border-0"
      style={{ borderColor: 'var(--glass-border)' }}
    >
      <div className="flex-1 min-w-0 pr-3">
        <p className="text-sm" style={{ color: 'var(--text)' }}>
          {label}
        </p>
        {description && (
          <p className="text-[11px]" style={{ color: 'var(--text-sub)' }}>
            {description}
          </p>
        )}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative w-11 h-6 rounded-full transition-all shrink-0',
          checked ? 'bg-[var(--accent)]' : 'bg-[var(--glass-border)]'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-[22px]' : 'translate-x-0.5'
          )}
        />
      </button>
    </div>
  );
}

export function AccountClient() {
  const router = useRouter();
  const { user, isLoading, refetch } = useUser();
  const { properties } = useProperties();
  const { showToast } = useUIStore();

  const [name, setName] = useState('');
  const [hourlyValue, setHourlyValue] = useState('30');
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  // Notification preferences (local state, would normally persist)
  const [notifRepairs, setNotifRepairs] = useState(true);
  const [notifMaintenance, setNotifMaintenance] = useState(true);
  const [notifRisk, setNotifRisk] = useState(true);
  const [notifLending, setNotifLending] = useState(true);
  const [notifScore, setNotifScore] = useState(false);

  // Lending preferences
  const [lendingEnabled, setLendingEnabled] = useState(true);
  const [autoApprove, setAutoApprove] = useState(false);

  // Privacy
  const [profilePublic, setProfilePublic] = useState(true);
  const [showToolbox, setShowToolbox] = useState(true);

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

  const primaryProperty = properties[0];

  return (
    <>
      <Navbar title="Account" showBack backHref="/dashboard" />
      <PageWrapper>
        <motion.div
          className="space-y-4"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {/* Profile Header */}
          <motion.div variants={fadeUp}>
            <GlassPanel padding="lg">
              <div className="flex items-center gap-4">
                <Avatar
                  src={user.avatar_url}
                  name={user.display_name ?? ''}
                  size="xl"
                />
                <div className="flex-1 min-w-0">
                  <p
                    className="font-semibold text-base"
                    style={{ color: 'var(--text)' }}
                  >
                    {user.display_name}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: 'var(--text-sub)' }}
                  >
                    {user.email}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="gradient">
                      Level {user.level}
                    </Badge>
                    <span
                      className="text-[10px]"
                      style={{ color: 'var(--text-sub)' }}
                    >
                      Since {new Date(user.created_at).getFullYear()}
                    </span>
                  </div>
                </div>
              </div>
            </GlassPanel>
          </motion.div>

          {/* Display Name */}
          <SettingsSection title="Display Name" icon={<User size={16} />}>
            <div className="flex gap-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
              <Button size="sm" loading={saving} onClick={handleSaveName}>
                Save
              </Button>
            </div>
          </SettingsSection>

          {/* Household Info */}
          <SettingsSection title="Household" icon={<User size={16} />}>
            <p className="text-xs" style={{ color: 'var(--text-sub)' }}>
              {properties.length > 0
                ? `${properties.length} propert${properties.length !== 1 ? 'ies' : 'y'} registered`
                : 'No properties set up yet'}
            </p>
            <Button
              size="sm"
              variant="ghost"
              className="mt-2 px-0"
              onClick={() => router.push('/property')}
            >
              Manage Properties <ChevronRight size={12} className="ml-1" />
            </Button>
          </SettingsSection>

          {/* Property Info */}
          {primaryProperty && (
            <SettingsSection title="Primary Property" icon={<Home size={16} />}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs"
                    style={{ color: 'var(--text-sub)' }}
                  >
                    Name
                  </span>
                  <span
                    className="text-xs font-medium"
                    style={{ color: 'var(--text)' }}
                  >
                    {primaryProperty.name}
                  </span>
                </div>
                {primaryProperty.address && (
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs"
                      style={{ color: 'var(--text-sub)' }}
                    >
                      Address
                    </span>
                    <span
                      className="text-xs font-medium truncate max-w-[200px]"
                      style={{ color: 'var(--text)' }}
                    >
                      {primaryProperty.address}
                    </span>
                  </div>
                )}
                {primaryProperty.year_built && (
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs"
                      style={{ color: 'var(--text-sub)' }}
                    >
                      Year Built
                    </span>
                    <span
                      className="text-xs font-medium"
                      style={{ color: 'var(--text)' }}
                    >
                      {primaryProperty.year_built}
                    </span>
                  </div>
                )}
                {primaryProperty.square_footage && (
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs"
                      style={{ color: 'var(--text-sub)' }}
                    >
                      Size
                    </span>
                    <span
                      className="text-xs font-medium"
                      style={{ color: 'var(--text)' }}
                    >
                      {primaryProperty.square_footage.toLocaleString()} sq ft
                    </span>
                  </div>
                )}
              </div>
            </SettingsSection>
          )}

          {/* DIY Time Value */}
          <SettingsSection
            title="Hourly Time Value"
            icon={<DollarSign size={16} />}
          >
            <p
              className="text-xs mb-2"
              style={{ color: 'var(--text-sub)' }}
            >
              Used to calculate whether DIY saves you money vs. hiring a pro.
            </p>
            <div className="flex items-center gap-2">
              <span
                className="text-sm font-medium"
                style={{ color: 'var(--text)' }}
              >
                $
              </span>
              <Input
                type="number"
                value={hourlyValue}
                onChange={(e) => setHourlyValue(e.target.value)}
                placeholder="30"
                className="max-w-[100px]"
              />
              <span
                className="text-xs"
                style={{ color: 'var(--text-sub)' }}
              >
                / hour
              </span>
            </div>
          </SettingsSection>

          {/* Appearance */}
          <SettingsSection title="Appearance" icon={<Palette size={16} />}>
            <ThemeToggle />
          </SettingsSection>

          {/* Notification Preferences */}
          <SettingsSection
            title="Notification Preferences"
            icon={<Bell size={16} />}
          >
            <div>
              <ToggleSwitch
                checked={notifRepairs}
                onChange={setNotifRepairs}
                label="Repair Updates"
                description="Step progress, tool readiness changes"
              />
              <ToggleSwitch
                checked={notifMaintenance}
                onChange={setNotifMaintenance}
                label="Maintenance Reminders"
                description="Scheduled tasks and seasonal reminders"
              />
              <ToggleSwitch
                checked={notifRisk}
                onChange={setNotifRisk}
                label="Risk Alerts"
                description="System failures and weather warnings"
              />
              <ToggleSwitch
                checked={notifLending}
                onChange={setNotifLending}
                label="Lending Activity"
                description="Tool requests, returns, and due dates"
              />
              <ToggleSwitch
                checked={notifScore}
                onChange={setNotifScore}
                label="Score & Progress"
                description="XP milestones, badge unlocks, score changes"
              />
            </div>
          </SettingsSection>

          {/* Lending Preferences */}
          <SettingsSection
            title="Lending Preferences"
            icon={<Handshake size={16} />}
          >
            <div>
              <ToggleSwitch
                checked={lendingEnabled}
                onChange={setLendingEnabled}
                label="Enable Tool Lending"
                description="Allow friends to request your tools"
              />
              <ToggleSwitch
                checked={autoApprove}
                onChange={setAutoApprove}
                label="Auto-Approve Trusted Friends"
                description="Automatically approve requests from high-trust friends"
              />
            </div>
          </SettingsSection>

          {/* Privacy */}
          <SettingsSection title="Privacy" icon={<Lock size={16} />}>
            <div>
              <ToggleSwitch
                checked={profilePublic}
                onChange={setProfilePublic}
                label="Public Profile"
                description="Let neighbors find and connect with you"
              />
              <ToggleSwitch
                checked={showToolbox}
                onChange={setShowToolbox}
                label="Show Toolbox to Friends"
                description="Friends can see what tools you own"
              />
            </div>
          </SettingsSection>

          {/* Password */}
          <SettingsSection title="Security" icon={<KeyRound size={16} />}>
            <div className="space-y-2">
              <p className="text-xs" style={{ color: 'var(--text-sub)' }}>
                {user.email ?? 'No email'}
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleResetPassword}
              >
                <Mail size={14} className="mr-1" />
                Send Password Reset Email
              </Button>
            </div>
          </SettingsSection>

          {/* Log Out */}
          <motion.div variants={fadeUp}>
            <Button
              variant="secondary"
              onClick={handleLogout}
              className="w-full"
            >
              <LogOut size={16} className="mr-2" />
              Log Out
            </Button>
          </motion.div>

          {/* Danger Zone */}
          <motion.div variants={fadeUp}>
            <GlassPanel
              padding="md"
              className="border-[var(--danger)]/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <Trash2 size={16} style={{ color: 'var(--danger)' }} />
                <h3
                  className="text-sm font-semibold"
                  style={{ color: 'var(--danger)' }}
                >
                  Danger Zone
                </h3>
              </div>
              <p
                className="text-xs mb-3"
                style={{ color: 'var(--text-sub)' }}
              >
                Permanently delete your account and all associated data.
              </p>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDelete(true)}
              >
                Delete Account
              </Button>
            </GlassPanel>
          </motion.div>
        </motion.div>
      </PageWrapper>

      {/* Delete Modal */}
      <Modal
        isOpen={showDelete}
        onClose={() => {
          setShowDelete(false);
          setDeleteConfirm('');
        }}
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
        <p
          className="text-sm mb-4"
          style={{ color: 'var(--text-sub)' }}
        >
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
