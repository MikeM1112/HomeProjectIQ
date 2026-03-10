'use client';

import { useState, useEffect, useRef } from 'react';

// ══════════════════════════════════════════════════════════════
// DATA: Complete Monetization Architecture for HomeProjectIQ
// ══════════════════════════════════════════════════════════════

const REVENUE_STREAMS = [
  // ── Direct Consumer ──
  {
    id: 'sub',
    name: 'Pro Subscription',
    type: 'Subscription',
    category: 'Direct Consumer',
    description: 'Unlimited AI assessments, wall/yard analysis, multi-property, advanced home health, export reports, priority contractor matching.',
    pricing: '$7.99/mo or $59.99/yr',
    y1: 90000,
    y2: 480000,
    y3: 1500000,
    margin: 90,
    confidence: 'High',
    dependencies: 'Paywall implementation, Stripe integration',
    timeToRevenue: 2,
    scalability: 'Linear',
    assumptions: '5% free-to-paid conversion at 50K/200K/500K users. Annual plans at 70% mix. $5 ARPU blended.',
  },
  {
    id: 'credits',
    name: 'AI Assessment Credits',
    type: 'IAP',
    category: 'Direct Consumer',
    description: 'Consumable credit packs for extra AI photo assessments beyond free tier limit (3/month free).',
    pricing: '$1.99/5 credits, $4.99/15 credits',
    y1: 18000,
    y2: 96000,
    y3: 300000,
    margin: 85,
    confidence: 'High',
    dependencies: 'Credit system, free tier gating',
    timeToRevenue: 2,
    scalability: 'Linear',
    assumptions: '8% of free users buy credits, avg $6/yr. Scales with user base.',
  },
  {
    id: 'plans',
    name: 'Premium Project Plans',
    type: 'IAP',
    category: 'Direct Consumer',
    description: 'Enhanced project guides with contractor negotiation scripts, coupon codes, video walkthroughs.',
    pricing: '$2.99 per plan',
    y1: 12000,
    y2: 72000,
    y3: 240000,
    margin: 92,
    confidence: 'Medium',
    dependencies: 'Premium content creation pipeline',
    timeToRevenue: 3,
    scalability: 'Linear',
    assumptions: '6% of users purchase, avg 1.5 plans/yr at $2.99.',
  },

  // ── Partnership Revenue ──
  {
    id: 'affiliate',
    name: 'Affiliate Links (HD / Lowes / Amazon)',
    type: 'Affiliate',
    category: 'Partnership',
    description: 'Commission on material purchases through app shopping lists. Already has SKU-level product data with store names for Home Depot, Lowe\'s. Feature flag exists.',
    pricing: '4-8% Home Depot, 2-8% Lowe\'s, 1-4% Amazon',
    y1: 75000,
    y2: 400000,
    y3: 1250000,
    margin: 95,
    confidence: 'High',
    dependencies: 'Affiliate program enrollment, link integration (AffiliateBuyButton component exists)',
    timeToRevenue: 1,
    scalability: 'Exponential',
    assumptions: 'Avg $50 material spend per project, 2.5 projects/yr/active user, 5% avg commission. 30% click-through, 15% purchase conversion.',
  },
  {
    id: 'featured-pros',
    name: 'Featured Pro Placement',
    type: 'Sponsorship',
    category: 'Partnership',
    description: 'Contractors pay for premium placement in bid results and recommendations. FeaturedProCard component already built and flag-gated.',
    pricing: '$75-250/mo per contractor per metro area',
    y1: 72000,
    y2: 360000,
    y3: 1200000,
    margin: 88,
    confidence: 'High',
    dependencies: 'Contractor onboarding portal, self-serve ad platform',
    timeToRevenue: 4,
    scalability: 'Linear',
    assumptions: 'Y1: 80 contractors × $75/mo. Y2: 300 × $100/mo. Y3: 800 × $125/mo. Major metro areas first.',
  },
  {
    id: 'category-sponsors',
    name: 'Category Sponsorships',
    type: 'Sponsorship',
    category: 'Partnership',
    description: '"HVAC tips powered by Carrier" — brand sponsors an entire repair category. SponsoredCategory component already built.',
    pricing: '$10K-60K/yr per category',
    y1: 60000,
    y2: 180000,
    y3: 480000,
    margin: 90,
    confidence: 'Medium',
    dependencies: '50K+ MAU for sponsor interest, media kit, rate card',
    timeToRevenue: 6,
    scalability: 'Plateau (12 categories)',
    assumptions: 'Y1: 4 categories × $15K. Y2: 8 × $22.5K. Y3: 12 × $40K. Increases with user base.',
  },
  {
    id: 'lead-gen',
    name: 'Contractor Lead Generation',
    type: 'Lead Gen',
    category: 'Partnership',
    description: 'Users who receive "Hire a Pro" verdict become pre-qualified leads. App knows project type, budget range, skill gap, and urgency. Highest-value stream.',
    pricing: '$25-75 per qualified lead',
    y1: 150000,
    y2: 800000,
    y3: 2500000,
    margin: 85,
    confidence: 'High',
    dependencies: 'Lead routing system, contractor network, quality scoring',
    timeToRevenue: 4,
    scalability: 'Exponential',
    assumptions: '20% of users need pros, 1.5 projects/yr avg, $40 avg CPL. Pre-qualified leads command premium CPL.',
  },

  // ── Platform Revenue ──
  {
    id: 'marketplace',
    name: 'Pro Marketplace (Transaction Fees)',
    type: 'Platform',
    category: 'Platform',
    description: 'Full booking/payment platform for contractor services. User hires pro directly through app. 10-15% take rate on completed jobs.',
    pricing: '12% platform fee on completed jobs',
    y1: 0,
    y2: 270000,
    y3: 1350000,
    margin: 75,
    confidence: 'Medium',
    dependencies: 'Payment processing, escrow, contractor verification, dispute resolution',
    timeToRevenue: 10,
    scalability: 'Exponential',
    assumptions: 'Y2: $2.25M GMV × 12%. Y3: $11.25M GMV × 12%. 15K users hiring pros, avg $500 job.',
  },
  {
    id: 'certified-pro',
    name: 'Certified Pro Program',
    type: 'Platform',
    category: 'Platform',
    description: '"HomeProjectIQ Certified" badge for contractors who pass quality standards. Annual certification fee + enhanced listing.',
    pricing: '$500/yr per certified contractor',
    y1: 0,
    y2: 100000,
    y3: 500000,
    margin: 85,
    confidence: 'Medium',
    dependencies: 'Certification criteria, verification process, badge system',
    timeToRevenue: 8,
    scalability: 'Linear',
    assumptions: 'Y2: 200 contractors. Y3: 1,000 contractors. Grows with marketplace.',
  },

  // ── Data Revenue ──
  {
    id: 'home-intel',
    name: 'Home Health Intelligence Reports',
    type: 'Data',
    category: 'Data',
    description: 'Aggregated, anonymized market data: avg system ages by region, common failure patterns, maintenance compliance rates, cost benchmarks.',
    pricing: '$25K-100K/yr per enterprise subscriber',
    y1: 0,
    y2: 150000,
    y3: 500000,
    margin: 80,
    confidence: 'Medium',
    dependencies: '100K+ users for statistical significance, data pipeline, anonymization',
    timeToRevenue: 12,
    scalability: 'Exponential',
    assumptions: 'Y2: 3 enterprise clients × $50K. Y3: 8 × $62.5K. Target: insurers, warranty companies, RE firms.',
  },
  {
    id: 'real-estate',
    name: 'Real Estate Integration',
    type: 'Data',
    category: 'Data',
    description: 'Home health scores for property listings. Pre-sale assessment reports. API for MLS/Zillow/Redfin integration.',
    pricing: '$15-25 per report, or API subscription',
    y1: 0,
    y2: 75000,
    y3: 375000,
    margin: 82,
    confidence: 'Speculative',
    dependencies: 'Critical mass of home data, API platform, RE partnerships',
    timeToRevenue: 14,
    scalability: 'Exponential',
    assumptions: 'Y2: 5K reports × $15. Y3: 25K reports × $15. Massive TAM if RE partnerships close.',
  },

  // ── Brand Revenue ──
  {
    id: 'newsletter',
    name: 'Branded Newsletter / Content',
    type: 'Brand',
    category: 'Brand',
    description: 'Weekly "Home Intelligence" newsletter with seasonal tips, product recommendations, and sponsor placements. Repurpose Smart Insights content.',
    pricing: '$25-50 CPM, 2-3 sponsors/issue',
    y1: 24000,
    y2: 96000,
    y3: 240000,
    margin: 88,
    confidence: 'Medium',
    dependencies: 'Email capture, content pipeline, sponsor outreach',
    timeToRevenue: 3,
    scalability: 'Linear',
    assumptions: 'Y1: 10K subs, $2K/mo. Y2: 40K subs, $8K/mo. Y3: 100K subs, $20K/mo. $40-50 CPM home category.',
  },
  {
    id: 'tool-brand',
    name: 'Tool Brand Partnerships',
    type: 'Sponsorship',
    category: 'Brand',
    description: 'Tool recommendations in diagnosis results and toolbox. "Recommended by HomeProjectIQ" badge for tool brands. Performance marketing.',
    pricing: '$5K-25K/yr per brand + affiliate commission',
    y1: 30000,
    y2: 120000,
    y3: 300000,
    margin: 90,
    confidence: 'Medium',
    dependencies: 'Brand partnership team, content integration guidelines',
    timeToRevenue: 5,
    scalability: 'Linear',
    assumptions: 'Y1: 3 brands × $10K. Y2: 8 × $15K. Y3: 15 × $20K. DeWalt, Milwaukee, Ryobi, etc.',
  },
  {
    id: 'home-warranty',
    name: 'Home Warranty Referrals',
    type: 'Affiliate',
    category: 'Partnership',
    description: 'Target users with aging systems (water heater 8+ yrs, HVAC 10+ yrs, roof 15+ yrs) with home warranty recommendations.',
    pricing: '$40-120 per warranty sold (CPA)',
    y1: 36000,
    y2: 144000,
    y3: 360000,
    margin: 95,
    confidence: 'High',
    dependencies: 'Home health age data, warranty partner integration',
    timeToRevenue: 3,
    scalability: 'Linear',
    assumptions: 'Y1: 450 referrals × $80 CPA. Y2: 1,800 × $80. Y3: 4,500 × $80. 3% of tracked users convert.',
  },
  {
    id: 'insurance',
    name: 'Insurance Data Partnerships',
    type: 'Data',
    category: 'Data',
    description: 'Home health scores as supplementary data for insurance underwriting. Well-maintained homes = lower premiums. Revenue share on premium reduction.',
    pricing: '$5-15 per verified home health report',
    y1: 0,
    y2: 50000,
    y3: 250000,
    margin: 80,
    confidence: 'Speculative',
    dependencies: 'Actuarial validation, insurer partnerships, user consent',
    timeToRevenue: 18,
    scalability: 'Exponential',
    assumptions: 'Y2: 5K reports × $10. Y3: 25K × $10. Hippo, Lemonade, Kin as targets.',
  },
];

