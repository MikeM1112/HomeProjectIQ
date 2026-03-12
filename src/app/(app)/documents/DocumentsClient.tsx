'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Receipt,
  ShieldCheck,
  BookOpen,
  ClipboardCheck,
  Folder,
  Plus,
  ExternalLink,
  Calendar,
  HardDrive,
  Filter,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Mascot } from '@/components/brand/Mascot';
import { useDocuments } from '@/hooks/useTimeline';
import { formatDate, cn } from '@/lib/utils';
import type { DocumentType, HomeDocument } from '@/types/app';

type DocFilter = 'all' | DocumentType;

const docFilters: { key: DocFilter; label: string; icon: React.ReactNode }[] = [
  { key: 'all', label: 'All', icon: <Filter size={12} /> },
  { key: 'receipt', label: 'Receipts', icon: <Receipt size={12} /> },
  { key: 'warranty', label: 'Warranties', icon: <ShieldCheck size={12} /> },
  { key: 'manual', label: 'Manuals', icon: <BookOpen size={12} /> },
  { key: 'inspection_report', label: 'Inspections', icon: <ClipboardCheck size={12} /> },
  { key: 'other', label: 'Other', icon: <Folder size={12} /> },
];

const typeIcons: Record<string, React.ReactNode> = {
  receipt: <Receipt size={16} />,
  warranty: <ShieldCheck size={16} />,
  manual: <BookOpen size={16} />,
  inspection_report: <ClipboardCheck size={16} />,
  insurance: <ShieldCheck size={16} />,
  permit: <FileText size={16} />,
  contract: <FileText size={16} />,
  photo: <HardDrive size={16} />,
  other: <Folder size={16} />,
};

const typeColors: Record<string, string> = {
  receipt: 'var(--emerald)',
  warranty: 'var(--info)',
  manual: 'var(--accent)',
  inspection_report: 'var(--gold)',
  insurance: 'var(--info)',
  permit: 'var(--text-sub)',
  contract: 'var(--text-sub)',
  photo: 'var(--accent)',
  other: 'var(--text-sub)',
};

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function formatFileSize(bytes: number | null): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function DocumentCard({ doc }: { doc: HomeDocument }) {
  const icon = typeIcons[doc.document_type] ?? typeIcons.other;
  const color = typeColors[doc.document_type] ?? typeColors.other;

  return (
    <GlassPanel padding="sm" hover>
      <a
        href={doc.file_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-3 no-underline"
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'var(--chip-bg)', color }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="text-sm font-semibold truncate"
              style={{ color: 'var(--text)' }}
            >
              {doc.title}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px]" style={{ color: 'var(--text-sub)' }}>
              {formatDate(doc.created_at)}
            </span>
            {doc.file_type && (
              <Badge variant="default">
                {doc.file_type.toUpperCase()}
              </Badge>
            )}
            {doc.file_size && (
              <span className="text-[10px]" style={{ color: 'var(--text-sub)' }}>
                {formatFileSize(doc.file_size)}
              </span>
            )}
          </div>
          {doc.description && (
            <p
              className="text-xs mt-1 line-clamp-1"
              style={{ color: 'var(--text-sub)' }}
            >
              {doc.description}
            </p>
          )}
          {doc.property_id && (
            <div className="mt-1">
              <Badge variant="info">Property</Badge>
            </div>
          )}
          {doc.expires_at && (
            <div className="flex items-center gap-1 mt-1">
              <Calendar size={10} style={{ color: 'var(--gold)' }} />
              <span
                className="text-[10px]"
                style={{ color: 'var(--gold)' }}
              >
                Expires {formatDate(doc.expires_at)}
              </span>
            </div>
          )}
        </div>
        <ExternalLink
          size={14}
          className="shrink-0 mt-1"
          style={{ color: 'var(--text-sub)' }}
        />
      </a>
    </GlassPanel>
  );
}

export function DocumentsClient() {
  const [activeFilter, setActiveFilter] = useState<DocFilter>('all');
  const { documents, isLoading } = useDocuments();

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return documents;
    return documents.filter((d) => d.document_type === activeFilter);
  }, [documents, activeFilter]);

  return (
    <>
      <Navbar title="Documents" showBack backHref="/dashboard" />
      <PageWrapper>
        <div className="space-y-4">
          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
            {docFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0',
                  activeFilter === f.key
                    ? 'text-white shadow-[0_2px_8px_var(--accent-glow)]'
                    : 'border text-[var(--text-sub)] hover:text-[var(--text)]'
                )}
                style={
                  activeFilter === f.key
                    ? { background: 'var(--accent-gradient, var(--accent))' }
                    : {
                        background: 'var(--glass)',
                        borderColor: 'var(--glass-border)',
                      }
                }
              >
                {f.icon}
                {f.label}
              </button>
            ))}
          </div>

          {/* Document List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size="lg" />
            </div>
          ) : filtered.length === 0 ? (
            <GlassPanel padding="lg" className="text-center">
              <Mascot mode="checklist" size="lg" className="mx-auto mb-3" />
              <p
                className="text-sm font-semibold mb-1"
                style={{ color: 'var(--text)' }}
              >
                No documents yet
              </p>
              <p className="text-xs" style={{ color: 'var(--text-sub)' }}>
                Upload receipts, warranties, manuals, and inspection reports
                to keep everything organized.
              </p>
            </GlassPanel>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                variants={stagger}
                initial="hidden"
                animate="show"
                className="space-y-2"
              >
                {filtered.map((doc) => (
                  <motion.div key={doc.id} variants={fadeUp}>
                    <DocumentCard doc={doc} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Floating Upload Button */}
        <motion.button
          className="fixed bottom-24 right-4 w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-40"
          style={{
            background: 'var(--accent-gradient, var(--accent))',
            boxShadow: '0 4px 20px var(--accent-glow)',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Plus size={24} className="text-white" />
        </motion.button>
      </PageWrapper>
    </>
  );
}
