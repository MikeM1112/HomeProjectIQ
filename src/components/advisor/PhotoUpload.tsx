'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_EXTENSIONS = '.jpg,.jpeg,.png,.webp,.heic,.heif';
const ACCEPTED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
];

interface PhotoUploadProps {
  onPhotoSelect: (file: File | null) => void;
  selectedPhoto: File | null;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function PhotoUpload({ onPhotoSelect, selectedPhoto }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateAndSetFile = useCallback(
    (file: File) => {
      setError(null);

      if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
        setError('Please upload a JPG, PNG, WebP, or HEIC image.');
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError('Photo must be under 10MB.');
        return;
      }

      onPhotoSelect(file);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    },
    [onPhotoSelect]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) validateAndSetFile(file);
    },
    [validateAndSetFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) validateAndSetFile(file);
    },
    [validateAndSetFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  // Revoke object URL on unmount to prevent memory leak
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemove = useCallback(() => {
    onPhotoSelect(null);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [onPhotoSelect]);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  if (selectedPhoto && previewUrl) {
    return (
      <div className="space-y-2">
        <div className="relative rounded-[20px] overflow-hidden border border-[var(--glass-border)] bg-[var(--glass)] shadow-[var(--card-shadow)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Uploaded photo preview"
            className="w-full h-48 object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className={cn(
              'absolute top-2 right-2 w-8 h-8 rounded-full',
              'bg-black/60 text-white flex items-center justify-center',
              'hover:bg-black/80 transition-colors tap'
            )}
            aria-label="Remove photo"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="4" y1="4" x2="12" y2="12" />
              <line x1="12" y1="4" x2="4" y2="12" />
            </svg>
          </button>
        </div>
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-ink-sub truncate max-w-[200px]">
            {selectedPhoto.name}
          </p>
          <p className="text-xs text-ink-dim">
            {formatFileSize(selectedPhoto.size)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        className={cn(
          'relative flex flex-col items-center justify-center gap-3',
          'rounded-[20px] border-2 border-dashed p-8 cursor-pointer',
          'transition-all duration-200 backdrop-blur-[16px]',
          isDragging
            ? 'border-[var(--accent)] bg-[var(--accent-soft)] scale-[1.01] shadow-[0_0_24px_var(--accent-glow)]'
            : 'border-[var(--dashed-border)] hover:border-[var(--accent)]/50 hover:bg-[var(--glass)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 focus-visible:ring-offset-2'
        )}
      >
        <div
          className={cn(
            'w-14 h-14 rounded-full flex items-center justify-center',
            'bg-brand/10 text-brand'
          )}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>

        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-ink">
            {isDragging ? 'Drop your photo here' : 'Upload a photo of the issue'}
          </p>
          <p className="text-xs text-ink-dim">
            Drag & drop, click to browse, or take a photo
          </p>
          <p className="text-xs text-ink-dim">
            JPG, PNG, WebP, HEIC up to 10MB
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={`${ACCEPTED_EXTENSIONS},image/*`}
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload photo"
      />

      {error && (
        <p className="text-xs text-danger px-1">{error}</p>
      )}
    </div>
  );
}
