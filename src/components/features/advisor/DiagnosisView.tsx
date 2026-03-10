'use client';

import { useState, useEffect } from 'react';
import type { DiagnosisResult } from '@/types/app';
import { ConfidenceGauge } from './ConfidenceGauge';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useUIStore } from '@/stores/uiStore';
import { formatCurrency } from '@/lib/utils';
import { AffiliateBuyButton } from '@/components/monetization/AffiliateBuyButton';
import { ShoppingList } from '@/components/shopping/ShoppingList';
import { StoreComparison } from '@/components/shopping/StoreComparison';
import { AisleGuide } from '@/components/shopping/AisleGuide';
import { useGuidedStore } from '@/stores/guidedStore';
import { Mascot } from '@/components/brand/Mascot';
import { QuoteRequestFlow } from '@/components/features/quotes/QuoteRequestFlow';
import { QuoteTracker } from '@/components/features/quotes/QuoteTracker';
import { useQuotes } from '@/hooks/useQuotes';
import { useToolbox } from '@/hooks/useToolbox';
import { classifyDiagnosisTools } from '@/lib/tool-matching';
import { cn } from '@/lib/utils';

const TABS = ['Summary', 'Steps', 'Tools', 'Shop', 'Hire Pro'] as const;
const TAB_HASHES = ['#summary', '#steps', '#tools', '#shop', '#hire-pro'] as const;

interface DiagnosisViewProps {
  result: DiagnosisResult;
  projectId?: string;
  categoryId?: string;
}

