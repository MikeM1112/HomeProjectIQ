'use client';

import { Navbar } from '@/components/layout/Navbar';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { HandyFriendCard } from '@/components/features/social/HandyFriendCard';
import { ToolNetworkMap } from '@/components/features/social/ToolNetworkMap';
import { LeaderboardCard } from '@/components/features/social/LeaderboardCard';
import { TrustScoreCard } from '@/components/features/social/TrustScoreCard';
import { useSocialNetwork } from '@/hooks/useSocial';
import { ROUTES } from '@/lib/constants';

export function SocialClient() {
  const { friends, isLoading } = useSocialNetwork();

  return (
    <>
      <Navbar title="Community" showBack backHref={ROUTES.DASHBOARD} />
      <PageWrapper>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-[var(--text)] mb-2">Handy Friends</h3>
            {isLoading ? (
              <div className="text-sm text-[var(--text-sub)]">Loading...</div>
            ) : friends.length === 0 ? (
              <div className="text-center py-4">
                <span className="text-3xl">👋</span>
                <p className="text-sm text-[var(--text-sub)] mt-2">Connect with friends to build your network</p>
              </div>
            ) : (
              <div className="space-y-2">
                {friends.map((friend) => (
                  <HandyFriendCard key={friend.id} profile={friend} />
                ))}
              </div>
            )}
          </div>

          <TrustScoreCard />
          <ToolNetworkMap />
          <LeaderboardCard />
        </div>
      </PageWrapper>
    </>
  );
}
