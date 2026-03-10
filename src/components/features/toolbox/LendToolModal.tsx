'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import type { ToolboxItem } from '@/types/app';
import { TOOLS } from '@/lib/constants';

interface LendToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  tools: ToolboxItem[];
  lentOutIds: string[];
  onLend: (data: {
    tool_id: string;
    tool_name: string;
    tool_emoji: string;
    borrower_name: string;
    due_date?: string | null;
    notes?: string | null;
  }) => Promise<void>;
}

export function LendToolModal({ isOpen, onClose, tools, lentOutIds, onLend }: LendToolModalProps) {
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [borrowerName, setBorrowerName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const availableTools = tools.filter((t) => !lentOutIds.includes(t.tool_id));
  const selectedTool = availableTools.find((t) => t.tool_id === selectedToolId);
  const selectedDef = selectedTool ? TOOLS.find((d) => d.id === selectedTool.tool_id) : null;

  const handleSubmit = async () => {
    if (!selectedTool || !borrowerName.trim()) return;
    setSubmitting(true);
    try {
      await onLend({
        tool_id: selectedTool.tool_id,
        tool_name: selectedTool.tool_name,
        tool_emoji: selectedDef?.emoji ?? '🔧',
        borrower_name: borrowerName.trim(),
        due_date: dueDate || null,
        notes: notes.trim() || null,
      });
      // Reset form
      setSelectedToolId(null);
      setBorrowerName('');
      setDueDate('');
      setNotes('');
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lend a Tool">
      <div className="space-y-4">
        {/* Tool selection */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[var(--ink)]">Select Tool</label>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {availableTools.map((tool) => {
              const def = TOOLS.find((d) => d.id === tool.tool_id);
              return (
                <Card
                  key={tool.tool_id}
                  padding="sm"
                  variant={selectedToolId === tool.tool_id ? 'selected' : 'interactive'}
                  onClick={() => setSelectedToolId(tool.tool_id)}
                >
                  <span className="text-lg">{def?.emoji ?? '🔧'}</span>
                  <p className="text-xs font-medium mt-0.5 text-[var(--ink)] truncate">{tool.tool_name}</p>
                </Card>
              );
            })}
          </div>
          {availableTools.length === 0 && (
            <p className="text-xs text-[var(--ink-sub)]">All tools are currently lent out.</p>
          )}
        </div>

        {/* Borrower name */}
        <div className="space-y-1.5">
          <label htmlFor="borrower-name" className="block text-sm font-medium text-[var(--ink)]">
            Borrower Name
          </label>
          <input
            id="borrower-name"
            type="text"
            value={borrowerName}
            onChange={(e) => setBorrowerName(e.target.value)}
            placeholder="e.g. John next door"
            maxLength={100}
            className={cn(
              'w-full rounded-[16px] border bg-[var(--glass)] backdrop-blur-[16px] px-3.5 py-2.5 text-sm text-[var(--ink)]',
              'placeholder:text-[var(--ink-dim)]',
              'transition-all focus:outline-none focus:ring-2 focus:ring-offset-1',
              'border-[var(--glass-border)] focus:border-[var(--accent)] focus:ring-[var(--accent-glow)] shadow-[var(--card-shadow)]'
            )}
          />
        </div>

        {/* Due date (optional) */}
        <div className="space-y-1.5">
          <label htmlFor="due-date" className="block text-sm font-medium text-[var(--ink)]">
            Due Date <span className="text-[var(--ink-dim)]">(optional)</span>
          </label>
          <input
            id="due-date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={cn(
              'w-full rounded-[16px] border bg-[var(--glass)] backdrop-blur-[16px] px-3.5 py-2.5 text-sm text-[var(--ink)]',
              'transition-all focus:outline-none focus:ring-2 focus:ring-offset-1',
              'border-[var(--glass-border)] focus:border-[var(--accent)] focus:ring-[var(--accent-glow)] shadow-[var(--card-shadow)]'
            )}
          />
        </div>

        {/* Notes (optional) */}
        <div className="space-y-1.5">
          <label htmlFor="loan-notes" className="block text-sm font-medium text-[var(--ink)]">
            Notes <span className="text-[var(--ink-dim)]">(optional)</span>
          </label>
          <textarea
            id="loan-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any details..."
            rows={2}
            maxLength={500}
            className={cn(
              'w-full rounded-[16px] border bg-[var(--glass)] backdrop-blur-[16px] px-3.5 py-2.5 text-sm text-[var(--ink)]',
              'placeholder:text-[var(--ink-dim)] resize-none',
              'transition-all focus:outline-none focus:ring-2 focus:ring-offset-1',
              'border-[var(--glass-border)] focus:border-[var(--accent)] focus:ring-[var(--accent-glow)] shadow-[var(--card-shadow)]'
            )}
          />
        </div>

        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleSubmit}
          disabled={!selectedToolId || !borrowerName.trim() || submitting}
        >
          {submitting ? 'Lending...' : 'Lend Tool'}
        </Button>
      </div>
    </Modal>
  );
}
