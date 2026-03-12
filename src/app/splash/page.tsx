'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/dashboard');
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(165deg, #011E38 0%, #022D52 40%, #0B5491 100%)',
      }}
    >
      {/* Ambient glow behind icon */}
      <div
        className="absolute w-72 h-72 rounded-full blur-[120px] opacity-30 pointer-events-none"
        style={{ background: 'var(--accent, #069CA8)' }}
        aria-hidden="true"
      />

      {/* App icon */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
        className="relative z-10"
      >
        <Image
          src="/brand/app-icon.png"
          alt="HomeProjectIQ"
          width={96}
          height={96}
          className="rounded-3xl shadow-2xl"
          priority
        />
      </motion.div>

      {/* Wordmark */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          delay: 0.3,
          ease: "easeOut",
        }}
        className="relative z-10 mt-6 text-2xl font-bold tracking-tight"
        style={{
          fontFamily: "var(--font-instrument-serif, 'Instrument Serif', serif)",
          color: '#EEF3F7',
        }}
      >
        HomeProjectIQ
      </motion.h1>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="relative z-10 mt-2 text-sm"
        style={{ color: '#A0C4DB' }}
      >
        Your smart home companion
      </motion.p>

      {/* Subtle loading bar */}
      <motion.div
        className="absolute bottom-16 w-16 h-[2px] rounded-full overflow-hidden"
        style={{ background: 'rgba(160,230,242,0.15)' }}
      >
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            ease: 'linear',
          }}
          className="w-full h-full rounded-full"
          style={{ background: 'var(--accent-gradient, linear-gradient(90deg, #069CA8, #A0E6F2))' }}
        />
      </motion.div>
    </div>
  );
}
