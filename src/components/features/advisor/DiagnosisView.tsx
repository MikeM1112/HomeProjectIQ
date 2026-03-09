'use client';

import { useState, useEffect } from 'react';
import type { DiagnosisResult } from '@/types/app';
import { ConfidenceGauge } from './ConfidenceGauge';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useUIStore } from '@/stores/uiStore';
import { formatCurrency } from '@/lib/utils';
import { AffiliateBuyButton } from '@/components/monetization/AffiliateBuyButton';
import { cn } from '@/lib/utils';

const TABS = ['Summary', 'Steps', 'Tools', 'Shop', 'Hire Pro'] as const;
const TAB_HASHES = ['#summary', '#steps', '#tools', '#shop', '#hire-pro'] as const;

interface DiagnosisViewProps {
  result: DiagnosisResult;
}

export function DiagnosisView({ result }: DiagnosisViewProps) {
  const [activeTab, setActiveTab] = useState(0);
  const { showToast } = useUIStore();

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
        <div className="sticky top-14 z-30 bg-[var(--yellow-lt)] border border-[var(--yellow)]/20 rounded-2xl p-3 space-y-1">
          {result.flags.map((flag, i) => (
            <p key={i} className="text-sm text-warning font-medium">{flag}</p>
          ))}
        </div>
      )}

      <div className="flex gap-1 overflow-x-auto border-b border-[var(--border)] -mx-4 px-4">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => handleTabChange(i)}
            className={cn(
              'px-3 py-2 text-sm whitespace-nowrap border-b-2 transition-colors tap',
              activeTab === i
                ? 'border-[var(--accent)] text-[var(--accent)] font-semibold'
                : 'border-transparent text-[var(--ink-sub)] hover:text-[var(--ink)]'
            )}
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
            <Card>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-ink-sub font-medium">Option</th>
                    <th className="text-right py-2 text-ink-sub font-medium">Cost Range</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-2 text-success font-medium">DIY</td>
                    <td className="py-2 text-right font-mono text-sm">
                      {formatCurrency(result.diy.lo)} – {formatCurrency(result.diy.hi)}
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 text-info font-medium">Hire Pro</td>
                    <td className="py-2 text-right font-mono text-sm">
                      {formatCurrency(result.pro.lo)} – {formatCurrency(result.pro.hi)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-brand font-semibold">Potential Savings</td>
                    <td className="py-2 text-right font-mono text-sm font-semibold text-brand">
                      {formatCurrency(result.save)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Card>
            <div className="flex gap-4 text-sm text-ink-sub">
              <div><strong>DIY Time:</strong> {result.diy.time}</div>
              <div><strong>Pro Time:</strong> {result.pro.time}</div>
            </div>
          </div>
        )}

        {activeTab === 1 && (
          <div className="space-y-3">
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
            {result.tools.map((tool, i) => (
              <Card key={i} padding="sm">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{tool.e}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{tool.n}</span>
                      <Badge variant={tool.r === 'Essential' ? 'error' : tool.r === 'Safety' ? 'warning' : 'default'}>
                        {tool.r}
                      </Badge>
                    </div>
                    {tool.tip && <p className="text-xs text-ink-sub mt-0.5">{tool.tip}</p>}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 3 && (
          <div className="space-y-3">
            {result.shop.map((item, i) => (
              <Card key={i} padding="sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">{item.n}</p>
                    <p className="text-xs text-ink-dim">{item.sz}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge>{item.store}</Badge>
                      <span className="text-[10px] text-ink-dim font-mono">SKU: {item.sku}</span>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-mono text-sm font-semibold">{formatCurrency(item.pr)}</p>
                    <p className="text-[10px] text-success">{item.stock}</p>
                    {item.sku && item.store && (
                      <AffiliateBuyButton
                        href={`https://www.google.com/search?q=${encodeURIComponent(`${item.n} ${item.store}`)}`}
                        label={`Buy at ${item.store}`}
                        store={item.store}
                        sku={item.sku}
                      />
                    )}
                  </div>
                </div>
              </Card>
            ))}
            {result.matEst > 0 && (
              <Card className="bg-brand-light">
                <p className="text-sm font-semibold text-brand">
                  Estimated Materials: {formatCurrency(result.matEst)}
                </p>
              </Card>
            )}
          </div>
        )}

        {activeTab === 4 && (
          <div className="space-y-4">
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
          </div>
        )}
      </div>
    </div>
  );
}
