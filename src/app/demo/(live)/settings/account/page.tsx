'use client';

import { Navbar } from '@/components/layout/Navbar';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/settings/ThemeToggle';
import { Leaderboard } from '@/components/features/dashboard/Leaderboard';
import { useUser } from '@/hooks/useUser';
import { DEMO_LEADERBOARD } from '@/lib/demo-data';
import Link from 'next/link';

export default function DemoAccountPage() {
  const { user } = useUser();

  return (
    <>
      <Navbar title="Profile" showBack backHref="/demo/dashboard" />
      <PageWrapper>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar src={user?.avatar_url} name={user?.display_name ?? 'Alex Demo'} size="xl" />
            <div>
              <p className="font-semibold text-[var(--text)]">{user?.display_name ?? 'Alex Demo'}</p>
              <p className="text-sm text-[var(--text-sub)]">Level {user?.level ?? 5} &middot; Master</p>
              <p className="text-xs text-[var(--text-dim)]">{user?.xp?.toLocaleString() ?? '2,350'} XP &middot; 🔥 {user?.streak ?? 12} day streak</p>
            </div>
          </div>

          {/* Gamification stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Projects', value: '14', icon: '🏠' },
              { label: 'Savings', value: '$1,840', icon: '💰' },
              { label: 'Badges', value: '7/10', icon: '🏆' },
            ].map((stat) => (
              <Card key={stat.label} padding="sm" className="text-center">
                <span className="text-xl">{stat.icon}</span>
                <p className="text-base font-bold mt-1" style={{ color: 'var(--text)' }}>{stat.value}</p>
                <p className="text-[10px]" style={{ color: 'var(--text-dim)' }}>{stat.label}</p>
              </Card>
            ))}
          </div>

          {/* Appearance */}
          <Card>
            <h3 className="font-serif text-base mb-3 text-[var(--text)]">Appearance</h3>
            <ThemeToggle />
          </Card>

          {/* Leaderboard */}
          <Leaderboard entries={DEMO_LEADERBOARD} />

          {/* CTA */}
          <Link href="/signup">
            <Button size="lg" className="w-full">
              Sign Up to Save Your Progress
            </Button>
          </Link>
        </div>
      </PageWrapper>
    </>
  );
}
