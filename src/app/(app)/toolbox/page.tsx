'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { ToolList } from '@/components/features/toolbox/ToolList';
import { AddToolModal } from '@/components/features/toolbox/AddToolModal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useToolbox } from '@/hooks/useToolbox';
import { useUIStore } from '@/stores/uiStore';

export default function ToolboxPage() {
  const [showAdd, setShowAdd] = useState(false);
  const { tools, isLoading, addTool, removeTool } = useToolbox();
  const { showToast } = useUIStore();

  const ownedIds = tools.map((t) => t.tool_id);

  const handleAdd = async (data: Parameters<typeof addTool>[0]) => {
    try {
      await addTool(data);
      showToast('+5 XP! Tool added.', 'success');
    } catch {
      showToast('Failed to add tool. Please try again.', 'error');
    }
  };

  const handleRemove = async (toolId: string) => {
    try {
      await removeTool(toolId);
      showToast('Tool removed', 'info');
    } catch {
      showToast('Failed to remove tool. Please try again.', 'error');
    }
  };

  return (
    <>
      <Navbar title="My Toolbox" />
      <PageWrapper>
        {/* Photo Scan CTA Banner */}
        <Card className="relative overflow-hidden mb-4">
          <div className="absolute inset-0 gradient-accent opacity-10 pointer-events-none" />
          <div className="relative flex items-center gap-3">
            <span className="text-3xl">📷</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--ink)]">Snap a photo of your tools</p>
              <p className="text-xs text-[var(--ink-sub)]">AI will auto-catalog them</p>
            </div>
            <Button size="sm">Scan</Button>
          </div>
        </Card>

        <div className="flex justify-between items-center mb-4">
          <h2 className="font-serif text-lg text-[var(--ink)]">{tools.length} Tools</h2>
          <Button size="sm" onClick={() => setShowAdd(true)}>
            Add Tool
          </Button>
        </div>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 rounded-2xl bg-[var(--muted)] animate-pulse" />
            ))}
          </div>
        ) : (
          <ToolList tools={tools} onRemove={handleRemove} />
        )}
      </PageWrapper>
      <AddToolModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        ownedToolIds={ownedIds}
        onAdd={handleAdd}
        onRemove={handleRemove}
      />
    </>
  );
}
