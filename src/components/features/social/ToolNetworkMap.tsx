'use client';

import { Card } from '@/components/ui/Card';
import { useSocialNetwork } from '@/hooks/useSocial';

export function ToolNetworkMap() {
  const { borrowableTools, isLoading } = useSocialNetwork();

  if (isLoading) return <Card padding="sm"><div className="text-sm text-[var(--text-sub)]">Loading network...</div></Card>;

  if (borrowableTools.length === 0) {
    return (
      <Card padding="md" className="text-center">
        <span className="text-3xl">🔗</span>
        <h3 className="font-semibold text-[var(--text)] mt-2 text-sm">Tool Network</h3>
        <p className="text-xs text-[var(--text-sub)] mt-1">Connect with friends to see borrowable tools</p>
      </Card>
    );
  }

  // Group by category
  const grouped = borrowableTools.reduce<Record<string, typeof borrowableTools>>((acc, tool) => {
    const cat = tool.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(tool);
    return acc;
  }, {});

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-[var(--text)] text-sm">Borrowable Tools ({borrowableTools.length})</h3>
      {Object.entries(grouped).map(([category, tools]) => (
        <div key={category}>
          <p className="text-xs text-[var(--text-sub)] font-medium mb-1">{category}</p>
          <div className="flex flex-wrap gap-1.5">
            {tools.map((tool) => (
              <span key={tool.id} className="px-2 py-1 rounded-lg text-xs bg-[var(--glass)] border border-[var(--glass-border)] text-[var(--text)]">
                {tool.tool_name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
