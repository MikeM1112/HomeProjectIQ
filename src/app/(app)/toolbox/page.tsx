'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { ToolList } from '@/components/features/toolbox/ToolList';
import { AddToolModal } from '@/components/features/toolbox/AddToolModal';
import { Button } from '@/components/ui/Button';
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-serif text-lg">{tools.length} Tools</h2>
          <Button size="sm" onClick={() => setShowAdd(true)}>
            Add Tool
          </Button>
        </div>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-surface-muted animate-pulse" />
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