const NAMED_PARTNERS: { name: string; type: string; dealValue: string; whyTheyCare: string; confidence: string; logo: string }[] = [
  { name: 'Home Depot', type: 'Affiliate', dealValue: '$50K-500K/yr', whyTheyCare: 'Direct purchase intent — users have SKU-level shopping lists. 4-8% commission on $157B revenue.', confidence: 'High', logo: '🏠' },
  { name: "Lowe's", type: 'Affiliate', dealValue: '$30K-300K/yr', whyTheyCare: 'Compete with HD for DIY wallet share. 2-8% commission. $87B revenue.', confidence: 'High', logo: '🔵' },
  { name: 'Amazon', type: 'Affiliate', dealValue: '$20K-200K/yr', whyTheyCare: 'Tool and material purchases. 1-4% commission. Convenience factor for specialty items.', confidence: 'High', logo: '📦' },
  { name: 'Angi (Angie\'s List)', type: 'Lead Gen', dealValue: '$200K-1.5M/yr', whyTheyCare: 'Pre-qualified leads with project scope, budget, and skill gap data. Pays $20-75/lead. $1.8B revenue.', confidence: 'High', logo: '🔧' },
  { name: 'Thumbtack', type: 'Lead Gen', dealValue: '$150K-800K/yr', whyTheyCare: 'Qualified homeowner leads with specific project details. $2B+ valuation, aggressive lead acquisition.', confidence: 'High', logo: '📌' },
  { name: 'Porch.com', type: 'Lead Gen', dealValue: '$50K-250K/yr', whyTheyCare: 'Home services lead marketplace. Pays $5-25/lead. Focus on move-related projects.', confidence: 'Medium', logo: '🏡' },
  { name: 'Carrier / Trane / Lennox', type: 'Category Sponsor', dealValue: '$15K-60K/yr each', whyTheyCare: 'HVAC category sponsorship. Users tracking HVAC health = purchase intent signal. $20B+ combined market.', confidence: 'Medium', logo: '❄️' },
  { name: 'Moen / Kohler / Delta', type: 'Category Sponsor', dealValue: '$10K-40K/yr each', whyTheyCare: 'Plumbing category sponsorship. App recommends their products by name in diagnosis results.', confidence: 'Medium', logo: '🚿' },
  { name: 'Sherwin-Williams', type: 'Category Sponsor', dealValue: '$15K-50K/yr', whyTheyCare: 'Painting category. Color recommendations + store locator. $22B revenue. Huge marketing budget.', confidence: 'Medium', logo: '🎨' },
  { name: 'DeWalt / Milwaukee / Makita', type: 'Tool Brand', dealValue: '$10K-30K/yr each', whyTheyCare: 'Tool recommendations in every diagnosis. "Recommended tool" placement. Performance marketing.', confidence: 'Medium', logo: '🔨' },
  { name: 'American Home Shield', type: 'Warranty Referral', dealValue: '$40K-200K/yr', whyTheyCare: 'Users with aging systems (HVAC 10+, water heater 8+) are prime warranty buyers. $80-120 CPA.', confidence: 'High', logo: '🛡️' },
  { name: 'Hippo Insurance', type: 'Insurance Data', dealValue: '$50K-250K/yr', whyTheyCare: 'Home health data for underwriting. Well-maintained homes = lower risk. Smart home insurer.', confidence: 'Speculative', logo: '🦛' },
  { name: 'Zillow / Redfin', type: 'RE Integration', dealValue: '$100K-500K/yr', whyTheyCare: 'Home health scores for listings. Pre-sale assessment reports. API integration for property data.', confidence: 'Speculative', logo: '🏘️' },
  { name: 'Ryobi (TTI)', type: 'Tool Brand', dealValue: '$15K-40K/yr', whyTheyCare: 'HD-exclusive brand. App recommends specific Ryobi tools. Cross-promo with HD affiliate program.', confidence: 'Medium', logo: '💚' },
];

