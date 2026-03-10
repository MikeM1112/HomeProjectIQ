'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { ProMarketplaceData, FeasibilityProject } from '@/lib/demo-data';

interface ProMarketplaceProps {
  data: ProMarketplaceData;
  onAction?: () => void;
}

function getFeasColor(score: number): string {
  if (score >= 75) return 'var(--emerald)';
  if (score >= 50) return 'var(--gold)';
  return 'var(--danger)';
}

function getSkillColor(userLevel: number, required: number): string {
  if (userLevel >= required) return 'var(--emerald)';
  if (userLevel >= required - 1) return 'var(--gold)';
  return 'var(--danger)';
}

const LABEL_STYLES: Record<FeasibilityProject['label'], { bg: string; color: string }> = {
  'Easy DIY': { bg: 'var(--emerald-soft)', color: 'var(--emerald)' },
  'Moderate DIY': { bg: 'var(--gold-soft)', color: 'var(--gold)' },
  'Advanced DIY': { bg: 'var(--accent-soft)', color: 'var(--accent)' },
  'Hire a Pro': { bg: 'var(--danger-soft)', color: 'var(--danger)' },
};

export function ProMarketplace({ data, onAction }: ProMarketplaceProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div>
      <h3 className="font-serif text-lg mb-3" style={{ color: 'var(--text)' }}>
        🛠️ DIY Feasibility
      </h3>

      {/* Overall feasibility ring */}
      <div
        className="relative overflow-hidden rounded-2xl border border-[var(--glass-border)] p-5 mb-4"
        style={{ background: 'var(--bg-deep)' }}
      >
        <div
          className="absolute -top-12 -right-12 w-28 h-28 rounded-full opacity-[0.12] blur-[40px] pointer-events-none"
          style={{ background: getFeasColor(data.overallFeasibility) }}
          aria-hidden="true"
        />
        <div className="relative flex items-center gap-5">
          <div className="relative w-20 h-20 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--glass-border)" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke={getFeasColor(data.overallFeasibility)}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${data.overallFeasibility * 2.64} 264`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold" style={{ color: 'var(--text)' }}>{data.overallFeasibility}%</span>
              <span className="text-[9px]" style={{ color: 'var(--text-dim)' }}>feasible</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>
              {data.overallFeasibility >= 70 ? 'You can DIY most of these' : data.overallFeasibility >= 50 ? 'Some projects need skill building' : 'Several projects need a pro'}
            </p>
            <p className="text-[11px]" style={{ color: 'var(--text-sub)' }}>
              {data.skillGaps} skill gap{data.skillGaps !== 1 ? 's' : ''} identified across {data.projects.length} projects
            </p>
          </div>
        </div>
      </div>

      {/* Project cards */}
      <div className="space-y-1.5">
        {data.projects.map((project) => {
          const isExpanded = expanded === project.id;
          const ls = LABEL_STYLES[project.label];

          return (
            <div key={project.id}>
              <Card
                padding="sm"
                variant="interactive"
                className="cursor-pointer"
                onClick={() => setExpanded(isExpanded ? null : project.id)}
              >
                <div className="flex items-center gap-3">
                  {/* Mini feasibility ring */}
                  <div className="relative w-10 h-10 shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="var(--glass-border)" strokeWidth="10" />
                      <circle
                        cx="50" cy="50" r="42" fill="none"
                        stroke={getFeasColor(project.feasibilityScore)}
                        strokeWidth="10" strokeLinecap="round"
                        strokeDasharray={`${project.feasibilityScore * 2.64} 264`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[9px] font-bold" style={{ color: 'var(--text)' }}>{project.feasibilityScore}%</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-sm">{project.icon}</span>
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{project.title}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {/* Difficulty stars */}
                      <span className="text-[9px]" style={{ color: 'var(--gold)' }}>
                        {'★'.repeat(project.difficulty)}{'☆'.repeat(5 - project.difficulty)}
                      </span>
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded" style={{ background: ls.bg, color: ls.color }}>
                        {project.label}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] shrink-0 transition-transform" style={{ color: 'var(--text-dim)', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                    &#9656;
                  </span>
                </div>
              </Card>

              {/* Expanded: skill requirements + cost comparison */}
              {isExpanded && (
                <div
                  className="mx-2 mt-1 mb-2 rounded-xl p-4 space-y-3 animate-rise"
                  style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}
                >
                  {/* Skill requirement bars */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
                      Skill Requirements
                    </p>
                    {project.skills.map((skill) => {
                      const color = getSkillColor(skill.userLevel, skill.levelRequired);
                      const gap = skill.userLevel < skill.levelRequired;
                      return (
                        <div key={skill.skill}>
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[11px] font-medium" style={{ color: 'var(--text)' }}>
                              {skill.skill} — Level {skill.levelRequired} required
                            </span>
                            <span className="text-[10px] font-bold" style={{ color }}>
                              You: Level {skill.userLevel}
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--glass-border)' }}>
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{
                                width: `${Math.min((skill.userLevel / skill.levelRequired) * 100, 100)}%`,
                                background: color,
                              }}
                            />
                          </div>
                          {gap && (
                            <p className="text-[9px] mt-0.5" style={{ color: 'var(--danger)' }}>
                              Gap: {skill.levelRequired - skill.userLevel} level{skill.levelRequired - skill.userLevel > 1 ? 's' : ''} below requirement
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Cost comparison */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg p-2 text-center" style={{ background: 'var(--emerald-soft)' }}>
                      <p className="text-[9px] font-semibold" style={{ color: 'var(--emerald)' }}>DIY Cost</p>
                      <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                        ${project.diyCost.lo} – ${project.diyCost.hi}
                      </p>
                    </div>
                    <div className="rounded-lg p-2 text-center" style={{ background: 'var(--gold-soft)' }}>
                      <p className="text-[9px] font-semibold" style={{ color: 'var(--gold)' }}>Pro Cost</p>
                      <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                        ${project.proCost.lo.toLocaleString()} – ${project.proCost.hi.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Notes */}
                  <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                    {project.notes}
                  </p>

                  {/* Action button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); onAction?.(); }}
                    className="w-full text-[11px] font-semibold py-2 rounded-lg transition-colors"
                    style={
                      project.feasibilityScore < 50
                        ? { background: 'var(--accent-soft)', color: 'var(--accent)' }
                        : { background: 'var(--emerald-soft)', color: 'var(--emerald)' }
                    }
                  >
                    {project.feasibilityScore < 50 ? '🔍 Find a Pro' : '🛠️ Start DIY'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
