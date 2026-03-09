'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ShareButtonProps {
  projectId: string;
  title: string;
  confidence: number;
  verdict: string;
  savings: number;
}

interface ShareOption {
  id: string;
  label: string;
  icon: string;
  action: () => void;
}

export function ShareButton({ projectId, title, confidence, verdict, savings }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/share/${projectId}`
    : `/share/${projectId}`;

  const shareText = `I just got my DIY assessment for "${title}" — ${confidence}/100 confidence! Check it out:`;

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} - HomeProjectIQ Assessment`,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled share
      }
      setOpen(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setOpen(false);
  };

  const handleFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setOpen(false);
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setOpen(false);
  };

  const handleShareClick = () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      handleNativeShare();
    } else {
      setOpen(!open);
    }
  };

  const options: ShareOption[] = [
    { id: 'copy', label: copied ? 'Link Copied!' : 'Copy Link', icon: copied ? '\u2705' : '\u{1F517}', action: handleCopyLink },
    { id: 'twitter', label: 'Share on X', icon: '\u{1D54F}', action: handleTwitter },
    { id: 'facebook', label: 'Share on Facebook', icon: '\u{1F30D}', action: handleFacebook },
    { id: 'whatsapp', label: 'Share on WhatsApp', icon: '\u{1F4AC}', action: handleWhatsApp },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="secondary"
        size="md"
        className="gap-2"
        onClick={handleShareClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        Share Result
      </Button>

      {/* Dropdown / bottom sheet */}
      {open && (
        <>
          {/* Mobile backdrop */}
          <div className="fixed inset-0 bg-black/20 z-40 sm:hidden" onClick={() => setOpen(false)} />

          {/* Mobile bottom sheet */}
          <div className={cn(
            'fixed bottom-0 left-0 right-0 z-50 sm:hidden',
            'bg-white rounded-t-2xl shadow-lg animate-slideUp',
            'pb-safe-bottom'
          )}>
            <div className="w-10 h-1 bg-border rounded-full mx-auto mt-3" />
            <div className="p-4 space-y-1">
              <p className="text-sm font-semibold text-ink mb-3">Share this assessment</p>
              {options.map((option) => (
                <button
                  key={option.id}
                  onClick={option.action}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left',
                    'hover:bg-surface-muted transition-colors tap',
                    option.id === 'copy' && copied && 'bg-success-light'
                  )}
                >
                  <span className="text-lg">{option.icon}</span>
                  <span className="text-sm font-medium text-ink">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Desktop dropdown */}
          <div className={cn(
            'hidden sm:block absolute right-0 top-full mt-2 z-50',
            'bg-white rounded-xl shadow-md border border-border',
            'min-w-[220px] animate-rise overflow-hidden'
          )}>
            <div className="p-2 space-y-0.5">
              {options.map((option) => (
                <button
                  key={option.id}
                  onClick={option.action}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left',
                    'hover:bg-surface-muted transition-colors',
                    option.id === 'copy' && copied && 'bg-success-light'
                  )}
                >
                  <span className="text-base">{option.icon}</span>
                  <span className="text-sm font-medium text-ink">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