export function DiagnosisView({ result, projectId, categoryId }: DiagnosisViewProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [showQuoteFlow, setShowQuoteFlow] = useState(false);
  const { showToast } = useUIStore();
  const { quotes, cancelQuote, isCancelling } = useQuotes();
  const { tools: ownedTools, addTool, isAdding } = useToolbox();
  const ownedIds = ownedTools.map((t) => t.tool_id);
  const classifiedTools = classifyDiagnosisTools(result.tools, ownedIds);
  const ownedCount = classifiedTools.filter((t) => t.owned).length;
  const totalTools = classifiedTools.length;
  const existingQuote = projectId
    ? quotes.find((q) => q.project_id === projectId && q.status !== 'cancelled')
    : null;

  useEffect(() => {
    const hash = window.location.hash;
    const idx = TAB_HASHES.indexOf(hash as typeof TAB_HASHES[number]);
    if (idx >= 0) setActiveTab(idx);
  }, []);

  const handleTabChange = (i: number) => {
    setActiveTab(i);
    window.location.hash = TAB_HASHES[i];
  };

  const copyScript = async () => {
    try {
      await navigator.clipboard.writeText(result.pro.script);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = result.pro.script;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    showToast('Script copied to clipboard!', 'success');
  };

  return (
    <div className="space-y-4">
      {result.flags.length > 0 && (
        <div className="sticky top-14 z-30 bg-[var(--yellow-lt)] border border-[var(--yellow)]/20 rounded-[20px] shadow-[var(--card-shadow)] p-3 space-y-1">
          {result.flags.map((flag, i) => (
            <p key={i} className="text-sm text-warning font-medium">{flag}</p>
          ))}
        </div>
      )}

      <div
        className="flex gap-[2px] overflow-x-auto -mx-4 px-4"
        style={{ background: 'var(--tab-bg)', borderRadius: '9999px', padding: '4px' }}
      >
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => handleTabChange(i)}
            className={cn(
              'whitespace-nowrap cursor-pointer transition-all duration-150 tap',
              activeTab === i
                ? 'text-white font-semibold'
                : 'text-[var(--text-dim)]'
            )}
            style={{
              padding: '8px 14px',
              fontSize: '12px',
              borderRadius: '9999px',
              ...(activeTab === i
                ? { background: 'var(--accent-gradient)', boxShadow: '0 2px 12px var(--accent-glow)' }
                : {}),
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="animate-fade">
        {activeTab === 0 && (
          <div className="space-y-6">
            <ConfidenceGauge value={result.conf} />
            <p className="text-sm text-ink-sub text-center">{result.why}</p>
            <div className="space-y-2">
              <div
                className="flex items-center justify-between rounded-[20px] p-3 border backdrop-blur-[16px] shadow-[var(--card-shadow)]"
                style={{ background: 'var(--glass)', borderColor: 'var(--glass-border)' }}
              >
                <span className="text-sm font-medium text-[var(--emerald)]">DIY</span>
                <span className="font-mono text-sm text-[var(--text)]">
                  {formatCurrency(result.diy.lo)} – {formatCurrency(result.diy.hi)}
                </span>
              </div>
              <div
                className="flex items-center justify-between rounded-[20px] p-3 border backdrop-blur-[16px] shadow-[var(--card-shadow)]"
                style={{ background: 'var(--glass)', borderColor: 'var(--glass-border)' }}
              >
                <span className="text-sm font-medium text-[var(--info)]">Hire Pro</span>
                <span className="font-mono text-sm text-[var(--text)]">
                  {formatCurrency(result.pro.lo)} – {formatCurrency(result.pro.hi)}
                </span>
              </div>
              <div
                className="flex items-center justify-between rounded-[20px] p-3 border backdrop-blur-[16px] shadow-[var(--card-shadow)]"
                style={{ background: 'var(--glass)', borderColor: 'var(--accent-glow)' }}
              >
                <span className="text-sm font-semibold text-[var(--accent)]">Potential Savings</span>
                <span className="font-mono text-sm font-semibold text-[var(--accent)]">
                  {formatCurrency(result.save)}
                </span>
              </div>
            </div>
            <div className="flex gap-4 text-sm text-ink-sub">
              <div><strong>DIY Time:</strong> {result.diy.time}</div>
              <div><strong>Pro Time:</strong> {result.pro.time}</div>
            </div>
          </div>
        )}

        {activeTab === 1 && (
          <div className="space-y-3">
            {/* Start Guided Mode CTA */}
            <Card className="glass glass-sm border border-brand/20">
              <div className="flex items-center gap-3">
                <Mascot size="sm" mode="tool" animate={false} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink">Project GPS</p>
                  <p className="text-xs text-ink-sub">Step-by-step guided mode with photo check-ins</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => useGuidedStore.getState().startGuidedMode(
                    'current', result.title, result.steps
                  )}
                >
                  Start
                </Button>
              </div>
            </Card>

            {result.steps.map((step, i) => (
              <Card key={i} padding="sm">
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-brand-light text-brand text-sm font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink">{step.s}</p>
                    <p className="text-xs text-ink-dim mt-0.5">{step.t}</p>
                    {step.tip && (
                      <p className="text-xs text-brand mt-1">Tip: {step.tip}</p>
                    )}
                    {step.photo && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-brand mt-1">
                        {'\u{1F4F7}'} Photo check-in
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
            {result.tl.length > 0 && (
              <Card className="mt-4">
                <h3 className="font-serif text-base font-semibold mb-2">Timeline</h3>
                {result.tl.map((phase, i) => (
                  <div key={i} className="flex justify-between text-sm py-1 border-b border-border/50 last:border-0">
                    <span className="text-ink">{phase.phase}</span>
                    <span className="text-ink-sub">{phase.time}</span>
                  </div>
                ))}
              </Card>
            )}
          </div>
        )}

        {activeTab === 2 && (
          <div className="space-y-3">
            {totalTools > 0 && (
              <p className="text-xs font-medium text-[var(--ink-sub)]">
                {ownedCount > 0 ? `✓ ${ownedCount} you own` : ''}{ownedCount > 0 && totalTools - ownedCount > 0 ? ' · ' : ''}{totalTools - ownedCount > 0 ? `${totalTools - ownedCount} to buy/borrow` : ''}
              </p>
            )}
            {classifiedTools.map((tool, i) => (
              <Card key={i} padding="sm">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{tool.e}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium">{tool.n}</span>
                      <Badge variant={tool.r === 'Essential' ? 'error' : tool.r === 'Safety' ? 'warning' : 'default'}>
                        {tool.r}
                      </Badge>
                      {tool.owned && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--success)]/10 text-[var(--success)]">
                          ✓ You own this
                        </span>
                      )}
                    </div>
                    {tool.tip && <p className="text-xs text-ink-sub mt-0.5">{tool.tip}</p>}
                  </div>
                  {!tool.owned && tool.definition && (
                    <button
                      onClick={() => {
                        addTool({
                          tool_id: tool.definition!.id,
                          tool_name: tool.definition!.name,
                          category: tool.definition!.category,
                        }).then(() => showToast('+5 XP! Tool added.', 'success'))
                          .catch(() => {});
                      }}
                      disabled={isAdding}
                      className="shrink-0 text-[10px] font-semibold px-2 py-1 rounded-full border border-[var(--accent)]/30 text-[var(--accent)] hover:bg-[var(--accent)]/5 transition-colors"
                    >
                      + Add
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 3 && (
          <div className="space-y-6">
            <ShoppingList diagnosis={result} />
            <StoreComparison diagnosis={result} />
            <AisleGuide diagnosis={result} />
          </div>
        )}

        {activeTab === 4 && (
          <div className="space-y-4">
            {/* Get Pro Quotes CTA */}
            {!existingQuote && (
              <Card
                className="border-brand/20"
                style={{ background: 'linear-gradient(135deg, var(--accent-soft), var(--glass))' }}
              >
                <div className="flex items-center gap-3">
                  <Mascot size="sm" mode="celebrate" animate={false} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-ink">Get Pro Quotes</p>
                    <p className="text-xs text-ink-sub">One tap to get bids from verified local contractors</p>
                  </div>
                  <Button size="sm" onClick={() => setShowQuoteFlow(true)}>
                    Get Quotes
                  </Button>
                </div>
              </Card>
            )}

            {/* Quote tracker if quote exists */}
            {existingQuote && (
              <QuoteTracker
                quote={existingQuote}
                onCancel={() => cancelQuote(existingQuote.id)}
                isCancelling={isCancelling}
              />
            )}

            <Card>
              <h3 className="font-serif text-base font-semibold mb-2">Call Script</h3>
              <p className="text-sm text-ink-sub whitespace-pre-line">{result.pro.script}</p>
              <Button variant="secondary" size="sm" className="mt-3" onClick={copyScript}>
                Copy Script
              </Button>
            </Card>
            <Card>
              <h3 className="text-sm font-semibold mb-1">Expected Cost</h3>
              <p className="font-mono text-lg">
                {formatCurrency(result.pro.lo)} – {formatCurrency(result.pro.hi)}
              </p>
              <p className="text-xs text-ink-sub mt-1">{result.pro.time}</p>
            </Card>
            {result.pro.note && (
              <p className="text-sm text-ink-sub">{result.pro.note}</p>
            )}

            {/* Quote Request Modal */}
            <Modal
              isOpen={showQuoteFlow}
              onClose={() => setShowQuoteFlow(false)}
              title="Get Pro Quotes"
            >
              <QuoteRequestFlow
                diagnosis={result}
                projectId={projectId}
                categoryId={categoryId ?? 'general'}
                onClose={() => setShowQuoteFlow(false)}
              />
            </Modal>
          </div>
        )}
      </div>
    </div>
  );
}
