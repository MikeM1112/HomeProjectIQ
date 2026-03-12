'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Star,
  Wrench,
  Shield,
  ChevronRight,
  UserPlus,
  Package,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { Mascot } from '@/components/brand/Mascot';
import { useSocialNetwork } from '@/hooks/useSocial';
import { cn } from '@/lib/utils';
import type { HandyProfile } from '@/types/app';

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

function getHandyLevel(rating: number): {
  label: string;
  variant: 'success' | 'warning' | 'info' | 'default';
} {
  if (rating >= 4.5) return { label: 'Expert', variant: 'success' };
  if (rating >= 3.5) return { label: 'Skilled', variant: 'info' };
  if (rating >= 2.5) return { label: 'Handy', variant: 'warning' };
  return { label: 'Beginner', variant: 'default' };
}

function FriendCard({ profile }: { profile: HandyProfile }) {
  const level = getHandyLevel(profile.rating);

  return (
    <GlassPanel padding="md" hover>
      <div className="flex items-start gap-3">
        <Avatar
          src={null}
          name={profile.display_name ?? 'Friend'}
          size="lg"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="text-sm font-semibold truncate"
              style={{ color: 'var(--text)' }}
            >
              {profile.display_name ?? 'Anonymous'}
            </span>
            <Badge variant={level.variant}>{level.label}</Badge>
          </div>

          {profile.neighborhood && (
            <p className="text-[11px]" style={{ color: 'var(--text-sub)' }}>
              {profile.neighborhood}
            </p>
          )}

          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <span
              className="text-[11px] flex items-center gap-1"
              style={{ color: 'var(--gold)' }}
            >
              <Star size={10} fill="currentColor" />
              {profile.rating.toFixed(1)}
            </span>
            <span
              className="text-[11px] flex items-center gap-1"
              style={{ color: 'var(--text-sub)' }}
            >
              <Shield size={10} />
              {profile.total_reviews} review{profile.total_reviews !== 1 ? 's' : ''}
            </span>
            <span
              className="text-[11px] flex items-center gap-1"
              style={{ color: 'var(--accent)' }}
            >
              <Package size={10} />
              {profile.tools_lent_count} tool{profile.tools_lent_count !== 1 ? 's' : ''}
            </span>
          </div>

          {profile.skills.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {profile.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{
                    background: 'var(--chip-bg)',
                    color: 'var(--chip-text)',
                    border: '1px solid var(--chip-border)',
                  }}
                >
                  {skill}
                </span>
              ))}
              {profile.skills.length > 3 && (
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{ color: 'var(--text-sub)' }}
                >
                  +{profile.skills.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          {profile.is_available && (
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: 'var(--emerald)' }}
              title="Available"
            />
          )}
          <Button size="sm" variant="secondary">
            <Wrench size={12} className="mr-1" />
            Tools
          </Button>
        </div>
      </div>
    </GlassPanel>
  );
}

export function NetworkClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const { friends, isLoading } = useSocialNetwork();

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return friends;
    const q = searchQuery.toLowerCase();
    return friends.filter(
      (f) =>
        (f.display_name ?? '').toLowerCase().includes(q) ||
        f.skills.some((s) => s.toLowerCase().includes(q)) ||
        (f.neighborhood ?? '').toLowerCase().includes(q)
    );
  }, [friends, searchQuery]);

  return (
    <>
      <Navbar title="Handy Friends" showBack backHref="/dashboard" />
      <PageWrapper>
        <motion.div
          className="space-y-4"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {/* Header + Loans Link */}
          <motion.div
            variants={fadeUp}
            className="flex items-center justify-between"
          >
            <h1
              className="font-serif text-xl"
              style={{ color: 'var(--text)' }}
            >
              Handy Friends
            </h1>
            <Link href="/network/loans">
              <Button size="sm" variant="secondary">
                <Package size={14} className="mr-1" />
                Loans
              </Button>
            </Link>
          </motion.div>

          {/* Search */}
          <motion.div variants={fadeUp} className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--text-sub)' }}
            />
            <Input
              placeholder="Search by name, skill, or neighborhood..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </motion.div>

          {/* Friends List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size="lg" />
            </div>
          ) : filtered.length === 0 ? (
            <motion.div variants={fadeUp}>
              <GlassPanel padding="lg" className="text-center">
                <Mascot mode="default" size="lg" className="mx-auto mb-3" />
                <p
                  className="text-sm font-semibold mb-1"
                  style={{ color: 'var(--text)' }}
                >
                  {searchQuery
                    ? 'No friends match your search'
                    : 'Build Your Network'}
                </p>
                <p className="text-xs mb-4" style={{ color: 'var(--text-sub)' }}>
                  {searchQuery
                    ? 'Try a different search term.'
                    : 'Connect with handy neighbors to share tools and knowledge.'}
                </p>
                {!searchQuery && (
                  <Button size="sm">
                    <UserPlus size={14} className="mr-1" />
                    Invite Friends
                  </Button>
                )}
              </GlassPanel>
            </motion.div>
          ) : (
            filtered.map((friend) => (
              <motion.div key={friend.id} variants={fadeUp}>
                <FriendCard profile={friend} />
              </motion.div>
            ))
          )}
        </motion.div>
      </PageWrapper>
    </>
  );
}
