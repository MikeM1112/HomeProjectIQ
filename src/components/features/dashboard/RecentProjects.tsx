'use client';

import Link from 'next/link';
import { useProjects } from '@/hooks/useProjects';
import { CATEGORIES } from '@/lib/project-data';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { getVerdictLabel, formatDate } from '@/lib/utils';

export function RecentProjects() {
  const { projects, isLoading } = useProjects();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} variant="card" className="h-[72px]" />
        ))}
      </div>
    );
  }

  const recent = projects.slice(0, 5);

  if (recent.length === 0) {
    return (
      <Card className="text-center py-10">
        <p className="text-[var(--text-sub)] text-sm">No projects yet — pick a category below</p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {recent.map((project) => {
        const cat = CATEGORIES.find((c) => c.id === project.category_id);
        return (
          <Link key={project.id} href={`/project/${project.id}`}>
            <Card variant="interactive" padding="sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--icon-bg)] flex items-center justify-center shrink-0">
                  <span className="text-xl">{cat?.icon ?? '🔧'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--text)] truncate">{project.title}</p>
                  <p className="text-xs text-[var(--text-dim)]">{formatDate(project.created_at)}</p>
                </div>
                <Badge
                  variant={
                    project.verdict === 'diy_easy' ? 'success'
                    : project.verdict === 'diy_caution' ? 'warning'
                    : 'error'
                  }
                >
                  {getVerdictLabel(project.verdict)}
                </Badge>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
