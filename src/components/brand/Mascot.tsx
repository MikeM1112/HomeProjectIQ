'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface MascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  mode?: 'default' | 'tool' | 'diagnostic' | 'celebrate' | 'idea' | 'checklist' | 'arms-crossed' | 'tools-full';
  className?: string;
  animate?: boolean;
}

const sizes = {
  sm: 40,
  md: 64,
  lg: 96,
  xl: 140,
  xxl: 200,
};

const modeImages: Record<string, string> = {
  default: '/brand/mascot-primary.png',
  tool: '/brand/mascot-tools.png',
  diagnostic: '/brand/mascot-search.png',
  celebrate: '/brand/mascot-thumbs-up.png',
  idea: '/brand/mascot-idea.png',
  checklist: '/brand/mascot-checklist.png',
  'arms-crossed': '/brand/mascot-arms-crossed.png',
  'tools-full': '/brand/mascot-with-tools-full.png',
};

export function Mascot({ size = 'md', mode = 'default', className, animate = true }: MascotProps) {
  const s = sizes[size];
  const src = modeImages[mode] || modeImages.default;

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center',
        animate && 'motion-safe:animate-float',
        className,
      )}
      style={{ width: s, height: s }}
    >
      <Image
        src={src}
        alt="HomeProjectIQ mascot"
        width={s}
        height={s}
        className="object-contain"
        priority={size === 'lg' || size === 'xl' || size === 'xxl'}
      />
    </div>
  );
}

export function MascotGreeting({ name }: { name?: string | null }) {
  return (
    <div className="flex items-center gap-3">
      <Mascot size="sm" />
      <div>
        <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
          {name ? `Welcome back, ${name}!` : 'Welcome!'}
        </p>
        <p className="text-xs" style={{ color: 'var(--text-sub)' }}>Your home assistant is ready</p>
      </div>
    </div>
  );
}
