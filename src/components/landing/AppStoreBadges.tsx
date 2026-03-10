export function AppStoreBadge() {
  return (
    <a href="#" className="inline-block hover:opacity-80 transition-opacity" aria-label="Download on the App Store">
      <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="40" rx="6" fill="black" />
        <rect x="0.5" y="0.5" width="119" height="39" rx="5.5" stroke="white" strokeOpacity="0.3" />
        <text x="42" y="14" fill="white" fontSize="7" fontFamily="system-ui" fontWeight="400">Download on the</text>
        <text x="42" y="28" fill="white" fontSize="14" fontFamily="system-ui" fontWeight="600">App Store</text>
        <g transform="translate(12, 7) scale(0.65)">
          <path d="M24.769 20.3a5.98 5.98 0 012.85-5.01 6.13 6.13 0 00-4.83-2.61c-2.03-.21-4 1.21-5.04 1.21-1.05 0-2.64-1.19-4.36-1.16A6.42 6.42 0 008 16.17c-2.33 4.04-.59 9.98 1.65 13.24 1.12 1.6 2.43 3.38 4.15 3.32 1.68-.07 2.31-1.07 4.33-1.07 2.01 0 2.6 1.07 4.34 1.03 1.8-.03 2.93-1.61 4.02-3.22a13.4 13.4 0 001.82-3.74 5.77 5.77 0 01-3.54-5.43zM21.63 10.81a5.89 5.89 0 001.35-4.23 5.99 5.99 0 00-3.88 2.01 5.61 5.61 0 00-1.38 4.06 4.96 4.96 0 003.91-1.84z" fill="white" />
        </g>
      </svg>
    </a>
  );
}

export function GooglePlayBadge() {
  return (
    <a href="#" className="inline-block hover:opacity-80 transition-opacity" aria-label="Get it on Google Play">
      <svg width="135" height="40" viewBox="0 0 135 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="135" height="40" rx="6" fill="black" />
        <rect x="0.5" y="0.5" width="134" height="39" rx="5.5" stroke="white" strokeOpacity="0.3" />
        <text x="48" y="14" fill="white" fontSize="7" fontFamily="system-ui" fontWeight="400">GET IT ON</text>
        <text x="48" y="28" fill="white" fontSize="13" fontFamily="system-ui" fontWeight="600">Google Play</text>
        <g transform="translate(12, 7)">
          <path d="M7.54 3.5L17.04 13l-9.5 9.5a2 2 0 010-2.83L14.37 13 7.54 6.33a2 2 0 010-2.83z" fill="#4285F4" />
          <path d="M7.54 3.5a2 2 0 012.83 0l9.5 9.5-3.54 3.54L7.54 6.33V3.5z" fill="#34A853" />
          <path d="M19.87 13l-3.54 3.54-8.79 8.79a2 2 0 01-2.83-2.83L14.37 13" fill="#FBBC05" />
          <path d="M19.87 13L16.33 9.46 7.54 3.5a2 2 0 012.83 0L19.87 13z" fill="#EA4335" />
        </g>
      </svg>
    </a>
  );
}
