interface PhoneMockupProps {
  children: React.ReactNode;
  className?: string;
  tilt?: 'left' | 'right' | 'none';
  glow?: boolean;
}

export function PhoneMockup({ children, className = '', tilt = 'none', glow = false }: PhoneMockupProps) {
  const rotation = tilt === 'left' ? 'rotate(-3deg)' : tilt === 'right' ? 'rotate(3deg)' : 'rotate(0deg)';

  return (
    <div className={`relative inline-block ${className}`} style={{ transform: rotation }}>
      {/* Ambient glow behind phone */}
      {glow && (
        <div
          className="absolute inset-0 scale-110 rounded-[48px] blur-[60px] opacity-[0.15] pointer-events-none -z-10"
          style={{ background: 'var(--accent-gradient)' }}
          aria-hidden="true"
        />
      )}

      {/* Phone frame */}
      <div
        className="relative rounded-[40px] p-[3px]"
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
          boxShadow: 'var(--phone-shadow)',
        }}
      >
        <div
          className="rounded-[38px] p-[8px]"
          style={{ background: 'var(--phone-border)' }}
        >
          {/* Notch */}
          <div
            className="absolute top-[14px] left-1/2 -translate-x-1/2 w-[80px] h-[22px] rounded-full z-10"
            style={{ background: 'var(--phone-border)' }}
          />

          {/* Screen area */}
          <div
            className="relative rounded-[32px] overflow-hidden"
            style={{ background: 'var(--bg)' }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
