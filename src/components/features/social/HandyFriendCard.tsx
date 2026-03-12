'use client';

import { Card } from '@/components/ui/Card';
import type { HandyProfile } from '@/types/app';

export function HandyFriendCard({ profile }: { profile: HandyProfile }) {
  return (
    <Card padding="sm" variant="interactive">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[image:var(--accent-gradient)] flex items-center justify-center text-white font-bold text-sm">
          {(profile.display_name?.[0] ?? '?').toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-[var(--text)] truncate">{profile.display_name ?? 'Anonymous'}</p>
          <div className="flex items-center gap-2 text-xs text-[var(--text-sub)]">
            {profile.rating > 0 && <span>⭐ {profile.rating.toFixed(1)}</span>}
            {profile.tools_lent_count > 0 && <span>🔧 {profile.tools_lent_count} lent</span>}
            {profile.repairs_helped > 0 && <span>🛠️ {profile.repairs_helped} helped</span>}
          </div>
        </div>
        <span className={`w-2 h-2 rounded-full ${profile.is_available ? 'bg-green-400' : 'bg-[var(--text-sub)]'}`} />
      </div>
      {profile.skills.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {profile.skills.slice(0, 4).map((skill) => (
            <span key={skill} className="px-2 py-0.5 rounded-full text-xs bg-[var(--glass)] border border-[var(--glass-border)] text-[var(--text-sub)]">
              {skill}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}
