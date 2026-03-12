'use client';

import { motion, type Variants } from 'framer-motion';
import {
  Camera,
  ImagePlus,
  FileText,
  DollarSign,
  Users,
  Telescope,
  ChevronRight,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Mascot } from '@/components/brand/Mascot';
import { Button } from '@/components/ui/Button';
import { useUIStore } from '@/stores/uiStore';

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

const SCOPE_STEPS = [
  { icon: FileText, label: 'Scope of work', desc: 'Detailed breakdown of every task' },
  { icon: DollarSign, label: 'Cost estimates', desc: 'DIY vs contractor pricing' },
  { icon: Users, label: 'Labor estimate', desc: 'Time and skill requirements' },
];

export default function DemoScopePage() {
  const { showToast } = useUIStore();

  const handleDemo = () => {
    showToast('Sign up to use ProjectScopePro!', 'info');
  };

  return (
    <>
      <Navbar title="ProjectScopePro" />
      <PageWrapper withGlow>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* Hero header */}
          <motion.div variants={item} className="text-center pt-4">
            <div className="flex justify-center mb-3">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'var(--accent-soft)',
                  border: '1px solid rgba(6,156,168,0.15)',
                }}
              >
                <Telescope className="w-8 h-8" style={{ color: 'var(--accent)' }} />
              </div>
            </div>
            <h1 className="font-serif text-2xl text-[var(--text)] mb-2">Plan a Bigger Project</h1>
            <p className="text-sm text-[var(--text-sub)] max-w-xs mx-auto leading-relaxed">
              Upload photos and AI will generate a complete project scope with cost estimates.
            </p>
          </motion.div>

          {/* Upload area */}
          <motion.div variants={item}>
            <div
              className="rounded-[20px] border-2 border-dashed p-8 text-center"
              style={{
                borderColor: 'var(--dashed-border)',
                background: 'var(--glass)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div className="flex justify-center mb-3">
                <Camera className="w-10 h-10" style={{ color: 'var(--accent)' }} />
              </div>
              <p className="text-sm font-semibold text-[var(--text)] mb-1">Upload Project Photos</p>
              <p className="text-xs text-[var(--text-dim)] mb-4">
                Take photos of the area, damage, or renovation target
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={handleDemo} size="md">
                  <Camera className="w-4 h-4 mr-1.5" />
                  Camera
                </Button>
                <Button onClick={handleDemo} size="md" variant="secondary">
                  <ImagePlus className="w-4 h-4 mr-1.5" />
                  Gallery
                </Button>
              </div>
            </div>
          </motion.div>

          {/* What you get */}
          <motion.div variants={item}>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-dim)' }}>
              AI GENERATES
            </h2>
            <div className="space-y-2">
              {SCOPE_STEPS.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.label}
                    className="flex items-center gap-3 rounded-[16px] p-4"
                    style={{
                      background: 'var(--glass)',
                      border: '1px solid var(--glass-border)',
                      backdropFilter: 'blur(16px)',
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'var(--accent-soft)' }}
                    >
                      <Icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--text)]">{step.label}</p>
                      <p className="text-xs text-[var(--text-dim)]">{step.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 shrink-0" style={{ color: 'var(--text-dim)' }} />
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Example scope card */}
          <motion.div variants={item}>
            <div
              className="rounded-[20px] p-5 relative overflow-hidden"
              style={{
                background: 'var(--glass)',
                border: '1px solid var(--glass-border)',
                backdropFilter: 'blur(24px)',
                boxShadow: 'var(--card-shadow)',
              }}
            >
              <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'var(--accent-gradient)' }} />
              <div className="relative">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-dim)' }}>
                  EXAMPLE OUTPUT
                </p>
                <h3 className="text-base font-bold text-[var(--text)] mb-3">Bathroom Vanity Replacement</h3>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-[10px] text-[var(--text-dim)]">DIY Cost</p>
                    <p className="text-xl font-bold" style={{ color: 'var(--emerald)' }}>$280</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--text-dim)]">Contractor Cost</p>
                    <p className="text-xl font-bold" style={{ color: 'var(--gold)' }}>$1,150</p>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-sub)] leading-relaxed">
                  Approved quotes are sent to the contractor marketplace.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Mascot encouragement */}
          <motion.div variants={item} className="flex items-center gap-3 pb-4">
            <Mascot size="sm" mode="checklist" animate={false} />
            <p className="text-xs text-[var(--text-dim)]">
              AI-powered scoping helps you make confident decisions.
            </p>
          </motion.div>
        </motion.div>
      </PageWrapper>
    </>
  );
}
