'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { ToolList } from '@/components/features/toolbox/ToolList';
import { AddToolModal } from '@/components/features/toolbox/AddToolModal';
import { ToolLendingSection } from '@/components/features/toolbox/ToolLendingSection';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useToolbox } from '@/hooks/useToolbox';
import { useToolLoans } from '@/hooks/useToolLoans';
import { useUIStore } from '@/stores/uiStore';

export default function ToolboxPage() {
  const [showAdd, setShowAdd] = useState(false);
  const { tools, isLoading, addTool, removeTool } = useToolbox();
  const { activeLoans } = useToolLoans();
  const { showToast } = useUIStore();

  const ownedIds = tools.map((t) => t.tool_id);
  const lentOutIds = activeLoans.map((l) => l.tool_id);

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
    } catch (err: unknown) {
      const msg = err instanceof Error && err.message.includes('lent')
        ? 'Cannot remove a tool that is currently lent out.'
        : 'Failed to remove tool. Please try again.';
      showToast(msg, 'error');
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
            <Button
              size="sm"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('homeiq:start-assessment'));
                window.location.href = '/dashboard';
              }}
            >
              Scan
            </Button>
          </div>
        </Card>

        {/* Lending Section */}
        <div className="mb-6">
          <ToolLendingSection tools={tools} />
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="font-serif text-lg text-[var(--ink)]">{tools.length} Tools</h2>
          <Button size="sm" onClick={() => setShowAdd(true)}>
            Add Tool
          </Button>
        </div>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 rounded-[20px] bg-[var(--muted)] animate-pulse shadow-[var(--card-shadow)]" />
            ))}
          </div>
        ) : (
          <ToolList tools={tools} onRemove={handleRemove} lentOutIds={lentOutIds} />
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