const FEATURE_ROADMAP: { name: string; revenue: string; effort: string; roiPerMonth: number; phase: string; unlocks: string }[] = [
  { name: 'Affiliate Link Integration', revenue: '$75K-1.25M/yr', effort: 'Small (1 mo)', roiPerMonth: 75000, phase: 'A', unlocks: 'Home Depot, Lowe\'s, Amazon commissions' },
  { name: 'Freemium Paywall + Stripe', revenue: '$90K-1.5M/yr', effort: 'Medium (2 mo)', roiPerMonth: 45000, phase: 'A', unlocks: 'Pro subscriptions, AI credit packs' },
  { name: 'Contractor Lead Routing', revenue: '$150K-2.5M/yr', effort: 'Medium (2 mo)', roiPerMonth: 75000, phase: 'A', unlocks: 'Angi, Thumbtack, Porch lead gen revenue' },
  { name: 'Featured Pro Self-Serve Portal', revenue: '$72K-1.2M/yr', effort: 'Medium (2 mo)', roiPerMonth: 36000, phase: 'B', unlocks: 'Contractor advertising revenue' },
  { name: 'Email Newsletter System', revenue: '$24K-240K/yr', effort: 'Small (1 mo)', roiPerMonth: 24000, phase: 'B', unlocks: 'Sponsor revenue, user retention' },
  { name: 'Home Warranty Integration', revenue: '$36K-360K/yr', effort: 'Small (1 mo)', roiPerMonth: 36000, phase: 'B', unlocks: 'AHS, Choice, Select referral CPA' },
  { name: 'Full Marketplace + Payments', revenue: '$0-1.35M/yr', effort: 'Large (4 mo)', roiPerMonth: 0, phase: 'C', unlocks: 'Transaction fees, escrow, booking' },
  { name: 'Certified Pro Program', revenue: '$0-500K/yr', effort: 'Medium (2 mo)', roiPerMonth: 0, phase: 'C', unlocks: 'Annual certification fees, quality signal' },
  { name: 'Data Pipeline + Intelligence API', revenue: '$0-500K/yr', effort: 'Large (3 mo)', roiPerMonth: 0, phase: 'D', unlocks: 'Insurance, RE, warranty data sales' },
  { name: 'Real Estate MLS Integration', revenue: '$0-375K/yr', effort: 'Large (4 mo)', roiPerMonth: 0, phase: 'D', unlocks: 'Zillow, Redfin, MLS home health scores' },
];

const VALUATION_TRAJECTORY = [
  { stage: 'Pre-Launch', users: '0', revenue: '$0', revenueMultiple: '$0', userMultiple: '$0', combined: '$500K-1M', note: 'Team + tech + market size' },
  { stage: '10K Users', users: '10K', revenue: '$50K ARR', revenueMultiple: '$500K-750K', userMultiple: '$200K-500K', combined: '$750K-1.5M', note: 'Seed stage' },
  { stage: '50K Users', users: '50K', revenue: '$570K ARR', revenueMultiple: '$5.7M-8.5M', userMultiple: '$1M-2.5M', combined: '$5M-10M', note: 'Series A' },
  { stage: '100K Users', users: '100K', revenue: '$1.5M ARR', revenueMultiple: '$15M-22.5M', userMultiple: '$2M-5M', combined: '$15M-25M', note: 'Growth stage' },
  { stage: '500K Users', users: '500K', revenue: '$8M ARR', revenueMultiple: '$80M-160M', userMultiple: '$10M-25M', combined: '$80M-160M', note: 'Series B/C' },
  { stage: '1M Users', users: '1M', revenue: '$18M ARR', revenueMultiple: '$180M-360M', userMultiple: '$20M-50M', combined: '$200M-400M', note: 'Pre-exit' },
];

