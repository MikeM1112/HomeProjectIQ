'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type MascotMode =
  | 'default'
  | 'idea'
  | 'thumbs-up'
  | 'tools'
  | 'search'
  | 'checklist'
  | 'wave'
  | 'clipboard';

interface MascotCalloutProps {
  mode?: MascotMode;
  message: string;
  className?: string;
}

const mascotPaths: Record<MascotMode, string> = {
  default: '/brand/mascot-default.png',
  idea: '/brand/mascot-idea.png',
  'thumbs-up': '/brand/mascot-thumbs-up.png',
  tools: '/brand/mascot-tools.png',
  search: '/brand/mascot-search.png',
  checklist: '/brand/mascot-checklist.png',
  wave: '/img/mascot-wave.webp',
  clipboard: '/img/mascot-clipboard.webp',
};

export function MascotCallout({
  mode = 'default',
  message,
  className,
}: MascotCalloutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn('flex items-start gap-3', className)}
    >
      {/* Mascot */}
      <motion.div
        className="flex-shrink-0"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
      >
        <Image
          src={mascotPaths[mode]}
          alt="HomeProjectIQ mascot"
          width={56}
          height={56}
          className="object-contain"
        />
      </motion.div>

      {/* Speech bubble */}
      <div className="relative flex-1 rounded-[16px] bg-[var(--glass)] backdrop-blur-[16px] border border-[var(--glass-border)] shadow-[var(--card-shadow)] px-4 py-3">
        {/* Bubble tail */}
        <div
          className="absolute top-4 -left-2 w-3 h-3 rotate-45 bg-[var(--glass)] border-l border-b border-[var(--glass-border)]"
          aria-hidden="true"
        />
        <p className="text-sm text-[var(--text)] leading-relaxed relative z-10">
          {message}
        </p>
      </div>
    </motion.div>
  );
}
