'use client';

import { Card } from '@/components/ui/Card';
import type { HomeDocument } from '@/types/app';

const TYPE_ICONS: Record<string, string> = {
  receipt: '🧾',
  warranty: '📄',
  manual: '📖',
  inspection_report: '🔍',
  insurance: '🛡️',
  permit: '📋',
  contract: '✍️',
  photo: '📸',
  other: '📎',
};

export function DocumentCard({ document }: { document: HomeDocument }) {
  const icon = TYPE_ICONS[document.document_type] ?? '📎';
  const isExpired = document.expires_at && new Date(document.expires_at) < new Date();

  return (
    <Card padding="sm" variant="interactive">
      <div className="flex items-center gap-3">
        <span className="text-xl flex-shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--text)] truncate">{document.title}</p>
          <div className="flex items-center gap-2 text-xs text-[var(--text-sub)]">
            <span className="capitalize">{document.document_type.replace('_', ' ')}</span>
            {document.expires_at && (
              <span className={isExpired ? 'text-red-400' : 'text-green-400'}>
                {isExpired ? 'Expired' : `Exp. ${new Date(document.expires_at).toLocaleDateString()}`}
              </span>
            )}
          </div>
        </div>
        <span className="text-xs text-[var(--text-sub)]">{new Date(document.created_at).toLocaleDateString()}</span>
      </div>
    </Card>
  );
}