// ── Aggregates ──
const Y1_TOTAL = REVENUE_STREAMS.reduce((s, r) => s + r.y1, 0);
const Y2_TOTAL = REVENUE_STREAMS.reduce((s, r) => s + r.y2, 0);
const Y3_TOTAL = REVENUE_STREAMS.reduce((s, r) => s + r.y3, 0);
const CATEGORIES = ['Direct Consumer', 'Partnership', 'Platform', 'Data', 'Brand'];

function fmt(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

function fmtFull(n: number): string {
  return '$' + n.toLocaleString('en-US');
}

// ══════════════════════════════════════════════════════════════
// COMPONENTS
// ══════════════════════════════════════════════════════════════

function AnimatedNumber({ value, prefix = '$' }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame: number;
    const duration = 1500;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <span ref={ref}>{prefix}{display.toLocaleString('en-US')}</span>;
}

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--glass-border)' }}>
      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function Ring({ value, max, size = 80, color, label }: { value: number; max: number; size?: number; color: string; label: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r="42" fill="none" stroke="var(--glass-border)" strokeWidth="8" />
        <circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={`${pct * 2.64} 264`} className="transition-all duration-1000" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs font-bold" style={{ color: 'var(--text)' }}>{pct}%</span>
        <span className="text-[7px]" style={{ color: 'var(--text-dim)' }}>{label}</span>
      </div>
    </div>
  );
}

function RevenueChart({ streams, yearFilter }: { streams: typeof REVENUE_STREAMS; yearFilter: 1 | 2 | 3 }) {
  const key = yearFilter === 1 ? 'y1' : yearFilter === 2 ? 'y2' : 'y3';
  const grouped = CATEGORIES.map((cat) => ({
    cat,
    total: streams.filter((s) => s.category === cat).reduce((sum, s) => sum + s[key], 0),
  }));
  const max = Math.max(...grouped.map((g) => g.total), 1);
  const colors: Record<string, string> = {
    'Direct Consumer': 'var(--accent)',
    Partnership: 'var(--emerald)',
    Platform: 'var(--info)',
    Data: 'var(--gold)',
    Brand: '#C084FC',
  };

  return (
    <div className="space-y-3">
      {grouped.map((g) => (
        <div key={g.cat}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium" style={{ color: 'var(--text)' }}>{g.cat}</span>
            <span className="text-xs font-bold" style={{ color: colors[g.cat] }}>{fmt(g.total)}</span>
          </div>
          <MiniBar value={g.total} max={max} color={colors[g.cat] ?? 'var(--accent)'} />
        </div>
      ))}
    </div>
  );
}

