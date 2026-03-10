'use client';

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

export function Mascot({ size = 'md', mode = 'default', className, animate = true }: MascotProps) {
  const s = sizes[size];

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center',
        animate && 'animate-float',
        className,
      )}
      style={{ width: s, height: s }}
    >
      <svg viewBox="0 0 120 120" width={s} height={s} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Body */}
        <rect x="25" y="38" width="70" height="58" rx="20" fill="url(#bodyGrad)" />
        <rect x="25" y="38" width="70" height="58" rx="20" fill="url(#bodySheen)" fillOpacity="0.3" />
        <rect x="25" y="38" width="70" height="58" rx="20" stroke="url(#bodyStroke)" strokeWidth="1.5" />

        {/* Hard Hat */}
        <path d="M30 44 C30 28, 90 28, 90 44 L88 48 L32 48 Z" fill="#FBBF24" />
        <path d="M30 44 C30 28, 90 28, 90 44 L88 48 L32 48 Z" fill="url(#hatSheen)" fillOpacity="0.4" />
        <rect x="28" y="43" width="64" height="6" rx="3" fill="#E5A913" />
        <rect x="52" y="28" width="16" height="8" rx="4" fill="#FCD34D" />

        {/* Face screen */}
        <rect x="35" y="52" width="50" height="32" rx="10" fill="#0A1628" fillOpacity="0.85" />
        <rect x="35" y="52" width="50" height="32" rx="10" stroke="rgba(100,180,255,0.15)" strokeWidth="1" />

        {/* Eyes */}
        <circle cx="48" cy="66" r="5" fill="#3B9EFF" />
        <circle cx="48" cy="66" r="2.5" fill="#FFFFFF" />
        <circle cx="72" cy="66" r="5" fill="#3B9EFF" />
        <circle cx="72" cy="66" r="2.5" fill="#FFFFFF" />

        {/* Smile */}
        <path d="M52 76 Q60 82, 68 76" stroke="#3B9EFF" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Antenna */}
        <line x1="60" y1="28" x2="60" y2="18" stroke="#8BA3C0" strokeWidth="2" />
        <circle cx="60" cy="15" r="4" fill="#3B9EFF" opacity="0.9" />
        <circle cx="60" cy="15" r="2" fill="#FFFFFF" opacity="0.8" />

        {/* Arms */}
        <rect x="14" y="55" width="14" height="8" rx="4" fill="url(#bodyGrad)" />
        <rect x="92" y="55" width="14" height="8" rx="4" fill="url(#bodyGrad)" />

        {/* Tool (wrench) - shown in tool mode */}
        {mode === 'tool' && (
          <g transform="translate(96, 48) rotate(25)">
            <rect x="0" y="0" width="4" height="20" rx="2" fill="#8BA3C0" />
            <circle cx="2" cy="2" r="5" fill="none" stroke="#8BA3C0" strokeWidth="2" />
          </g>
        )}

        {/* Diagnostic sparkle - shown in diagnostic mode */}
        {mode === 'diagnostic' && (
          <g>
            <circle cx="98" cy="45" r="3" fill="#FBBF24" opacity="0.8" />
            <circle cx="104" cy="52" r="2" fill="#3B9EFF" opacity="0.6" />
            <circle cx="100" cy="38" r="2" fill="#10B981" opacity="0.7" />
          </g>
        )}

        {/* Celebration stars */}
        {mode === 'celebrate' && (
          <g>
            <path d="M15 35 L17 31 L19 35 L15 33 L19 33 Z" fill="#FBBF24" />
            <path d="M100 30 L102 26 L104 30 L100 28 L104 28 Z" fill="#3B9EFF" />
            <path d="M108 68 L110 64 L112 68 L108 66 L112 66 Z" fill="#10B981" />
          </g>
        )}

        {/* Level badge */}
        <circle cx="90" cy="88" r="10" fill="url(#bodyGrad)" stroke="rgba(100,180,255,0.2)" strokeWidth="1" />
        <text x="90" y="92" textAnchor="middle" fill="#F0F6FF" fontSize="10" fontWeight="700" fontFamily="system-ui">IQ</text>

        <defs>
          <linearGradient id="bodyGrad" x1="25" y1="38" x2="95" y2="96" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2A7DE1" />
            <stop offset="100%" stopColor="#1A5FB4" />
          </linearGradient>
          <linearGradient id="bodySheen" x1="25" y1="38" x2="60" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="bodyStroke" x1="25" y1="38" x2="95" y2="96" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(100,180,255,0.3)" />
            <stop offset="100%" stopColor="rgba(100,180,255,0.1)" />
          </linearGradient>
          <linearGradient id="hatSheen" x1="30" y1="28" x2="60" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export function MascotGreeting({ name }: { name?: string | null }) {
  return (
    <div className="flex items-center gap-3">
      <Mascot size="sm" />
      <div>
        <p className="text-sm font-semibold text-ink">
          {name ? `Welcome back, ${name}!` : 'Welcome!'}
        </p>
        <p className="text-xs text-ink-sub">Your home assistant is ready</p>
      </div>
    </div>
  );
}
