'use client';

import { SKILL_TREES } from '@/lib/constants';
import { CATEGORIES } from '@/lib/project-data';
import type { Project } from '@/types/app';

/** Map skill tree IDs to their CATEGORIES color, with fallbacks */
const SKILL_COLORS: Record<string, string> = {
  plumbing: CATEGORIES.find((c) => c.id === 'plumbing')?.clr ?? '#1565C0',
  electrical: CATEGORIES.find((c) => c.id === 'electric')?.clr ?? '#F9A825',
  carpentry: CATEGORIES.find((c) => c.id === 'deck')?.clr ?? '#6D4C41',
  painting: CATEGORIES.find((c) => c.id === 'painting')?.clr ?? '#C05E14',
  landscaping: CATEGORIES.find((c) => c.id === 'lawn')?.clr ?? '#2D8A4E',
  tiling: CATEGORIES.find((c) => c.id === 'tile')?.clr ?? '#5D4037',
  hvac: CATEGORIES.find((c) => c.id === 'hvac')?.clr ?? '#0097A7',
  masonry: CATEGORIES.find((c) => c.id === 'concrete')?.clr ?? '#757575',
};

/** Map skill IDs to related category IDs for project counting */
const SKILL_TO_CATEGORIES: Record<string, string[]> = {
  plumbing: ['plumbing'],
  electrical: ['electric'],
  carpentry: ['deck', 'ceiling'],
  painting: ['painting'],
  landscaping: ['lawn'],
  tiling: ['tile'],
  hvac: ['hvac'],
  masonry: ['concrete'],
};

const LEVEL_LABELS = ['', 'Novice', 'Apprentice', 'Competent', 'Proficient', 'Expert'];

interface SkillTreeProps {
  skills: Record<string, number>;
  projects: Project[];
}

export function SkillTree({ skills, projects }: SkillTreeProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {SKILL_TREES.map((skill, i) => {
        const level = skills[skill.id] ?? 0;
        const unlocked = level > 0;
        const color = SKILL_COLORS[skill.id] ?? 'var(--accent)';
        const relatedCats = SKILL_TO_CATEGORIES[skill.id] ?? [];
        const completedCount = projects.filter(
          (p) => relatedCats.includes(p.category_id) && p.status === 'completed'
        ).length;

        // Progress within the current level toward the next (simple: projects mod 3)
        const progressInLevel = level >= skill.maxLevel ? 100 : Math.min(100, ((completedCount % 3) / 3) * 100);

        return (
          <div
            key={skill.id}
            className="animate-rise opacity-0 rounded-2xl border border-[var(--glass-border)] p-3 transition-all duration-300"
            style={{
              background: 'var(--glass)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              animationDelay: `${i * 60}ms`,
              animationFillMode: 'forwards',
            }}
          >
            <div
              className="flex flex-col items-center gap-2 text-center"
              style={{ opacity: unlocked ? 1 : 0.38 }}
            >
              {/* Icon circle with radial progress arc */}
              <div className="relative w-14 h-14 flex items-center justify-center">
                {/* SVG arc gauge behind the icon */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 56 56"
                  style={{ transform: 'rotate(-90deg)' }}
                >
                  {/* Track */}
                  <circle
                    cx="28"
                    cy="28"
                    r="24"
                    fill="none"
                    stroke="var(--glass-border)"
                    strokeWidth="3"
                  />
                  {/* Progress */}
                  {unlocked && (
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      fill="none"
                      stroke={color}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={`${(2 * Math.PI * 24 * progressInLevel) / 100} ${2 * Math.PI * 24}`}
                      style={{
                        filter: `drop-shadow(0 0 4px ${color}66)`,
                        transition: 'stroke-dasharray 600ms ease-in-out',
                      }}
                    />
                  )}
                </svg>
                {/* Icon background circle */}
                <div
                  className="relative w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: unlocked ? `${color}1A` : 'var(--icon-bg)',
                  }}
                >
                  <span className="text-[22px] leading-none">{skill.icon}</span>
                </div>
              </div>

              {/* Category name */}
              <p className="text-sm font-semibold text-[var(--text)] leading-tight">
                {skill.label}
              </p>

              {/* Level label */}
              <p
                className="text-[10px] font-medium leading-tight"
                style={{ color: unlocked ? color : 'var(--text-dim)' }}
              >
                {unlocked ? LEVEL_LABELS[level] : 'Locked'}
              </p>

              {/* Level dots */}
              <div className="flex items-center gap-1">
                {Array.from({ length: skill.maxLevel }).map((_, dotIdx) => {
                  const filled = dotIdx < level;
                  return (
                    <div
                      key={dotIdx}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: '8px',
                        height: '8px',
                        background: filled ? color : 'var(--glass-border)',
                        boxShadow: filled ? `0 0 6px ${color}88` : 'none',
                      }}
                    />
                  );
                })}
              </div>

              {/* Project count */}
              {unlocked && (
                <p className="text-[10px] text-[var(--text-dim)]">
                  {completedCount} project{completedCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