function SensitivitySlider({ label, base, onChange }: { label: string; base: number; onChange: (mult: number) => void }) {
  const [val, setVal] = useState(100);
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs" style={{ color: 'var(--text-sub)' }}>{label}</span>
        <span className="text-xs font-bold" style={{ color: val > 100 ? 'var(--emerald)' : val < 100 ? 'var(--danger)' : 'var(--text-dim)' }}>
          {val}% ({fmt(Math.round(base * val / 100))})
        </span>
      </div>
      <input
        type="range" min={25} max={200} value={val}
        onChange={(e) => { const v = Number(e.target.value); setVal(v); onChange(v / 100); }}
        className="w-full h-1 rounded-full appearance-none cursor-pointer"
        style={{ background: `linear-gradient(to right, var(--danger), var(--gold) 50%, var(--emerald))` }}
      />
      <div className="flex justify-between mt-0.5">
        <span className="text-[8px]" style={{ color: 'var(--text-dim)' }}>Bear (0.25x)</span>
        <span className="text-[8px]" style={{ color: 'var(--text-dim)' }}>Bull (2x)</span>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════

export default function MonetizationPage() {
  const [activeSection, setActiveSection] = useState('executive');
  const [yearFilter, setYearFilter] = useState<1 | 2 | 3>(3);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [confidenceFilter, setConfidenceFilter] = useState<string>('All');
  const [expandedStream, setExpandedStream] = useState<string | null>(null);
  const [expandedPartner, setExpandedPartner] = useState<string | null>(null);
  const [sensMultipliers, setSensMultipliers] = useState<Record<string, number>>({});

  const filteredStreams = REVENUE_STREAMS.filter((s) => {
    if (categoryFilter !== 'All' && s.category !== categoryFilter) return false;
    if (confidenceFilter !== 'All' && s.confidence !== confidenceFilter) return false;
    return true;
  });

  const sensTotal = REVENUE_STREAMS.slice(0, 5).reduce((sum, s) => {
    const mult = sensMultipliers[s.id] ?? 1;
    return sum + Math.round(s.y3 * mult);
  }, 0) + REVENUE_STREAMS.slice(5).reduce((sum, s) => sum + s.y3, 0);

  const sections = [
    { id: 'executive', label: 'Executive Summary' },
    { id: 'streams', label: 'Revenue Streams' },
    { id: 'partners', label: 'Partner Directory' },
    { id: 'roadmap', label: 'Feature Roadmap' },
    { id: 'model', label: 'Financial Model' },
    { id: 'valuation', label: 'Valuation' },
    { id: 'sensitivity', label: 'Sensitivity' },
    { id: 'phases', label: 'Phased Roadmap' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Fixed nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b" style={{ background: 'var(--nav-bg)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderColor: 'var(--glass-border)' }}>
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">🏠</span>
            <span className="font-serif text-sm font-semibold" style={{ color: 'var(--text)' }}>Monetization Architecture</span>
          </div>
          <div className="hidden md:flex items-center gap-0.5 overflow-x-auto">
            {sections.map((s) => (
              <button key={s.id} onClick={() => { setActiveSection(s.id); document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' }); }}
                className="text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all whitespace-nowrap"
                style={activeSection === s.id ? { background: 'var(--accent)', color: 'white' } : { color: 'var(--text-dim)' }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 pt-16 pb-20 space-y-16">

        {/* ═══ EXECUTIVE SUMMARY ═══ */}
        <section id="executive" className="space-y-6">
          <div className="text-center pt-8">
            <h1 className="font-serif text-3xl sm:text-4xl mb-2" style={{ color: 'var(--text)' }}>
              HomeProjectIQ Revenue Architecture
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-sub)' }}>
              {REVENUE_STREAMS.length} revenue streams &middot; {NAMED_PARTNERS.length} named partners &middot; 3-year financial model
            </p>
          </div>

          {/* Hero metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Year 1 Revenue', value: Y1_TOTAL, color: 'var(--accent)' },
              { label: 'Year 2 Revenue', value: Y2_TOTAL, color: 'var(--gold)' },
              { label: 'Year 3 Revenue', value: Y3_TOTAL, color: 'var(--emerald)' },
              { label: 'Y3 Valuation (est.)', value: 80000000, color: 'var(--info)' },
            ].map((m) => (
              <div key={m.label} className="rounded-2xl p-4 text-center border border-[var(--glass-border)]" style={{ background: 'var(--bg-deep)' }}>
                <p className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: m.color }}>
                  <AnimatedNumber value={m.value} />
                </p>
                <p className="text-[10px] font-medium" style={{ color: 'var(--text-dim)' }}>{m.label}</p>
              </div>
            ))}
          </div>

          {/* Top 5 moves */}
          <div className="rounded-2xl p-5 border border-[var(--glass-border)]" style={{ background: 'var(--glass)' }}>
            <h3 className="font-serif text-lg mb-3" style={{ color: 'var(--text)' }}>Top 5 Highest-Impact Moves</h3>
            <div className="space-y-2">
              {[
                { n: 1, title: 'Enable Affiliate Links', desc: 'Flip the existing feature flag. Home Depot, Lowe\'s, Amazon affiliate programs. Zero UX impact, immediate revenue.', impact: '$75K-1.25M/yr', time: '1 month' },
                { n: 2, title: 'Launch Contractor Lead Gen', desc: 'Route "Hire a Pro" verdicts to Angi, Thumbtack, Porch as qualified leads at $25-75/lead.', impact: '$150K-2.5M/yr', time: '2 months' },
                { n: 3, title: 'Freemium Pro Subscription', desc: 'Gate AI assessments (3/mo free), wall/yard analysis, and multi-property behind $7.99/mo tier.', impact: '$90K-1.5M/yr', time: '2 months' },
                { n: 4, title: 'Featured Pro Placements', desc: 'Activate existing FeaturedProCard component. Contractors pay $75-250/mo for premium positioning.', impact: '$72K-1.2M/yr', time: '4 months' },
                { n: 5, title: 'Home Warranty Referrals', desc: 'Target users with aging systems (HVAC 10+, water heater 8+) for warranty referrals at $80-120 CPA.', impact: '$36K-360K/yr', time: '1 month' },
              ].map((move) => (
                <div key={move.n} className="flex items-start gap-3 p-3 rounded-xl border border-[var(--glass-border)]" style={{ background: 'var(--bg-deep)' }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold" style={{ background: 'var(--accent)', color: 'white' }}>
                    {move.n}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{move.title}</p>
                      <span className="text-[10px] font-bold shrink-0 ml-2" style={{ color: 'var(--emerald)' }}>{move.impact}</span>
                    </div>
                    <p className="text-[11px]" style={{ color: 'var(--text-sub)' }}>{move.desc}</p>
                    <span className="text-[9px]" style={{ color: 'var(--text-dim)' }}>Time to revenue: {move.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category breakdown rings */}
          <div className="grid grid-cols-5 gap-2">
            {CATEGORIES.map((cat) => {
              const total = REVENUE_STREAMS.filter((s) => s.category === cat).reduce((sum, s) => sum + s.y3, 0);
              const colors: Record<string, string> = { 'Direct Consumer': 'var(--accent)', Partnership: 'var(--emerald)', Platform: 'var(--info)', Data: 'var(--gold)', Brand: '#C084FC' };
              return (
                <div key={cat} className="flex flex-col items-center gap-1">
                  <Ring value={total} max={Y3_TOTAL} size={60} color={colors[cat] ?? 'var(--accent)'} label={fmt(total)} />
                  <span className="text-[9px] text-center font-medium" style={{ color: 'var(--text-dim)' }}>{cat}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══ REVENUE STREAMS ═══ */}
        <section id="streams" className="space-y-4">
          <h2 className="font-serif text-2xl" style={{ color: 'var(--text)' }}>Revenue Stream Inventory</h2>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--glass)' }}>
              {['All', ...CATEGORIES].map((c) => (
                <button key={c} onClick={() => setCategoryFilter(c)}
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-all"
                  style={categoryFilter === c ? { background: 'var(--accent)', color: 'white' } : { color: 'var(--text-dim)' }}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--glass)' }}>
              {['All', 'High', 'Medium', 'Speculative'].map((c) => (
                <button key={c} onClick={() => setConfidenceFilter(c)}
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-all"
                  style={confidenceFilter === c ? { background: 'var(--accent)', color: 'white' } : { color: 'var(--text-dim)' }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Stream cards */}
          <div className="space-y-2">
            {filteredStreams.map((stream) => {
              const isOpen = expandedStream === stream.id;
              const confColor = stream.confidence === 'High' ? 'var(--emerald)' : stream.confidence === 'Medium' ? 'var(--gold)' : 'var(--danger)';
              return (
                <div key={stream.id}>
                  <button onClick={() => setExpandedStream(isOpen ? null : stream.id)}
                    className="w-full text-left rounded-xl p-4 border border-[var(--glass-border)] transition-all hover:border-[var(--glass-border-hover)]"
                    style={{ background: 'var(--glass)' }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{stream.name}</span>
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0"
                          style={{ background: confColor + '20', color: confColor }}>
                          {stream.confidence}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded shrink-0" style={{ background: 'var(--glass)', color: 'var(--text-dim)' }}>
                          {stream.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-2">
                        <div className="text-right hidden sm:block">
                          <p className="text-[9px]" style={{ color: 'var(--text-dim)' }}>Y1 / Y2 / Y3</p>
                          <p className="text-xs font-bold" style={{ color: 'var(--text)' }}>
                            {fmt(stream.y1)} / {fmt(stream.y2)} / {fmt(stream.y3)}
                          </p>
                        </div>
                        <span className="text-lg font-bold" style={{ color: 'var(--emerald)' }}>{fmt(stream.y3)}</span>
                        <span className="text-[10px] transition-transform" style={{ color: 'var(--text-dim)', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>&#9656;</span>
                      </div>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="mx-2 mt-1 mb-2 rounded-xl p-4 space-y-3 animate-rise border border-[var(--glass-border)]" style={{ background: 'var(--bg-deep)' }}>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-sub)' }}>{stream.description}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { label: 'Pricing', value: stream.pricing },
                          { label: 'Margin', value: `${stream.margin}%` },
                          { label: 'Time to Revenue', value: `${stream.timeToRevenue} months` },
                          { label: 'Scalability', value: stream.scalability },
                        ].map((d) => (
                          <div key={d.label} className="rounded-lg p-2" style={{ background: 'var(--glass)' }}>
                            <p className="text-[8px] font-semibold uppercase" style={{ color: 'var(--text-dim)' }}>{d.label}</p>
                            <p className="text-[11px] font-medium" style={{ color: 'var(--text)' }}>{d.value}</p>
                          </div>
                        ))}
                      </div>
                      <div className="rounded-lg p-2" style={{ background: 'var(--glass)' }}>
                        <p className="text-[8px] font-semibold uppercase mb-0.5" style={{ color: 'var(--text-dim)' }}>Dependencies</p>
                        <p className="text-[10px]" style={{ color: 'var(--text-sub)' }}>{stream.dependencies}</p>
                      </div>
                      <div className="rounded-lg p-2" style={{ background: 'var(--accent-soft)' }}>
                        <p className="text-[8px] font-semibold uppercase mb-0.5" style={{ color: 'var(--accent)' }}>Assumptions</p>
                        <p className="text-[10px]" style={{ color: 'var(--accent)' }}>{stream.assumptions}</p>
                      </div>
                      {/* Revenue bars */}
                      <div className="space-y-1">
                        {[
                          { label: 'Year 1', value: stream.y1, color: 'var(--accent)' },
                          { label: 'Year 2', value: stream.y2, color: 'var(--gold)' },
                          { label: 'Year 3', value: stream.y3, color: 'var(--emerald)' },
                        ].map((y) => (
                          <div key={y.label}>
                            <div className="flex justify-between mb-0.5">
                              <span className="text-[9px]" style={{ color: 'var(--text-dim)' }}>{y.label}</span>
                              <span className="text-[9px] font-bold" style={{ color: y.color }}>{fmtFull(y.value)}</span>
                            </div>
                            <MiniBar value={y.value} max={stream.y3 || 1} color={y.color} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══ PARTNER DIRECTORY ═══ */}
        <section id="partners" className="space-y-4">
          <h2 className="font-serif text-2xl" style={{ color: 'var(--text)' }}>Named Partner Directory</h2>
          <p className="text-xs" style={{ color: 'var(--text-sub)' }}>
            {NAMED_PARTNERS.length} specific companies identified with estimated deal values and partnership rationale.
          </p>

          <div className="grid sm:grid-cols-2 gap-2">
            {NAMED_PARTNERS.map((p) => {
              const isOpen = expandedPartner === p.name;
              const confColor = p.confidence === 'High' ? 'var(--emerald)' : p.confidence === 'Medium' ? 'var(--gold)' : 'var(--danger)';
              return (
                <button key={p.name} onClick={() => setExpandedPartner(isOpen ? null : p.name)}
                  className="w-full text-left rounded-xl p-4 border border-[var(--glass-border)] transition-all hover:border-[var(--glass-border-hover)]"
                  style={{ background: 'var(--glass)' }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{p.logo}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{p.name}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'var(--glass)', color: 'var(--text-dim)' }}>{p.type}</span>
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded" style={{ background: confColor + '20', color: confColor }}>{p.confidence}</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold shrink-0" style={{ color: 'var(--emerald)' }}>{p.dealValue}</span>
                  </div>
                  {isOpen && (
                    <div className="mt-2 pt-2 border-t border-[var(--glass-border)] animate-rise">
                      <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-sub)' }}>{p.whyTheyCare}</p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* ═══ FEATURE ROADMAP ═══ */}
        <section id="roadmap" className="space-y-4">
          <h2 className="font-serif text-2xl" style={{ color: 'var(--text)' }}>Feature-Revenue Roadmap</h2>
          <p className="text-xs" style={{ color: 'var(--text-sub)' }}>Ranked by Revenue Per Dev-Month. Build the highest-ROI features first.</p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs" style={{ color: 'var(--text)' }}>
              <thead>
                <tr className="border-b border-[var(--glass-border)]">
                  {['Feature', 'Revenue Potential', 'Build Effort', 'ROI/Mo', 'Phase', 'Unlocks'].map((h) => (
                    <th key={h} className="text-left py-2 px-2 text-[10px] font-semibold" style={{ color: 'var(--text-dim)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURE_ROADMAP.map((f) => {
                  const phaseColors: Record<string, string> = { A: 'var(--emerald)', B: 'var(--gold)', C: 'var(--info)', D: '#C084FC' };
                  return (
                    <tr key={f.name} className="border-b border-[var(--glass-border)] hover:bg-[var(--glass)]">
                      <td className="py-2.5 px-2 font-medium">{f.name}</td>
                      <td className="py-2.5 px-2 font-bold" style={{ color: 'var(--emerald)' }}>{f.revenue}</td>
                      <td className="py-2.5 px-2">{f.effort}</td>
                      <td className="py-2.5 px-2 font-bold" style={{ color: f.roiPerMonth > 0 ? 'var(--accent)' : 'var(--text-dim)' }}>
                        {f.roiPerMonth > 0 ? fmt(f.roiPerMonth) : 'TBD'}
                      </td>
                      <td className="py-2.5 px-2">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: (phaseColors[f.phase] ?? 'var(--text-dim)') + '20', color: phaseColors[f.phase] }}>
                          Phase {f.phase}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-[10px]" style={{ color: 'var(--text-sub)' }}>{f.unlocks}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ═══ FINANCIAL MODEL ═══ */}
        <section id="model" className="space-y-4">
          <h2 className="font-serif text-2xl" style={{ color: 'var(--text)' }}>3-Year Financial Model</h2>

          {/* Year toggle */}
          <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: 'var(--glass)' }}>
            {([1, 2, 3] as const).map((y) => (
              <button key={y} onClick={() => setYearFilter(y)}
                className="text-xs font-semibold px-4 py-1.5 rounded-lg transition-all"
                style={yearFilter === y ? { background: 'var(--accent)', color: 'white' } : { color: 'var(--text-dim)' }}
              >
                Year {y}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            {/* Chart */}
            <div className="rounded-2xl p-5 border border-[var(--glass-border)]" style={{ background: 'var(--bg-deep)' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Revenue by Category</h3>
                <span className="text-lg font-bold" style={{ color: 'var(--accent)' }}>
                  {fmt(filteredStreams.reduce((s, r) => s + r[yearFilter === 1 ? 'y1' : yearFilter === 2 ? 'y2' : 'y3'], 0))}
                </span>
              </div>
              <RevenueChart streams={REVENUE_STREAMS} yearFilter={yearFilter} />
            </div>

            {/* Summary table */}
            <div className="rounded-2xl p-5 border border-[var(--glass-border)]" style={{ background: 'var(--bg-deep)' }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>P&L Summary</h3>
              <div className="space-y-2">
                {[
                  { label: 'Total Revenue', y1: Y1_TOTAL, y2: Y2_TOTAL, y3: Y3_TOTAL, bold: true },
                  { label: 'Direct Consumer', y1: 120000, y2: 648000, y3: 2040000 },
                  { label: 'Partnership', y1: 393000, y2: 1884000, y3: 5790000 },
                  { label: 'Platform', y1: 0, y2: 370000, y3: 1850000 },
                  { label: 'Data', y1: 0, y2: 275000, y3: 1125000 },
                  { label: 'Brand', y1: 54000, y2: 216000, y3: 540000 },
                  { label: 'Est. Gross Margin', y1: Math.round(Y1_TOTAL * 0.87), y2: Math.round(Y2_TOTAL * 0.85), y3: Math.round(Y3_TOTAL * 0.84), bold: true },
                ].map((row) => (
                  <div key={row.label} className={`flex items-center justify-between py-1 ${row.bold ? 'border-t border-[var(--glass-border)] pt-2' : ''}`}>
                    <span className={`text-xs ${row.bold ? 'font-bold' : ''}`} style={{ color: row.bold ? 'var(--text)' : 'var(--text-sub)' }}>{row.label}</span>
                    <div className="flex gap-4">
                      {[row.y1, row.y2, row.y3].map((v, i) => (
                        <span key={i} className={`text-xs text-right w-16 ${row.bold ? 'font-bold' : ''}`}
                          style={{ color: yearFilter === (i + 1) ? 'var(--accent)' : 'var(--text-dim)' }}>
                          {fmt(v)}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg p-2" style={{ background: 'var(--accent-soft)' }}>
                <p className="text-[9px]" style={{ color: 'var(--accent)' }}>
                  Assumptions: Y1 30K avg MAU, Y2 125K avg MAU, Y3 350K avg MAU. Conservative conversion rates benchmarked against category leaders.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ VALUATION ═══ */}
        <section id="valuation" className="space-y-4">
          <h2 className="font-serif text-2xl" style={{ color: 'var(--text)' }}>Valuation Trajectory</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs" style={{ color: 'var(--text)' }}>
              <thead>
                <tr className="border-b border-[var(--glass-border)]">
                  {['Stage', 'Users', 'Revenue', 'Revenue Multiple', 'User Multiple', 'Est. Valuation', 'Note'].map((h) => (
                    <th key={h} className="text-left py-2 px-2 text-[10px] font-semibold" style={{ color: 'var(--text-dim)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {VALUATION_TRAJECTORY.map((v) => (
                  <tr key={v.stage} className="border-b border-[var(--glass-border)] hover:bg-[var(--glass)]">
                    <td className="py-2.5 px-2 font-semibold">{v.stage}</td>
                    <td className="py-2.5 px-2">{v.users}</td>
                    <td className="py-2.5 px-2">{v.revenue}</td>
                    <td className="py-2.5 px-2">{v.revenueMultiple}</td>
                    <td className="py-2.5 px-2">{v.userMultiple}</td>
                    <td className="py-2.5 px-2 font-bold" style={{ color: 'var(--emerald)' }}>{v.combined}</td>
                    <td className="py-2.5 px-2 text-[10px]" style={{ color: 'var(--text-dim)' }}>{v.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Investor narrative */}
          <div className="rounded-2xl p-5 border border-[var(--glass-border)]" style={{ background: 'var(--bg-deep)' }}>
            <h3 className="font-serif text-lg mb-3" style={{ color: 'var(--text)' }}>Investor Narrative</h3>
            <div className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--text-sub)' }}>
              <p>
                <strong style={{ color: 'var(--text)' }}>Thesis:</strong> HomeProjectIQ captures the $500B+ home improvement market at the decision layer. Every homeowner faces the same question — &ldquo;Should I fix this myself or hire someone?&rdquo; — and currently relies on YouTube videos, guesswork, and expensive contractor visits. We replace that with a 60-second AI assessment.
              </p>
              <p>
                <strong style={{ color: 'var(--text)' }}>Moat:</strong> (1) Data — every assessment generates labeled training data that improves AI accuracy; (2) Network — contractor marketplace creates two-sided network effects; (3) Switching costs — home health history, maintenance records, and skill progression cannot be replicated; (4) Brand — category ownership of &ldquo;DIY or hire a pro?&rdquo;
              </p>
              <p>
                <strong style={{ color: 'var(--text)' }}>Growth flywheel:</strong> User takes photo &rarr; gets free diagnosis &rarr; buys materials (affiliate revenue) OR hires pro (lead gen revenue) &rarr; logs project &rarr; earns XP &rarr; shares with friends &rarr; friends join &rarr; contractor supply grows &rarr; better matching &rarr; more users.
              </p>
              <p>
                <strong style={{ color: 'var(--text)' }}>Exit path:</strong> Strategic acquisition by Home Depot ($157B), Lowe&apos;s ($87B), or Angi ($1.8B) who need a consumer-facing AI layer. At 500K users and $8M ARR, comparable exits are 15-20x revenue = $120M-$160M. Alternatively, continue scaling toward IPO at 2M+ users.
              </p>
            </div>
          </div>
        </section>

        {/* ═══ SENSITIVITY ═══ */}
        <section id="sensitivity" className="space-y-4">
          <h2 className="font-serif text-2xl" style={{ color: 'var(--text)' }}>Sensitivity Analysis</h2>
          <p className="text-xs" style={{ color: 'var(--text-sub)' }}>
            Adjust the top 5 revenue streams to model bull, base, and bear scenarios. Drag sliders to see impact on Year 3 total.
          </p>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="rounded-2xl p-5 border border-[var(--glass-border)] space-y-4" style={{ background: 'var(--bg-deep)' }}>
              {REVENUE_STREAMS.slice(0, 5).map((s) => (
                <SensitivitySlider
                  key={s.id}
                  label={s.name}
                  base={s.y3}
                  onChange={(mult) => setSensMultipliers((prev) => ({ ...prev, [s.id]: mult }))}
                />
              ))}
            </div>

            <div className="rounded-2xl p-5 border border-[var(--glass-border)] flex flex-col items-center justify-center" style={{ background: 'var(--bg-deep)' }}>
              <p className="text-xs mb-2" style={{ color: 'var(--text-dim)' }}>Adjusted Year 3 Total Revenue</p>
              <p className="text-4xl font-bold mb-4" style={{ color: sensTotal > Y3_TOTAL ? 'var(--emerald)' : sensTotal < Y3_TOTAL ? 'var(--danger)' : 'var(--text)' }}>
                {fmt(sensTotal)}
              </p>
              <div className="flex gap-4 text-center">
                <div>
                  <p className="text-lg font-bold" style={{ color: 'var(--danger)' }}>{fmt(Math.round(Y3_TOTAL * 0.5))}</p>
                  <p className="text-[9px]" style={{ color: 'var(--text-dim)' }}>Bear (0.5x)</p>
                </div>
                <div>
                  <p className="text-lg font-bold" style={{ color: 'var(--text)' }}>{fmt(Y3_TOTAL)}</p>
                  <p className="text-[9px]" style={{ color: 'var(--text-dim)' }}>Base</p>
                </div>
                <div>
                  <p className="text-lg font-bold" style={{ color: 'var(--emerald)' }}>{fmt(Math.round(Y3_TOTAL * 2))}</p>
                  <p className="text-[9px]" style={{ color: 'var(--text-dim)' }}>Bull (2x)</p>
                </div>
              </div>
              <div className="mt-4 w-full">
                <MiniBar value={sensTotal} max={Y3_TOTAL * 2} color={sensTotal > Y3_TOTAL ? 'var(--emerald)' : sensTotal < Y3_TOTAL ? 'var(--danger)' : 'var(--accent)'} />
              </div>
            </div>
          </div>
        </section>

        {/* ═══ PHASED ROADMAP ═══ */}
        <section id="phases" className="space-y-4">
          <h2 className="font-serif text-2xl" style={{ color: 'var(--text)' }}>Monetization Roadmap</h2>

          {[
            {
              phase: 'A', title: 'Foundation', timeline: 'Months 1-3', color: 'var(--emerald)',
              target: 'Prove unit economics',
              items: [
                'Activate affiliate links (existing component + flag)',
                'Implement freemium paywall with Stripe',
                'Build contractor lead routing to Angi/Thumbtack',
                'Launch home warranty referral program',
              ],
              revenue: '$400K-600K ARR run rate',
            },
            {
              phase: 'B', title: 'Growth', timeline: 'Months 4-8', color: 'var(--gold)',
              target: 'Diversify revenue sources',
              items: [
                'Launch Featured Pro self-serve ad portal',
                'Sign first 4 category sponsors',
                'Build email newsletter with sponsor placements',
                'Activate tool brand partnerships',
                'Expand to 50+ metro areas for lead gen',
              ],
              revenue: '$1.5M-2.5M ARR run rate',
            },
            {
              phase: 'C', title: 'Scale', timeline: 'Months 9-18', color: 'var(--info)',
              target: 'Build platform economics',
              items: [
                'Launch full Pro Marketplace with payments/escrow',
                'Certified Pro Program ($500/yr)',
                'B2B enterprise intelligence reports',
                'Real estate API integration',
              ],
              revenue: '$5M-8M ARR run rate',
            },
            {
              phase: 'D', title: 'Dominance', timeline: 'Months 18-36', color: '#C084FC',
              target: 'Maximize valuation',
              items: [
                'Insurance data partnerships (Hippo, Lemonade)',
                'MLS integration for home health scores',
                'White-label platform for property management',
                'International expansion (10 languages already supported)',
              ],
              revenue: '$10M-18M ARR run rate',
            },
          ].map((phase) => (
            <div key={phase.phase} className="rounded-2xl p-5 border-l-4" style={{ borderColor: phase.color, background: 'var(--glass)' }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: phase.color, color: 'white' }}>
                  {phase.phase}
                </span>
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Phase {phase.phase}: {phase.title}</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-dim)' }}>{phase.timeline} &middot; Target: {phase.target}</p>
                </div>
                <span className="ml-auto text-sm font-bold" style={{ color: phase.color }}>{phase.revenue}</span>
              </div>
              <div className="space-y-1 ml-11">
                {phase.items.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="text-[10px]" style={{ color: phase.color }}>&#9656;</span>
                    <span className="text-xs" style={{ color: 'var(--text-sub)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* ═══ FOOTER ═══ */}
        <div className="text-center pt-8 border-t border-[var(--glass-border)]">
          <p className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
            HomeProjectIQ Monetization Architecture &middot; {REVENUE_STREAMS.length} Revenue Streams &middot; {NAMED_PARTNERS.length} Named Partners &middot; Generated March 2026
          </p>
        </div>
      </div>
    </div>
  );
}
