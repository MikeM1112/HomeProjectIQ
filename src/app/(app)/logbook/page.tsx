'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { LogbookList } from '@/components/features/logbook/LogbookList';
import { AddEntryModal } from '@/components/features/logbook/AddEntryModal';
import { useLogbook } from '@/hooks/useLogbook';
import { useUIStore } from '@/stores/uiStore';

export default function LogbookPage() {
  const [showAdd, setShowAdd] = useState(false);
  const { entries, isLoading, createEntry, deleteEntry, isCreating } = useLogbook();
  const { showToast } = useUIStore();

  const handleAdd = async (data: Parameters<typeof createEntry>[0]) => {
    try {
      await createEntry(data);
      showToast('+15 XP! Entry logged.', 'success');
    } catch {
      showToast('Failed to save entry. Please try again.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEntry(id);
      showToast('Entry deleted', 'info');
    } catch {
      showToast('Failed to delete entry. Please try again.', 'error');
    }
  };

  return (
    <>
      <Navbar title="Logbook" />
      <PageWrapper>
        <LogbookList
          entries={entries}
          loading={isLoading}
          onDelete={handleDelete}
          onAddEntry={() => setShowAdd(true)}
        />
      </PageWrapper>
      <AddEntryModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={handleAdd}
        isSubmitting={isCreating}
      />
    </>
  );
}
