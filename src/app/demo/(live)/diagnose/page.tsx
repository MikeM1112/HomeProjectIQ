'use client';

import { useRef } from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  Camera,
  ImagePlus,
  PenLine,
  ListChecks,
  AlertTriangle,
  Upload,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Navbar } from '@/components/layout/Navbar';
import { Mascot } from '@/components/brand/Mascot';
import { Button } from '@/components/ui/Button';
import { useUIStore } from '@/stores/uiStore';

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

export default function DemoDiagnosePage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const { showToast } = useUIStore();

  const handleAction = () => {
    showToast('Sign up to use AI Diagnosis!', 'info');
  };

  return (
    <>
      <Navbar title="Diagnose" />
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-[480px] lg:max-w-2xl mx-auto px-4 py-6"
      >
        {/* Header */}
        <motion.div variants={item} className="text-center mb-6">
          <h1
            className="text-2xl font-bold mb-1"
            style={{
              fontFamily: "var(--font-instrument-serif, 'Instrument Serif', serif)",
              color: 'var(--text)',
            }}
          >
            What&apos;s going on?
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-sub)' }}>
            Snap a photo, upload from gallery, or describe the issue
          </p>
        </motion.div>

        {/* Mascot helper art */}
        <motion.div variants={item} className="flex justify-center mb-6">
          <Mascot size="xl" mode="diagnostic" />
        </motion.div>

        {/* Upload panel */}
        <motion.div
          variants={item}
          className="relative rounded-[20px] p-6 mb-4 text-center cursor-pointer group"
          style={{
            background: 'var(--glass)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '2px dashed var(--dashed-border)',
            transition: 'border-color 0.3s ease',
          }}
          onClick={handleAction}
          whileHover={{
            borderColor: 'var(--accent)',
            scale: 1.01,
          }}
          whileTap={{ scale: 0.99 }}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAction}
          />

          <div
            className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
            style={{ background: 'var(--accent-soft)' }}
          >
            <Upload className="w-6 h-6" style={{ color: 'var(--accent)' }} />
          </div>

          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>
            Drop a photo here
          </p>
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
            or tap to browse your files
          </p>
        </motion.div>

        {/* Primary CTAs */}
        <motion.div variants={item} className="grid grid-cols-2 gap-3 mb-4">
          <Button size="lg" className="w-full" onClick={handleAction}>
            <Camera className="w-5 h-5" />
            Take Photo
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={handleAction}
          >
            <ImagePlus className="w-5 h-5" />
            Gallery
          </Button>
        </motion.div>

        {/* Manual entry link */}
        <motion.div variants={item} className="text-center mb-6">
          <button
            onClick={handleAction}
            className="text-sm font-medium transition-colors hover:underline"
            style={{ color: 'var(--accent)' }}
          >
            <PenLine className="w-4 h-4 inline-block mr-1 -mt-0.5" />
            Describe the issue manually
          </button>
        </motion.div>

        {/* Divider */}
        <motion.div variants={item} className="section-divider mb-6" />

        {/* Secondary entry cards */}
        <motion.div variants={item} className="grid grid-cols-2 gap-3">
          {/* Guided Walkthrough */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAction}
            className={cn(
              'rounded-[20px] p-4 text-left transition-all duration-300',
              'hover:border-[var(--glass-border-hover)]'
            )}
            style={{
              background: 'var(--glass)',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--card-shadow)',
            }}
          >
            <div
              className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center"
              style={{ background: 'var(--emerald-soft)' }}
            >
              <ListChecks className="w-5 h-5" style={{ color: 'var(--emerald)' }} />
            </div>
            <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text)' }}>
              Guided Walkthrough
            </p>
            <p className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
              Answer questions to narrow it down
            </p>
          </motion.button>

          {/* Emergency */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAction}
            className={cn(
              'rounded-[20px] p-4 text-left transition-all duration-300',
              'hover:border-[var(--glass-border-hover)]'
            )}
            style={{
              background: 'var(--glass)',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--card-shadow)',
            }}
          >
            <div
              className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center"
              style={{ background: 'var(--danger-soft)' }}
            >
              <AlertTriangle className="w-5 h-5" style={{ color: 'var(--danger)' }} />
            </div>
            <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text)' }}>
              Emergency
            </p>
            <p className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
              Water leak, gas, electrical hazard
            </p>
          </motion.button>
        </motion.div>
      </motion.div>
    </>
  );
}
