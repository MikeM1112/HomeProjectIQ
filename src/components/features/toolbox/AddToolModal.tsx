'use client';

import { useState, useMemo } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { TOOLS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface AddToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownedToolIds: string[];
  onAdd: (tool: { tool_id: string; tool_name: string; category: string }) => void;
  onRemove: (toolId: string) => void;
}

export function AddToolModal({ isOpen, onClose, ownedToolIds, onAdd, onRemove }: AddToolModalProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const categories = useMemo(() => [...new Set(TOOLS.map((t) => t.category))], []);

  const filtered = useMemo(() => {
    return TOOLS.filter((t) => {
      if (categoryFilter && t.category !== categoryFilter) return false;
      if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, categoryFilter]);

  const handleToggle = (tool: typeof TOOLS[number]) => {
    if (ownedToolIds.includes(tool.id)) {
      onRemove(tool.id);
    } else {
      onAdd({ tool_id: tool.id, tool_name: tool.name, category: tool.category });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Tools">
      <div className="space-y-3">
        <Input
          placeholder="Search tools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setCategoryFilter(null)}
            className={cn('tag shrink-0', !categoryFilter ? 'bg-brand text-white' : 'bg-surface-muted text-ink-sub')}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c === categoryFilter ? null : c)}
              className={cn('tag shrink-0', categoryFilter === c ? 'bg-brand text-white' : 'bg-surface-muted text-ink-sub')}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="max-h-[50vh] overflow-y-auto space-y-1">
          {filtered.map((tool) => {
            const owned = ownedToolIds.includes(tool.id);
            return (
              <button
                key={tool.id}
                onClick={() => handleToggle(tool)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left tap transition-colors',
                  owned ? 'bg-success-light' : 'hover:bg-surface-muted'
                )}
              >
                <span className="text-xl">{tool.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{tool.name}</p>
                  <p className="text-[10px] text-ink-dim">{tool.category}</p>
                </div>
                {owned && <span className="text-success text-lg">✓</span>}
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
