'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { LogbookList } from '@/components/features/logbook/LogbookList';
import { AddEntryModal } from '@/components/features/logbook/AddEntryModal';
import { useLogbook } from '@/hooks/useLogbook';
import { useUIStore } from '@/stores/uiStore';

export default function DemoLogbookPage() {
  const [showAdd, setShowAdd] = useState(false);
  const { entries, isLoading, isCreating } = useLogbook();
  const { showToast } = useUIStore();

  return (
    <>
      <Navbar title="Logbook" />
      <PageWrapper>
        <LogbookList
          entries={entries}
          loading={isLoading}
          onDelete={() => showToast('Sign up to manage your logbook!', 'info')}
          onAddEntry={() => setShowAdd(true)}
        />
      </PageWrapper>
      <AddEntryModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={async () => { showToast('Sign up to log your repairs!', 'info'); }}
        isSubmitting={isCreating}
      />
    </>
  );
}
