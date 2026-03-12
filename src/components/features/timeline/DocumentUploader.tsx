'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useDocuments } from '@/hooks/useTimeline';
import type { DocumentType } from '@/types/app';

const DOC_TYPES: { id: DocumentType; label: string; icon: string }[] = [
  { id: 'receipt', label: 'Receipt', icon: '🧾' },
  { id: 'warranty', label: 'Warranty', icon: '📄' },
  { id: 'manual', label: 'Manual', icon: '📖' },
  { id: 'inspection_report', label: 'Inspection', icon: '🔍' },
  { id: 'insurance', label: 'Insurance', icon: '🛡️' },
  { id: 'permit', label: 'Permit', icon: '📋' },
  { id: 'contract', label: 'Contract', icon: '✍️' },
  { id: 'photo', label: 'Photo', icon: '📸' },
];

export function DocumentUploader({ propertyId }: { propertyId?: string }) {
  const { createDocument, isCreating } = useDocuments(propertyId);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    document_type: 'receipt' as DocumentType,
    description: '',
  });

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    await createDocument({
      title: form.title.trim(),
      document_type: form.document_type,
      description: form.description || undefined,
      file_url: `https://placeholder.docs/${Date.now()}`,
      property_id: propertyId,
    });
    setForm({ title: '', document_type: 'receipt', description: '' });
    setShowForm(false);
  };

  return (
    <div>
      {!showForm ? (
        <Button variant="secondary" size="sm" onClick={() => setShowForm(true)}>+ Add Document</Button>
      ) : (
        <Card padding="md">
          <h4 className="font-medium text-[var(--text)] text-sm mb-3">Upload Document</h4>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Document title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full p-2 rounded-lg bg-[var(--glass)] border border-[var(--glass-border)] text-[var(--text)] text-sm placeholder:text-[var(--text-sub)]"
            />
            <div className="flex flex-wrap gap-1.5">
              {DOC_TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setForm({ ...form, document_type: t.id })}
                  className={`px-2 py-1 rounded-lg text-xs border transition-colors ${form.document_type === t.id ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]' : 'border-[var(--glass-border)] text-[var(--text-sub)]'}`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
            <textarea
              placeholder="Notes (optional)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-2 rounded-lg bg-[var(--glass)] border border-[var(--glass-border)] text-[var(--text)] text-sm placeholder:text-[var(--text-sub)] h-16 resize-none"
            />
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button size="sm" loading={isCreating} onClick={handleSubmit}>Save</Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
