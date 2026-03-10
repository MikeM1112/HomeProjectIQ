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
      {/* Two-layer ambient glow */}
      {glow && (
        <>
          <div
            className="absolute inset-0 scale-[1.15] rounded-[48px] blur-[80px] opacity-[0.18] pointer-events-none -z-10"
            style={{ background: 'var(--accent)' }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 scale-[1.05] rounded-[44px] blur-[30px] opacity-[0.06] pointer-events-none -z-10"
            style={{ background: 'var(--accent-gradient)' }}
            aria-hidden="true"
          />
        </>
      )}

      {/* Phone frame */}
      <div
        className="relative rounded-[40px] p-[3px]"
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
          boxShadow: 'var(--phone-shadow)',
        }}
      >
        <div
          className="rounded-[38px] p-[8px]"
          style={{ background: 'var(--phone-border)' }}
        >
          {/* Dynamic island notch */}
          <div
            className="absolute top-[14px] left-1/2 -translate-x-1/2 w-[72px] h-[22px] rounded-full z-10 flex items-center justify-center"
            style={{ background: '#000', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)' }}
          >
            <div className="w-[6px] h-[6px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.3), #111)' }} />
          </div>

          {/* Side button */}
          <div className="absolute right-[-2px] top-[100px] w-[3px] h-[30px] rounded-r-sm" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))' }} aria-hidden="true" />

          {/* Screen area */}
          <div className="relative rounded-[32px] overflow-hidden" style={{ background: 'var(--bg)' }}>
            {children}
            {/* Screen reflection */}
            <div className="absolute inset-0 rounded-[32px] pointer-events-none z-20" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%, rgba(255,255,255,0.01) 100%)' }} aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}
