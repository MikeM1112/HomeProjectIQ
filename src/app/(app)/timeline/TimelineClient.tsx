'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TimelineView } from '@/components/features/timeline/TimelineView';
import { DocumentUploader } from '@/components/features/timeline/DocumentUploader';
import { DocumentCard } from '@/components/features/timeline/DocumentCard';
import { useDocuments } from '@/hooks/useTimeline';
import { ROUTES } from '@/lib/constants';

export function TimelineClient() {
  const [tab, setTab] = useState<'timeline' | 'documents'>('timeline');
  const { documents } = useDocuments();

  return (
    <>
      <Navbar title="Timeline & Records" showBack backHref={ROUTES.DASHBOARD} />
      <PageWrapper>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button size="sm" variant={tab === 'timeline' ? 'primary' : 'secondary'} onClick={() => setTab('timeline')}>Timeline</Button>
            <Button size="sm" variant={tab === 'documents' ? 'primary' : 'secondary'} onClick={() => setTab('documents')}>Documents</Button>
          </div>

          {tab === 'timeline' ? (
            <TimelineView />
          ) : (
            <div className="space-y-4">
              <DocumentUploader />
              {documents.length === 0 ? (
                <Card padding="lg" className="text-center">
                  <span className="text-3xl">📁</span>
                  <p className="text-sm text-[var(--text-sub)] mt-2">No documents uploaded yet</p>
                </Card>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <DocumentCard key={doc.id} document={doc} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </PageWrapper>
    </>
  );
}
