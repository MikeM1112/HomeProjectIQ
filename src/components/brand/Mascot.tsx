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
      <svg viewBox="0 0 120 130" width={s} height={s} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`hg-${size}`} x1="60" y1="22" x2="60" y2="95" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1B5588" />
            <stop offset="45%" stopColor="#113D68" />
            <stop offset="100%" stopColor="#0A2845" />
          </linearGradient>
          <linearGradient id={`hs-${size}`} x1="28" y1="22" x2="75" y2="55" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`tg-${size}`} x1="60" y1="88" x2="60" y2="124" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1CC8BC" />
            <stop offset="100%" stopColor="#0EA5A8" />
          </linearGradient>
          <radialGradient id={`eg-${size}`} cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#80FFFF" />
            <stop offset="55%" stopColor="#00E5FF" />
            <stop offset="100%" stopColor="#00C8E0" />
          </radialGradient>
          <radialGradient id={`ag-${size}`} cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#80FFFF" />
            <stop offset="100%" stopColor="#00D4FF" />
          </radialGradient>
        </defs>

        {/* ── Teal Body ── */}
        <ellipse cx="60" cy="107" rx="22" ry="16" fill={`url(#tg-${size})`} />

        {/* Arms */}
        <ellipse cx="24" cy="103" rx="10" ry="5.5" fill={`url(#tg-${size})`} transform="rotate(-20, 24, 103)" />
        <ellipse cx="96" cy="103" rx="10" ry="5.5" fill={`url(#tg-${size})`} transform="rotate(20, 96, 103)" />

        {/* Hands */}
        <circle cx="16" cy="99" r="4" fill={`url(#tg-${size})`} />
        <circle cx="104" cy="99" r="4" fill={`url(#tg-${size})`} />

        {/* H-bone connector on body */}
        <rect x="55" y="99" width="10" height="8" rx="2.5" fill="#FFFFFF" opacity="0.45" />
        <rect x="56.5" y="97" width="2" height="12" rx="1" fill="#FFFFFF" opacity="0.45" />
        <rect x="61.5" y="97" width="2" height="12" rx="1" fill="#FFFFFF" opacity="0.45" />

        {/* ── House-shaped Head ── */}
        <path
          d="M 60 22 L 92 50 L 92 78 Q 92 94, 76 94 L 44 94 Q 28 94, 28 78 L 28 50 Z"
          fill={`url(#hg-${size})`}
        />
        <path
          d="M 60 22 L 92 50 L 92 78 Q 92 94, 76 94 L 44 94 Q 28 94, 28 78 L 28 50 Z"
          fill={`url(#hs-${size})`}
        />

        {/* ── Visor (White Face Plate) ── */}
        <rect x="34" y="52" width="52" height="36" rx="14" fill="#FFFFFF" opacity="0.95" />
        <rect x="34" y="52" width="52" height="36" rx="14" fill="none" stroke="rgba(200,230,255,0.25)" strokeWidth="0.5" />

        {/* ── Eyes ── */}
        <ellipse cx="48" cy="67" rx="8" ry="8" fill={`url(#eg-${size})`} />
        <ellipse cx="72" cy="67" rx="8" ry="8" fill={`url(#eg-${size})`} />
        <circle cx="45" cy="64" r="3" fill="#FFFFFF" opacity="0.85" />
        <circle cx="69" cy="64" r="3" fill="#FFFFFF" opacity="0.85" />

        {/* ── Smile ── */}
        <path d="M52 78 Q60 84 68 78" stroke="#00D4FF" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* ── Antenna Stems ── */}
        <line x1="42" y1="35" x2="34" y2="10" stroke="#1B5588" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="78" y1="35" x2="86" y2="10" stroke="#1B5588" strokeWidth="3.5" strokeLinecap="round" />

        {/* Antenna joints */}
        <circle cx="42" cy="36" r="3.5" fill={`url(#ag-${size})`} />
        <circle cx="78" cy="36" r="3.5" fill={`url(#ag-${size})`} />

        {/* Antenna balls */}
        <circle cx="34" cy="8" r="5.5" fill={`url(#ag-${size})`} />
        <circle cx="86" cy="8" r="5.5" fill={`url(#ag-${size})`} />
        <circle cx="32" cy="6" r="2" fill="#FFFFFF" opacity="0.7" />
        <circle cx="84" cy="6" r="2" fill="#FFFFFF" opacity="0.7" />

        {/* ── Mode: Tool (wrench) ── */}
        {mode === 'tool' && (
          <g transform="translate(100, 86) rotate(-30)">
            <rect x="-2" y="-18" width="4" height="20" rx="2" fill="#8BA3C0" />
            <path d="M-5,-20 Q-2,-24 2,-20 Q5,-24 8,-20 L6,-16 Q2,-18 -2,-16 Z" fill="#8BA3C0" />
          </g>
        )}

        {/* ── Mode: Diagnostic (magnifying glass) ── */}
        {mode === 'diagnostic' && (
          <g transform="translate(102, 88)">
            <circle cx="0" cy="0" r="7" fill="none" stroke="#8BA3C0" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="4" fill="rgba(0,229,255,0.15)" />
            <line x1="5" y1="5" x2="12" y2="12" stroke="#8BA3C0" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}

        {/* ── Mode: Celebrate (sparkles) ── */}
        {mode === 'celebrate' && (
          <g>
            <path d="M14 30 L16 25 L18 30 L13 27.5 L19 27.5 Z" fill="#FBBF24" />
            <path d="M102 25 L104 20 L106 25 L101 22.5 L107 22.5 Z" fill="#00E5FF" />
            <path d="M108 70 L110 65 L112 70 L107 67.5 L113 67.5 Z" fill="#10B981" />
            <circle cx="10" cy="55" r="2" fill="#FBBF24" opacity="0.7" />
            <circle cx="112" cy="50" r="2" fill="#00E5FF" opacity="0.7" />
          </g>
        )}
      </svg>
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
