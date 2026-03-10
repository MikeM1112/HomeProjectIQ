'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface MascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  mode?: 'default' | 'tool' | 'diagnostic' | 'celebrate';
  className?: string;
  animate?: boolean;
}

const sizes = {
  sm: 40,
  md: 64,
  lg: 96,
  xl: 140,
};

const modeImages: Record<string, string> = {
  default: '/brand/mascot-primary.png',
  tool: '/brand/mascot-tools.png',
  diagnostic: '/brand/mascot-search.png',
  celebrate: '/brand/mascot-thumbs-up.png',
};

export function Mascot({ size = 'md', mode = 'default', className, animate = true }: MascotProps) {
  const s = sizes[size];
  const src = modeImages[mode] || modeImages.default;

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center',
        animate && 'animate-float',
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
        priority={size === 'lg' || size === 'xl'}
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
