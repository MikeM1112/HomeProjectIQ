'use client';

import { useState, useEffect, useRef } from 'react';

// ══════════════════════════════════════════════════════════════
// 10 ELITE AI COUNCIL — SYNTHESIZED MONETIZATION INTELLIGENCE
// ══════════════════════════════════════════════════════════════

const COUNCIL = [
  { id: 'pricing', name: 'Pricing Psychologist', icon: '🧠', color: '#8B5CF6', finding: '$12.99/mo optimal price point. 5% base conversion, 3 lifetime free assessments (not monthly). LTV $182.82, CAC target $60.94, 5.7-month payback.' },
  { id: 'partnerships', name: 'Partnership BD Director', icon: '🤝', color: '#3B82F6', finding: 'Home Depot 2-8%, Lowe\'s 2%, Amazon 3% affiliate rates. Angi pays $15-40/lead. AHS $18-30 CPA. Hippo $25/lead. Angi lead gen is #1 revenue stream at scale.' },
  { id: 'marketplace', name: 'Marketplace Architect', icon: '🏗️', color: '#F59E0B', finding: 'Pre-qualified leads worth $150-300 (3x Angi) due to project intelligence. 15-20% take rate defensible. Minimum 15-30 contractors per metro per category for liquidity.' },
  { id: 'data', name: 'Data Economist', icon: '📊', color: '#10B981', finding: 'Data asset worth $90-300/user at 100K users. Insurance reports $20-50 each. CoreLogic sold for $6B. Longitudinal data compounds — Year 5 data worth 3-6x Year 1 data per home.' },
  { id: 'competitor', name: 'Competitor Analyst', icon: '🔍', color: '#EF4444', finding: 'Angi declining 39% from $1.8B peak. Thumbtack growing at $400M. Yelp Home $768M. No consumer AI home assessment app exists at scale — genuine blue ocean.' },
  { id: 'vc', name: 'VC & Exit Analyst', icon: '💰', color: '#F97316', finding: 'Series A: $1-5M ARR, 50K+ MAU. Matterport acquired at 12x revenue. Strategic acquirers: Home Depot, Zillow, Apple. AI premium = 3-5x over non-AI at same revenue.' },
  { id: 'growth', name: 'Growth Strategist', icon: '📈', color: '#06B6D4', finding: 'Realistic Y1: 8-12K users. Tool lending = strongest viral loop (K~0.15). ASO is highest-ROI channel. Concentrate in 2-3 metros, not national. D30 retention target: 10%.' },
  { id: 'brand', name: 'Brand Strategist', icon: '🎨', color: '#EC4899', finding: 'Credit Karma model: $1.6B from free product via lead gen. Duolingo 8.8% free-to-paid. "Carfax for Homes" positioning. Newsletter CPM $40-60. NPS target 50+.' },
  { id: 'product', name: 'Product Monetization', icon: '⚙️', color: '#6366F1', finding: '18 upsell moments mapped across app flow. LiveBids = #1 revenue feature. Gate levels 4-5 of SkillTree behind Pro. Emergency Mode paywall for urgent users.' },
  { id: 'consumer', name: 'Consumer Psychologist', icon: '🎯', color: '#14B8A6', finding: 'Loss aversion 2x stronger than gain framing. Emergency users accept 2-3x premiums. First-time homeowners (median age 38) = highest conversion segment. 83% faced unexpected repairs.' },
];

// ── REFINED REVENUE STREAMS (Council-Validated) ──
const STREAMS = [
  {
    id: 'leads', tier: 1, name: 'Pre-Qualified Contractor Leads', category: 'Marketplace',
    icon: '🎯', pricing: '$150-300/lead', y1: 36000, y2: 540000, y3: 2400000, y4: 6000000, y5: 12000000,
    margin: 95, confidence: 'High', council: ['marketplace', 'partnerships'],
    insight: 'HomeProjectIQ leads close at 45-60% vs Angi\'s 10-15%. Contractors save 28% on effective CAC even at 3x the lead price.',
    assumptions: 'Y1: 20 leads/mo × $150. Y2: 300/mo × $150. Y3: 1K/mo × $200. Requires contractor supply-side build.',
  },
  {
    id: 'sub', tier: 1, name: 'Pro Subscription', category: 'Consumer',
    icon: '👑', pricing: '$12.99/mo · $89.99/yr', y1: 45000, y2: 432000, y3: 1620000, y4: 4050000, y5: 8100000,
    margin: 90, confidence: 'High', council: ['pricing', 'product'],
    insight: 'Metered paywall: 3 lifetime free assessments. Annual default (37% discount). LTV $182.82 at 14-month avg tenure.',
    assumptions: 'Y1: 10K users × 5% = 500 subs. Y2: 60K × 6% = 3.6K. Y3: 200K × 8% = 16K. 70% annual mix.',
  },
  {
    id: 'contractor-subs', tier: 1, name: 'Contractor Subscriptions', category: 'B2B',
    icon: '🔨', pricing: '$99-199/mo featured placement', y1: 57600, y2: 360000, y3: 1200000, y4: 3000000, y5: 6000000,
    margin: 88, confidence: 'High', council: ['marketplace', 'product'],
    insight: 'B2B recurring revenue. Contractors pay for featured placement, priority matching, and reputation tools. Angi charges $200-550+/mo.',
    assumptions: 'Y1: 60 pros × $80/mo. Y2: 300 × $100/mo. Y3: 800 × $125/mo. Metro-by-metro expansion.',
  },
  {
    id: 'affiliate', tier: 1, name: 'Affiliate Commerce', category: 'Partnership',
    icon: '🛒', pricing: 'HD 2-8% · Lowe\'s 2% · Amazon 3%', y1: 50000, y2: 300000, y3: 950000, y4: 2400000, y5: 5000000,
    margin: 95, confidence: 'High', council: ['partnerships', 'brand'],
    insight: 'AffiliateBuyButton component already built. Shop tab in DiagnosisView generates contextual purchase intent. Zero-friction revenue.',
    assumptions: '$50 avg material spend per project, 2.5 projects/yr, 5% avg commission, 30% CTR, 15% purchase conversion.',
  },
  {
    id: 'insurance-data', tier: 2, name: 'Insurance Data Licensing', category: 'Data',
    icon: '🏛️', pricing: '$20-50/verified home report', y1: 0, y2: 150000, y3: 750000, y4: 3000000, y5: 8000000,
    margin: 85, confidence: 'Medium', council: ['data', 'vc'],
    insight: 'Verified maintenance data reduces insurer claims 5-15%. Verisk makes $2.9B/yr selling similar data. Clean room approach satisfies CCPA/GDPR.',
    assumptions: 'Y2: pilot with 1-2 carriers. Y3: 3 carriers × $250K. Requires 10K+ homes per geographic cell for actuarial credibility.',
  },
  {
    id: 'warranty', tier: 2, name: 'Home Warranty Referrals', category: 'Partnership',
    icon: '🛡️', pricing: '$18-30 CPA per sale', y1: 15000, y2: 120000, y3: 450000, y4: 1200000, y5: 2500000,
    margin: 92, confidence: 'High', council: ['partnerships', 'consumer'],
    insight: 'Triggered when HomeHealth shows system at 75%+ lifespan. $9.5B home warranty market. AHS, Choice Home Warranty, First American.',
    assumptions: 'Contextual upsell at system age thresholds. Y1: 500 conversions × $30. Scales with user base and system tracking.',
  },
  {
    id: 'credits', tier: 2, name: 'AI Credit Packs (IAP)', category: 'Consumer',
    icon: '✨', pricing: '$2.99/5 · $6.99/8 · $14.99/20', y1: 15000, y2: 96000, y3: 300000, y4: 750000, y5: 1500000,
    margin: 85, confidence: 'High', council: ['pricing', 'product'],
    insight: 'Alternative to subscription for occasional users. 8% of free users buy credits. Credit packs convert users who reject monthly commitment.',
    assumptions: '8% of free users purchase, avg $6/yr. Complements subscription, does not cannibalize.',
  },
  {
    id: 'data-api', tier: 2, name: 'Predictive Analytics API', category: 'Data',
    icon: '🔮', pricing: '$1-3/API call', y1: 0, y2: 50000, y3: 500000, y4: 2000000, y5: 5000000,
    margin: 80, confidence: 'Medium', council: ['data', 'marketplace'],
    insight: 'Failure prediction by system age + maintenance history. OEMs pay $50K-500K/yr for 100K+ home datasets. Retailers pay $200K-1M/yr for trend data.',
    assumptions: 'Requires 100K+ users for statistical significance. OEM + retailer + contractor chain buyers.',
  },
  {
    id: 'sponsored', tier: 3, name: 'Sponsored Content & Newsletter', category: 'Brand',
    icon: '📰', pricing: '$40-60 CPM · $2K-8K/sponsor', y1: 10000, y2: 80000, y3: 300000, y4: 800000, y5: 1500000,
    margin: 75, confidence: 'Medium', council: ['brand'],
    insight: 'High-intent homeowner audience commands premium CPMs. The Spruce model: SEO → buying guide → affiliate. YouTube DIY RPM $4-11/1K views.',
    assumptions: 'Newsletter + in-app sponsored tips. Seasonal sponsor packages. Brand advertiser demand grows with user base.',
  },
  {
    id: 'seal', tier: 3, name: 'HomeProjectIQ Seal Program', category: 'Brand',
    icon: '✅', pricing: '$5K-25K/yr per product line', y1: 0, y2: 25000, y3: 150000, y4: 500000, y5: 1200000,
    margin: 90, confidence: 'Low', council: ['brand'],
    insight: 'Good Housekeeping Seal model. Manufacturers pay for testing + right to use seal on packaging and Amazon listings. Requires trusted community.',
    assumptions: 'Y2: 2-3 brands. Y3: 10-15 brands. Scales with brand authority and user trust (NPS 50+).',
  },
  {
    id: 'tool-rental', tier: 3, name: 'P2P Tool Rental Marketplace', category: 'Adjacent',
    icon: '🔧', pricing: '20-25% take rate', y1: 0, y2: 0, y3: 120000, y4: 600000, y5: 2000000,
    margin: 80, confidence: 'Low', council: ['marketplace', 'growth'],
    insight: 'P2P tool marketplace: $1.53B market growing 18.7% CAGR. AI assessment identifies needed tools, surfaces neighbor rentals. Strongest viral loop.',
    assumptions: 'Requires local density (15-20 neighbors per 0.5mi). Launch Y3 in dense metros only.',
  },
  {
    id: 'materials', tier: 3, name: 'Materials Group Buying', category: 'Adjacent',
    icon: '🧱', pricing: '5-10% margin on brokered materials', y1: 0, y2: 0, y3: 100000, y4: 500000, y5: 1500000,
    margin: 70, confidence: 'Low', council: ['marketplace'],
    insight: 'Blue ocean: no platform aggregates DIY homeowner materials demand at SKU level. AI assessment creates precise materials lists.',
    assumptions: 'Requires supplier contracts and aggregated demand across metro areas. Y3+ opportunity.',
  },
  {
    id: 'workshops', tier: 3, name: 'DIY Workshop Marketplace', category: 'Adjacent',
    icon: '🎓', pricing: '20-30% of class fees', y1: 0, y2: 15000, y3: 80000, y4: 300000, y5: 800000,
    margin: 85, confidence: 'Low', council: ['marketplace', 'brand'],
    insight: 'When AI identifies skill gap, surface local workshop. Made Trade sells classes at $65-125/session. Community-building flywheel.',
    assumptions: 'Instructor supply build required. Local retired contractors as teachers. Y2 pilot in 1-2 metros.',
  },
  {
    id: 'home-sub', tier: 3, name: 'Home Services Subscription', category: 'Adjacent',
    icon: '🏠', pricing: '$29-49/mo membership', y1: 0, y2: 0, y3: 200000, y4: 1000000, y5: 3000000,
    margin: 80, confidence: 'Medium', council: ['marketplace', 'consumer'],
    insight: 'Monthly membership unlocks discounted contractor rates + priority booking + AI tools. $468/yr vs one-time transactional use. LTV multiplier.',
    assumptions: 'Converts homeowner from transaction customer to recurring. Requires mature contractor network. Y3+ launch.',
  },
];

// ── COMPETITIVE LANDSCAPE ──
const COMPETITORS = [
  { name: 'Angi', revenue: '$1.1B', trend: 'down', yoy: '-14%', model: 'Lead gen', weakness: 'Lead sharing destroyed trust. 39% revenue decline from peak.', users: '10M consumers, 147K pros' },
  { name: 'Thumbtack', revenue: '$400M', trend: 'up', yoy: '+27%', model: 'Credit/lead', weakness: 'No AI assessment. Pure matching. 90%+ gross margin.', users: '300K active pros' },
  { name: 'Yelp Home', revenue: '$768M', trend: 'up', yoy: '+13%', model: 'CPC ads', weakness: 'Review platform, not lead marketplace. No project intelligence.', users: '~40M monthly' },
  { name: 'Houzz', revenue: '$340M', trend: 'flat', yoy: '~0%', model: 'SaaS + ads + 15% marketplace', weakness: 'Pivoted to contractor SaaS. Consumer marketplace underperforms.', users: '40M uniques' },
  { name: 'Porch', revenue: '$437M', trend: 'down', yoy: '-12%', model: 'Data + insurance', weakness: 'Insurance losses crushed balance sheet. Stock down 90% from peak.', users: '30K inspectors' },
  { name: 'Hover', revenue: '$70M+', trend: 'up', yoy: '+40%', model: 'B2B subscriptions', weakness: 'Enterprise-only. No consumer app. Exterior imaging only.', users: 'State Farm, Travelers' },
  { name: 'TaskRabbit', revenue: '~$60M', trend: 'flat', yoy: '~5%', model: '22.5% take rate', weakness: 'Low AOV ($150-400). IKEA-subordinated strategy.', users: '~100K taskers' },
  { name: 'HomeProjectIQ', revenue: '$0 (pre-launch)', trend: 'up', yoy: 'N/A', model: 'AI assessment → marketplace', weakness: 'No users yet. Needs to prove PMF.', users: 'Pre-launch' },
];

// ── STRATEGIC ACQUIRERS ──
const ACQUIRERS = [
  { name: 'Home Depot', logo: '🟧', range: '$200M-800M', thesis: 'Consumer data layer. Predictive merchandising. Close diagnosis-to-purchase loop.', trigger: '500K+ MAU, purchase intent data' },
  { name: 'Lowe\'s', logo: '🔵', range: '$150M-600M', thesis: 'DIY consumer wedge. Behind HD on pro segment (30% vs 50%). Bought Artisan Design Group for $1.33B.', trigger: 'Strong DIY user base in Lowe\'s markets' },
  { name: 'Zillow', logo: '🏡', range: '$100M-500M', thesis: 'Post-purchase relationship. Improves Zestimate. Move-intent prediction from deferred maintenance.', trigger: '1M+ homeowners with maintenance history' },
  { name: 'Apple', logo: '🍎', range: '$200M-500M', thesis: 'Physical home data for HomeKit ecosystem. Smart home display launching 2025. Home condition intelligence gap.', trigger: '500K+ iOS MAU, proprietary AI models' },
  { name: 'Hippo Insurance', logo: '🦛', range: '$30M-100M', thesis: 'Proactive loss prevention. Underwriting signal from verified maintenance. Premium discount engine.', trigger: 'Correlation data: lower claims for users' },
  { name: 'Google', logo: '🔴', range: '$200M-500M', thesis: 'Ambient home data for Google Home/Assistant. 2K+ Home API developers. Nest integration.', trigger: 'National user base, AI models' },
];

// ── GROWTH MODEL ──
const GROWTH_MODEL = [
  { year: 'Y1', users: 10000, mau: 3500, paid: 500, revenue: 228600, cac: 15, kFactor: 0.15, channels: 'ASO, Content SEO, Founder network, Reddit' },
  { year: 'Y2', users: 65000, mau: 22000, paid: 3900, revenue: 2168000, cac: 45, kFactor: 0.30, channels: 'Referral program, Tool lending, RE partnerships, Paid UA $300K' },
  { year: 'Y3', users: 220000, mau: 75000, paid: 17600, revenue: 8120000, cac: 55, kFactor: 0.40, channels: '3+ dense metros, Contractor network, SEO 50K+ monthly visits' },
  { year: 'Y4', users: 600000, mau: 200000, paid: 54000, revenue: 26100000, cac: 50, kFactor: 0.45, channels: 'National expansion, B2B data deals, Insurance partnerships' },
  { year: 'Y5', users: 1200000, mau: 400000, paid: 108000, revenue: 59100000, cac: 45, kFactor: 0.50, channels: 'Platform effects, Adjacent marketplaces, International' },
];

// ── VALUATION TRAJECTORY ──
const VALUATION = [
  { stage: 'Pre-Seed', arr: '$0', mau: '<1K', valuation: '$2-5M', multiple: 'Team + vision', basis: 'Comparable: AI proptech seed rounds' },
  { stage: 'Seed', arr: '$250K-1M', mau: '10K-50K', valuation: '$5-15M', multiple: '$50-200/user', basis: 'Data moat thesis + user traction' },
  { stage: 'Series A', arr: '$2-5M', mau: '50K-250K', valuation: '$20-60M', multiple: '8-12x ARR + AI premium', basis: 'Median Series A pre-money: $45.7M' },
  { stage: 'Series B', arr: '$5-15M', mau: '250K-1M', valuation: '$60-200M', multiple: '8-15x ARR', basis: 'Revenue-driven valuation dominates' },
  { stage: 'Strategic Exit', arr: '$15-30M', mau: '1M-5M', valuation: '$200-500M', multiple: '10-20x ARR', basis: 'Matterport acquired at 12x by CoStar' },
  { stage: 'Platform Exit', arr: '$30M+', mau: '5M+', valuation: '$500M-1B+', multiple: 'Strategic premium', basis: 'Home Depot/Zillow/Apple acquisition' },
];

// ── DATA MOAT ──
const DATA_MOAT = [
  { users: '10K', dataValue: '$500K-2M', perUser: '$50-200', products: 'Internal model improvement, insurance pilot proof-of-concept', timeline: 'Y1' },
  { users: '100K', dataValue: '$9M-30M', perUser: '$90-300', products: 'Insurance licenses ($500K-2M/yr), warranty underwriting, OEM datasets', timeline: 'Y2-3' },
  { users: '1M', dataValue: '$100M-315M', perUser: '$100-315', products: 'National insurance carrier data ($5-15M/yr), retailer trends ($500K-2M/yr), API marketplace', timeline: 'Y4-5' },
];

// ── DEMOGRAPHIC SEGMENTS ──
const SEGMENTS = [
  { name: 'First-Time Homeowners', age: '25-40', size: '24% of buyers', wtp: '$7.99-14.99/mo', trigger: 'First unexpected repair', icon: '🏠', insight: 'Median age 38, $97K income, 46% over budget Y1. Highest conversion for fear-based messaging.' },
  { name: 'Experienced Homeowners', age: '40-60', size: '45% of market', wtp: '$12.99-24.99/mo', trigger: 'Bad contractor experience', icon: '🔑', insight: 'Value bid validation. Will pay premium for contractor vetting. Avg spend $14,140/yr.' },
  { name: 'Aging-in-Place', age: '60+', size: '20% of market', wtp: '$9.99-19.99/mo', trigger: 'Safety modification need', icon: '👴', insight: '66% of renovations include aging-in-place. Gifted subscription segment (adult children pay).' },
  { name: 'Landlords & Investors', age: '30-55', size: '11% of market', wtp: '$19.99-99/mo', trigger: 'ROI and liability', icon: '📋', insight: 'Property inspection SaaS benchmark $99-199/mo. Tax-deductible business expense. Highest LTV.' },
];

// ══════════════════════════════════════════════════════════════
// COMPONENTS
// ══════════════════════════════════════════════════════════════

function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setDisplay(Math.floor(p * value));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);
  return <span ref={ref}>{prefix}{display.toLocaleString()}{suffix}</span>;
}

function MiniRing({ pct, size = 40, color = 'var(--accent)' }: { pct: number; size?: number; color?: string }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={3} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round"
        strokeDasharray={`${(pct / 100) * circ} ${circ}`} style={{ transition: 'stroke-dasharray 1s ease' }} />
    </svg>
  );
}

function BarChart({ data, maxVal }: { data: { label: string; value: number; color: string }[]; maxVal: number }) {
  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-2">
          <span className="text-[10px] w-8 text-right" style={{ color: 'var(--text-dim)' }}>{d.label}</span>
          <div className="flex-1 h-5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="h-full rounded-full flex items-center px-2 transition-all duration-1000"
              style={{ width: `${Math.max((d.value / maxVal) * 100, 3)}%`, background: d.color }}>
              <span className="text-[9px] font-bold text-white whitespace-nowrap">
                ${d.value >= 1000000 ? `${(d.value / 1000000).toFixed(1)}M` : `${(d.value / 1000).toFixed(0)}K`}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════

const TABS = ['Council', 'Revenue', 'Financial', 'Competitive', 'Growth', 'Valuation', 'Data Moat'] as const;
type Tab = typeof TABS[number];

export default function MonetizationPage() {
  const [tab, setTab] = useState<Tab>('Council');
  const [expandedStream, setExpandedStream] = useState<string | null>(null);
  const [yearView, setYearView] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [tierFilter, setTierFilter] = useState<number>(0);
  const [expandedCouncil, setExpandedCouncil] = useState<string | null>(null);
  const [expandedAcquirer, setExpandedAcquirer] = useState<string | null>(null);

  const filteredStreams = tierFilter === 0 ? STREAMS : STREAMS.filter((s) => s.tier === tierFilter);
  const yearKey = `y${yearView}` as 'y1' | 'y2' | 'y3' | 'y4' | 'y5';
  const totalRev = filteredStreams.reduce((sum, s) => sum + s[yearKey], 0);
  const maxStreamRev = Math.max(...filteredStreams.map((s) => s[yearKey]));

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* ── HEADER ── */}
      <header className="border-b" style={{ borderColor: 'var(--glass-border)' }}>
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🏠</span>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text)', fontFamily: 'var(--font-heading)' }}>
              HomeProjectIQ — Monetization Intelligence
            </h1>
          </div>
          <p className="text-sm mb-4" style={{ color: 'var(--text-dim)' }}>
            Synthesized by 10 Elite AI Council Agents &middot; Research-backed &middot; Interactive
          </p>

          {/* KPI Strip */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: 'Y3 Revenue', value: '$8.1M', sub: 'Council consensus' },
              { label: 'Y5 Revenue', value: '$59.1M', sub: '14 revenue streams' },
              { label: 'Series A Target', value: '$45M', sub: 'Pre-money @ $2-5M ARR' },
              { label: 'LTV / CAC', value: '3.0x', sub: 'Target 5:1 at scale' },
              { label: 'Strategic Exit', value: '$200-500M', sub: 'HD / Zillow / Apple' },
            ].map((k) => (
              <div key={k.label} className="rounded-xl p-3 text-center" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
                <p className="text-[10px] font-semibold uppercase" style={{ color: 'var(--text-dim)' }}>{k.label}</p>
                <p className="text-lg font-bold" style={{ color: 'var(--accent)' }}>{k.value}</p>
                <p className="text-[9px]" style={{ color: 'var(--text-sub)' }}>{k.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── TAB NAV ── */}
      <nav className="sticky top-0 z-50 border-b" style={{ background: 'var(--bg)', borderColor: 'var(--glass-border)' }}>
        <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto py-2">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className="px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all"
              style={{
                background: tab === t ? 'var(--accent)' : 'transparent',
                color: tab === t ? 'white' : 'var(--text-dim)',
              }}>
              {t}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* ═══════════ COUNCIL TAB ═══════════ */}
        {tab === 'Council' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text)', fontFamily: 'var(--font-heading)' }}>The 10 AI Council Agents</h2>
              <p className="text-sm mb-4" style={{ color: 'var(--text-dim)' }}>Each agent conducted independent research across web sources, competitive data, and financial benchmarks. Click any agent to see their full analysis.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {COUNCIL.map((c) => (
                <button key={c.id} onClick={() => setExpandedCouncil(expandedCouncil === c.id ? null : c.id)}
                  className="rounded-xl p-4 text-left transition-all hover:scale-[1.01]"
                  style={{ background: 'var(--glass)', border: `1px solid ${expandedCouncil === c.id ? c.color : 'var(--glass-border)'}` }}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ background: `${c.color}22` }}>
                      {c.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{c.name}</p>
                      <p className="text-[10px]" style={{ color: c.color }}>Council Agent</p>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-sub)' }}>{c.finding}</p>
                  {expandedCouncil === c.id && (
                    <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--glass-border)' }}>
                      {c.id === 'pricing' && (
                        <div className="space-y-2 text-xs" style={{ color: 'var(--text-sub)' }}>
                          <p><strong style={{ color: 'var(--text)' }}>Pricing Architecture:</strong> $12.99/mo (hard paywall converts 12.11% but kills organic growth). Metered freemium with 3 lifetime assessments recommended. Annual plan $89.99/yr (37% discount) — default toggle to annual.</p>
                          <p><strong style={{ color: 'var(--text)' }}>Unit Economics:</strong> LTV $182.82 (14-month avg tenure × $12.99). CAC target $60.94 (3:1 LTV/CAC). Payback period 5.7 months. Gross margin 90%+.</p>
                          <p><strong style={{ color: 'var(--text)' }}>IAP Credits:</strong> $2.99/5, $6.99/8, $14.99/20 credits. 8% of free users buy. Alternative for commitment-averse users.</p>
                          <p><strong style={{ color: 'var(--text)' }}>Personalized Paywalls:</strong> Adding user name + savings-to-date increases conversion 17%. Animated paywalls convert 2.9x vs static.</p>
                        </div>
                      )}
                      {c.id === 'partnerships' && (
                        <div className="space-y-2 text-xs" style={{ color: 'var(--text-sub)' }}>
                          <p><strong style={{ color: 'var(--text)' }}>Affiliate Rates:</strong> Home Depot 2-8%, Lowe&apos;s 2%, Amazon 3%. Home Depot Impact Radius program. Cookie durations 1-30 days.</p>
                          <p><strong style={{ color: 'var(--text)' }}>Lead Gen:</strong> Angi $15-40 CPL to app, $25-150 from contractors. Thumbtack credit system ($10-100/lead). #1 priority: Angi lead partnership = $1.8M/yr at 200K users.</p>
                          <p><strong style={{ color: 'var(--text)' }}>Insurance:</strong> Hippo $25/lead referral. AHS home warranty $18-30 CPA. Lemonade agent referral.</p>
                          <p><strong style={{ color: 'var(--text)' }}>Priority Stack:</strong> 1. Angi lead gen 2. HD affiliate 3. AHS warranty 4. Hippo insurance 5. Amazon affiliate.</p>
                        </div>
                      )}
                      {c.id === 'marketplace' && (
                        <div className="space-y-2 text-xs" style={{ color: 'var(--text-sub)' }}>
                          <p><strong style={{ color: 'var(--text)' }}>Pre-Qualified Lead Value:</strong> $150-300/lead vs Angi&apos;s $15-85. HomeProjectIQ leads include project scope, budget, skill gap assessment, photos — contractors close at 45-60% vs 10-15% on shared Angi leads.</p>
                          <p><strong style={{ color: 'var(--text)' }}>Take Rate:</strong> 15-20% on booked jobs defensible. TaskRabbit charges 22.5%. New entrants viable at 10-15%.</p>
                          <p><strong style={{ color: 'var(--text)' }}>Liquidity Threshold:</strong> 15-30 contractors per metro per category. 100-200 total verified pros per 500K+ population metro. 300-500 job requests/month to maintain contractor engagement.</p>
                          <p><strong style={{ color: 'var(--text)' }}>Adjacent Markets:</strong> P2P tool rental ($1.53B, 18.7% CAGR), materials group buying (10-30% savings), DIY workshops ($65-125/session).</p>
                        </div>
                      )}
                      {c.id === 'data' && (
                        <div className="space-y-2 text-xs" style={{ color: 'var(--text-sub)' }}>
                          <p><strong style={{ color: 'var(--text)' }}>Data Asset Valuation:</strong> 10K users = $500K-2M. 100K users = $9M-30M ($90-300/user). 1M users = $100M-315M. Longitudinal data compounds — Year 5 data worth 3-6x Year 1 per home.</p>
                          <p><strong style={{ color: 'var(--text)' }}>Comparable Sales:</strong> CoreLogic acquired for $6B (3.75x revenue). Verisk $2.9B annual revenue at 55% EBITDA margin. HouseCanary ~$10/report. CAPE Analytics in 15 state rate filings.</p>
                          <p><strong style={{ color: 'var(--text)' }}>Insurance Data:</strong> Verified home health report worth $20-50 to insurers. Reduces expected claims 5-15%. Clean room approach (AWS/LiveRamp) satisfies CCPA/GDPR.</p>
                          <p><strong style={{ color: 'var(--text)' }}>Privacy:</strong> Model on 60-80% user consent (not 100%). K-anonymity k=5+ for external sharing. Zip-code aggregation safe; block-level risky.</p>
                        </div>
                      )}
                      {c.id === 'competitor' && (
                        <div className="space-y-2 text-xs" style={{ color: 'var(--text-sub)' }}>
                          <p><strong style={{ color: 'var(--text)' }}>Market Landscape:</strong> Angi declining from $1.8B peak to $1.1B. Thumbtack growing 27% at $400M. Yelp Home Services = $768M (60% of Yelp&apos;s total). Houzz peaked at $4B valuation, now $1.5-2B.</p>
                          <p><strong style={{ color: 'var(--text)' }}>What Killed Competitors:</strong> Homejoy (discount acquisition trap, $19 first cleans). Handy ($14/transaction at 20% take on $70 jobs). HomeAdvisor (lead sharing destroyed contractor trust).</p>
                          <p><strong style={{ color: 'var(--text)' }}>AI Gap:</strong> No dominant consumer-facing AI home assessment app. Hover ($70M+, B2B only). Kukun ($8M funding, B2B data). This gap is real and unoccupied.</p>
                          <p><strong style={{ color: 'var(--text)' }}>Key Pattern:</strong> SaaS on top of marketplace = durable margin (Houzz Pro). Data moats beat directories. Lead-sharing is a trust destroyer. Transaction value must support take rate.</p>
                        </div>
                      )}
                      {c.id === 'vc' && (
                        <div className="space-y-2 text-xs" style={{ color: 'var(--text-sub)' }}>
                          <p><strong style={{ color: 'var(--text)' }}>Series A Requirements:</strong> $1-5M ARR, 50K+ MAU, 3x YoY growth, LTV/CAC 3:1+, D30 retention &gt;25%. AI premium: can raise at lower ARR with data flywheel thesis.</p>
                          <p><strong style={{ color: 'var(--text)' }}>Key Exits:</strong> Matterport acquired by CoStar for $1.6B (12x revenue, 212% premium). ServiceTitan IPO at $6.3B (7.5x revenue). EliseAI $2.25B valuation (AI proptech).</p>
                          <p><strong style={{ color: 'var(--text)' }}>Strategic Acquirers:</strong> Home Depot ($200-800M), Lowe&apos;s ($150-600M), Zillow ($100-500M), Apple ($200-500M), Hippo ($30-100M), Google ($200-500M).</p>
                          <p><strong style={{ color: 'var(--text)' }}>Per-User Valuation:</strong> Home platform with verified homeowners: $15-30/MAU. Houzz: ~$40-50/MAU at current mark. Angi: $50/annual consumer.</p>
                        </div>
                      )}
                      {c.id === 'growth' && (
                        <div className="space-y-2 text-xs" style={{ color: 'var(--text-sub)' }}>
                          <p><strong style={{ color: 'var(--text)' }}>Realistic Trajectory:</strong> Y1: 8-12K users. Y2: 50-70K. Y3: 175-250K. Houzz took 4 years to reach 12M with $100M+ budget. Thumbtack: 16 years and $699M to reach $400M ARR.</p>
                          <p><strong style={{ color: 'var(--text)' }}>Channel Ranking:</strong> #1 ASO (highest ROI, $0 CPI). #2 Content SEO ($3-12/install, 6-12mo ramp). #3 Tool lending viral loop (40-60% install conversion). #4 TikTok/YouTube (brand building). #5 Referral program (2.35% avg, target 3-5%).</p>
                          <p><strong style={{ color: 'var(--text)' }}>K-Factor:</strong> Realistic Y1: 0.10-0.18. Y2: 0.25-0.38. Y3: 0.35-0.50. Tool lending is the only hard-trigger invitation mechanic.</p>
                          <p><strong style={{ color: 'var(--text)' }}>Retention:</strong> D1 target 30%, D7 15%, D30 10%, D90 6-8%. Push notifications give 2-6x higher 90-day retention. Concentrate in 2-3 metros for density effects.</p>
                        </div>
                      )}
                      {c.id === 'brand' && (
                        <div className="space-y-2 text-xs" style={{ color: 'var(--text-sub)' }}>
                          <p><strong style={{ color: 'var(--text)' }}>Positioning Analogs:</strong> &ldquo;Credit Karma for Home Health&rdquo; ($1.6B revenue from free product). &ldquo;Carfax for Homes&rdquo; ($350-615M revenue). &ldquo;Duolingo for Home Repair&rdquo; (8.8% free-to-paid).</p>
                          <p><strong style={{ color: 'var(--text)' }}>Content Monetization:</strong> Newsletter $40-60 CPM. YouTube RPM $4-11/1K. Podcast mid-roll $25-35 CPM. The Spruce model: SEO &rarr; buying guide &rarr; affiliate click.</p>
                          <p><strong style={{ color: 'var(--text)' }}>Brand Licensing:</strong> Martha Stewart: $1B annual retail from licensing. HGTV HOME by Sherwin-Williams. Good Housekeeping Seal model for &ldquo;HomeProjectIQ Recommended&rdquo; program ($5K-25K/yr per brand).</p>
                          <p><strong style={{ color: 'var(--text)' }}>NPS Target:</strong> Home improvement avg: 16. Consumer app leaders: 50-70. Target NPS 50+ for brand-driven organic growth (40%+ from word-of-mouth).</p>
                        </div>
                      )}
                      {c.id === 'product' && (
                        <div className="space-y-2 text-xs" style={{ color: 'var(--text-sub)' }}>
                          <p><strong style={{ color: 'var(--text)' }}>Paywall Timing:</strong> Never gate on first launch. Trust-first: let user see first AI diagnosis result + savings. Soft gate at 3rd assessment (lifetime, not monthly). Feature-gate WallAnalysis, YardAssessment behind Pro.</p>
                          <p><strong style={{ color: 'var(--text)' }}>Top Revenue Features:</strong> #1 LiveBids (two-sided marketplace). #2 AI Photo Assessment (usage-gated). #3 ProNetwork (B2B subscriptions). #4 Shop Tab affiliates. #5 HomeHealth warranty upsells.</p>
                          <p><strong style={{ color: 'var(--text)' }}>18 Upsell Moments:</strong> DiagnosisView Hire Pro tab, Shop tab affiliate clicks, 3rd assessment paywall, system lifespan &gt;75%, project completion high, SkillTree level 3 badge, 7-day streak, leaderboard tab, and more.</p>
                          <p><strong style={{ color: 'var(--text)' }}>Tier Architecture:</strong> Free (3 assessments, 3 projects, 10 logbook entries) &rarr; Pro $12.99/mo &rarr; Plus $14.99/mo (investors, 15 properties) &rarr; PM Plan $49.99/mo (50 properties).</p>
                        </div>
                      )}
                      {c.id === 'consumer' && (
                        <div className="space-y-2 text-xs" style={{ color: 'var(--text-sub)' }}>
                          <p><strong style={{ color: 'var(--text)' }}>Loss Aversion:</strong> Losses felt 2x more painful than equivalent gains (Kahneman &amp; Tversky). &ldquo;Not maintaining HVAC could cost $8,000&rdquo; converts 20-40% better than &ldquo;Save $8,000 by maintaining.&rdquo;</p>
                          <p><strong style={{ color: 'var(--text)' }}>Emergency Premium:</strong> Consumers accept 2-3x price premiums under urgency. Mobile emergency searches convert 60-80% higher. Emergency Mode paywall ($4.99 single assessment) captures high-intent users.</p>
                          <p><strong style={{ color: 'var(--text)' }}>Spending Reality:</strong> 83% faced unexpected repairs in 2024. 46% spent $5K+ on single repair. 58% have nothing saved. Avg total spend: $12,050/yr. Home inspection anchor: $296-450 (makes $12.99/mo feel cheap).</p>
                          <p><strong style={{ color: 'var(--text)' }}>Two-Phase Emotional Funnel:</strong> Acquisition = fear/loss framing. Retention = pride/achievement framing. Acquisition message: &ldquo;Don&apos;t let deferred maintenance cost $8,000.&rdquo; Retention: &ldquo;You&apos;ve saved $1,840 this year.&rdquo;</p>
                        </div>
                      )}
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Council Consensus */}
            <div className="rounded-xl p-5" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(236,72,153,0.1))', border: '1px solid var(--glass-border)' }}>
              <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text)' }}>Council Consensus: The Strategic Moat</h3>
              <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-sub)' }}>
                All 10 agents converge on one insight: <strong style={{ color: 'var(--accent)' }}>HomeProjectIQ enters the marketplace with project-level intelligence no competitor has.</strong> Every Angi lead is a cold introduction. Every HomeProjectIQ lead is a warm handoff with a complete project brief — scope, budget, skill gap, photos, and materials list. This asymmetry is worth $150-300/lead to contractors (vs $15-85 on Angi) and creates a structurally differentiated marketplace from day one.
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                The compounding data moat is the second consensus: verified maintenance history becomes more valuable with time. Year 5 data on the same home is worth 3-6x Year 1 data because behavioral patterns become actuarially meaningful. No competitor can buy their way into this — it takes years of user trust and data accumulation.
              </p>
            </div>
          </div>
        )}

        {/* ═══════════ REVENUE TAB ═══════════ */}
        {tab === 'Revenue' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--text)', fontFamily: 'var(--font-heading)' }}>Revenue Architecture</h2>
                <p className="text-sm" style={{ color: 'var(--text-dim)' }}>14 council-validated revenue streams across 5 categories</p>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((y) => (
                  <button key={y} onClick={() => setYearView(y as 1 | 2 | 3 | 4 | 5)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                    style={{ background: yearView === y ? 'var(--accent)' : 'var(--glass)', color: yearView === y ? 'white' : 'var(--text-dim)' }}>
                    Y{y}
                  </button>
                ))}
              </div>
            </div>

            {/* Tier Filters */}
            <div className="flex gap-2 flex-wrap">
              {[
                { v: 0, label: 'All Streams', count: STREAMS.length },
                { v: 1, label: 'Tier 1 — Revenue Engines', count: STREAMS.filter((s) => s.tier === 1).length },
                { v: 2, label: 'Tier 2 — Growth Layer', count: STREAMS.filter((s) => s.tier === 2).length },
                { v: 3, label: 'Tier 3 — Scale & Adjacent', count: STREAMS.filter((s) => s.tier === 3).length },
              ].map((f) => (
                <button key={f.v} onClick={() => setTierFilter(f.v)}
                  className="px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all"
                  style={{ background: tierFilter === f.v ? 'var(--accent)' : 'var(--glass)', color: tierFilter === f.v ? 'white' : 'var(--text-dim)', border: '1px solid var(--glass-border)' }}>
                  {f.label} ({f.count})
                </button>
              ))}
            </div>

            {/* Total Revenue */}
            <div className="rounded-xl p-4 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, var(--accent), var(--emerald))', }}>
              <div>
                <p className="text-xs font-semibold text-white/70">Year {yearView} Total Revenue</p>
                <p className="text-3xl font-bold text-white">
                  <AnimatedNumber value={totalRev} prefix="$" />
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/70">{filteredStreams.length} streams</p>
                <p className="text-sm font-bold text-white">{filteredStreams.filter((s) => s[yearKey] > 0).length} active in Y{yearView}</p>
              </div>
            </div>

            {/* Revenue Bar Chart */}
            <BarChart
              data={filteredStreams.filter((s) => s[yearKey] > 0).sort((a, b) => b[yearKey] - a[yearKey]).map((s) => ({
                label: s.icon,
                value: s[yearKey],
                color: s.tier === 1 ? '#6366F1' : s.tier === 2 ? '#10B981' : '#F59E0B',
              }))}
              maxVal={maxStreamRev}
            />

            {/* Stream Cards */}
            <div className="space-y-3">
              {filteredStreams.sort((a, b) => b[yearKey] - a[yearKey]).map((s) => (
                <button key={s.id} onClick={() => setExpandedStream(expandedStream === s.id ? null : s.id)}
                  className="w-full rounded-xl p-4 text-left transition-all hover:scale-[1.005]"
                  style={{ background: 'var(--glass)', border: `1px solid ${expandedStream === s.id ? (s.tier === 1 ? '#6366F1' : s.tier === 2 ? '#10B981' : '#F59E0B') : 'var(--glass-border)'}` }}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{s.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-bold truncate" style={{ color: 'var(--text)' }}>{s.name}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold shrink-0"
                          style={{ background: s.tier === 1 ? '#6366F122' : s.tier === 2 ? '#10B98122' : '#F59E0B22', color: s.tier === 1 ? '#6366F1' : s.tier === 2 ? '#10B981' : '#F59E0B' }}>
                          Tier {s.tier}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold shrink-0"
                          style={{ background: s.confidence === 'High' ? '#10B98122' : s.confidence === 'Medium' ? '#F59E0B22' : '#EF444422', color: s.confidence === 'High' ? '#10B981' : s.confidence === 'Medium' ? '#F59E0B' : '#EF4444' }}>
                          {s.confidence}
                        </span>
                      </div>
                      <p className="text-[11px]" style={{ color: 'var(--text-dim)' }}>{s.pricing}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold" style={{ color: 'var(--text)' }}>
                        ${s[yearKey] >= 1000000 ? `${(s[yearKey] / 1000000).toFixed(1)}M` : `${(s[yearKey] / 1000).toFixed(0)}K`}
                      </p>
                      <p className="text-[9px]" style={{ color: 'var(--text-dim)' }}>{s.margin}% margin</p>
                    </div>
                  </div>
                  {expandedStream === s.id && (
                    <div className="mt-3 pt-3 border-t space-y-3" style={{ borderColor: 'var(--glass-border)' }}>
                      <p className="text-xs" style={{ color: 'var(--text-sub)' }}>{s.insight}</p>
                      <div className="grid grid-cols-5 gap-2">
                        {[1, 2, 3, 4, 5].map((y) => {
                          const k = `y${y}` as 'y1' | 'y2' | 'y3' | 'y4' | 'y5';
                          return (
                            <div key={y} className="rounded-lg p-2 text-center" style={{ background: 'var(--bg-deep)' }}>
                              <p className="text-[9px] font-bold" style={{ color: 'var(--text-dim)' }}>Y{y}</p>
                              <p className="text-xs font-bold" style={{ color: y === yearView ? 'var(--accent)' : 'var(--text)' }}>
                                ${s[k] >= 1000000 ? `${(s[k] / 1000000).toFixed(1)}M` : s[k] >= 1000 ? `${(s[k] / 1000).toFixed(0)}K` : s[k]}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        {s.council.map((cid) => {
                          const agent = COUNCIL.find((a) => a.id === cid);
                          return agent ? (
                            <span key={cid} className="text-[9px] px-2 py-0.5 rounded-full font-semibold" style={{ background: `${agent.color}22`, color: agent.color }}>
                              {agent.icon} {agent.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                      <p className="text-[10px] italic" style={{ color: 'var(--text-dim)' }}>{s.assumptions}</p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════ FINANCIAL TAB ═══════════ */}
        {tab === 'Financial' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold" style={{ color: 'var(--text)', fontFamily: 'var(--font-heading)' }}>5-Year Financial Model</h2>

            {/* Summary Table */}
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--glass-border)' }}>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: 'var(--glass)' }}>
                    <th className="p-3 text-left font-bold" style={{ color: 'var(--text)' }}>Metric</th>
                    {GROWTH_MODEL.map((g) => (
                      <th key={g.year} className="p-3 text-right font-bold" style={{ color: 'var(--accent)' }}>{g.year}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Total Users', key: 'users', fmt: (v: number) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : `${(v / 1000).toFixed(0)}K` },
                    { label: 'Monthly Active', key: 'mau', fmt: (v: number) => v >= 1000000 ? `${(v / 1000000).toFixed(0)}M` : `${(v / 1000).toFixed(1)}K` },
                    { label: 'Paid Subscribers', key: 'paid', fmt: (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}K` : `${v}` },
                    { label: 'Revenue', key: 'revenue', fmt: (v: number) => v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : `$${(v / 1000).toFixed(0)}K` },
                    { label: 'Blended CAC', key: 'cac', fmt: (v: number) => `$${v}` },
                    { label: 'K-Factor', key: 'kFactor', fmt: (v: number) => v.toFixed(2) },
                  ].map((row) => (
                    <tr key={row.label} style={{ borderTop: '1px solid var(--glass-border)' }}>
                      <td className="p-3 font-semibold" style={{ color: 'var(--text)' }}>{row.label}</td>
                      {GROWTH_MODEL.map((g) => (
                        <td key={g.year} className="p-3 text-right" style={{ color: 'var(--text-sub)' }}>
                          {row.fmt((g as unknown as Record<string, number>)[row.key])}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr style={{ borderTop: '1px solid var(--glass-border)' }}>
                    <td className="p-3 font-semibold" style={{ color: 'var(--text)' }}>Growth Channels</td>
                    {GROWTH_MODEL.map((g) => (
                      <td key={g.year} className="p-3 text-right text-[10px]" style={{ color: 'var(--text-dim)' }}>{g.channels}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Revenue by Year Visualization */}
            <div className="rounded-xl p-5" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
              <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text)' }}>Revenue Trajectory</h3>
              <div className="flex items-end gap-4 h-48">
                {GROWTH_MODEL.map((g) => {
                  const maxRev = GROWTH_MODEL[GROWTH_MODEL.length - 1].revenue;
                  const pct = (g.revenue / maxRev) * 100;
                  return (
                    <div key={g.year} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] font-bold" style={{ color: 'var(--accent)' }}>
                        {g.revenue >= 1000000 ? `$${(g.revenue / 1000000).toFixed(1)}M` : `$${(g.revenue / 1000).toFixed(0)}K`}
                      </span>
                      <div className="w-full rounded-t-lg transition-all duration-1000"
                        style={{ height: `${Math.max(pct, 2)}%`, background: 'linear-gradient(to top, var(--accent), var(--emerald))' }} />
                      <span className="text-xs font-bold" style={{ color: 'var(--text-dim)' }}>{g.year}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Unit Economics */}
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: 'Unit Economics', items: [
                  { label: 'LTV', value: '$182.82', sub: '14-month avg tenure × $12.99' },
                  { label: 'CAC Target', value: '$60.94', sub: '3:1 LTV/CAC ratio' },
                  { label: 'Payback', value: '5.7 months', sub: 'Below 18-month threshold' },
                  { label: 'Gross Margin', value: '90%+', sub: 'Software economics' },
                ]},
                { title: 'Subscription Metrics', items: [
                  { label: 'Monthly Price', value: '$12.99', sub: 'Pricing Psychologist optimal' },
                  { label: 'Annual Price', value: '$89.99/yr', sub: '37% discount, default toggle' },
                  { label: 'Free-to-Paid', value: '5-8%', sub: 'Metered paywall model' },
                  { label: 'Annual Mix', value: '70%', sub: '2.4x more profitable than monthly' },
                ]},
                { title: 'Marketplace Metrics', items: [
                  { label: 'Lead Price', value: '$150-300', sub: '3x Angi, 2x better close rate' },
                  { label: 'Contractor Sub', value: '$99-199/mo', sub: 'Featured placement' },
                  { label: 'Take Rate', value: '15-20%', sub: 'Booked job commission' },
                  { label: 'Contractor CAC', value: '$150-400', sub: 'Onboarding + verification' },
                ]},
              ].map((section) => (
                <div key={section.title} className="rounded-xl p-4" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
                  <h3 className="text-xs font-bold mb-3" style={{ color: 'var(--text)' }}>{section.title}</h3>
                  <div className="space-y-2.5">
                    {section.items.map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div>
                          <p className="text-[11px] font-semibold" style={{ color: 'var(--text)' }}>{item.label}</p>
                          <p className="text-[9px]" style={{ color: 'var(--text-dim)' }}>{item.sub}</p>
                        </div>
                        <p className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Tiers */}
            <div>
              <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text)' }}>Pricing Architecture (Council-Optimized)</h3>
              <div className="grid md:grid-cols-4 gap-3">
                {[
                  { name: 'Free', price: '$0', features: ['3 AI assessments (lifetime)', 'Home Health Score (read-only)', '3 active projects', '10 logbook entries', 'Basic seasonal reminders'], color: 'var(--text-dim)' },
                  { name: 'Pro', price: '$12.99/mo', features: ['Unlimited AI assessments', 'Wall + Yard Analysis', 'Full Home Health + photo tags', 'LiveBids contractor matching', 'SkillTree levels 4-5', 'Multi-property (5)'], color: 'var(--accent)' },
                  { name: 'Plus', price: '$14.99/mo', features: ['Everything in Pro', 'Up to 15 properties', 'Monthly PDF report', 'Priority contractor matching', 'Comparative property ranking'], color: 'var(--emerald)' },
                  { name: 'PM Plan', price: '$49.99/mo', features: ['Everything in Plus', 'Up to 50 properties', 'Team access (3 users)', 'API access', 'White-label reports'], color: 'var(--gold)' },
                ].map((tier, i) => (
                  <div key={tier.name} className="rounded-xl p-4" style={{ background: 'var(--glass)', border: `1px solid ${i === 1 ? tier.color : 'var(--glass-border)'}` }}>
                    {i === 1 && <p className="text-[9px] font-bold uppercase mb-1" style={{ color: tier.color }}>Most Popular</p>}
                    <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{tier.name}</p>
                    <p className="text-lg font-bold mb-2" style={{ color: tier.color }}>{tier.price}</p>
                    <div className="space-y-1">
                      {tier.features.map((f) => (
                        <p key={f} className="text-[10px] flex items-start gap-1" style={{ color: 'var(--text-sub)' }}>
                          <span style={{ color: tier.color }}>+</span> {f}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ COMPETITIVE TAB ═══════════ */}
        {tab === 'Competitive' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold" style={{ color: 'var(--text)', fontFamily: 'var(--font-heading)' }}>Competitive Landscape</h2>
            <p className="text-sm" style={{ color: 'var(--text-dim)' }}>Research by Competitor Analyst. No consumer AI home assessment app exists at scale.</p>

            <div className="space-y-3">
              {COMPETITORS.map((c) => (
                <div key={c.name} className="rounded-xl p-4" style={{ background: c.name === 'HomeProjectIQ' ? 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(16,185,129,0.1))' : 'var(--glass)', border: `1px solid ${c.name === 'HomeProjectIQ' ? 'var(--accent)' : 'var(--glass-border)'}` }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold" style={{ color: 'var(--text)' }}>{c.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                        style={{ background: c.trend === 'up' ? '#10B98122' : c.trend === 'down' ? '#EF444422' : '#F59E0B22', color: c.trend === 'up' ? '#10B981' : c.trend === 'down' ? '#EF4444' : '#F59E0B' }}>
                        {c.yoy} YoY
                      </span>
                    </div>
                    <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{c.revenue}</span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-2 text-[11px]">
                    <div><span className="font-semibold" style={{ color: 'var(--text-dim)' }}>Model:</span> <span style={{ color: 'var(--text-sub)' }}>{c.model}</span></div>
                    <div><span className="font-semibold" style={{ color: 'var(--text-dim)' }}>Users:</span> <span style={{ color: 'var(--text-sub)' }}>{c.users}</span></div>
                    <div><span className="font-semibold" style={{ color: 'var(--text-dim)' }}>Weakness:</span> <span style={{ color: 'var(--text-sub)' }}>{c.weakness}</span></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Lessons from Failures */}
            <div className="rounded-xl p-5" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
              <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text)' }}>What Killed Competitors</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { name: 'Homejoy', cause: 'Discount acquisition trap ($19 first cleans). 25% retention vs 70-80% healthy. Worker bypass after intro.', lesson: 'Never discount-acquire homeowners. Value must be ongoing.' },
                  { name: 'Handy', cause: '$14 per transaction at 20% take on $70 avg jobs. Demand outstripped supply. Misclassification lawsuits.', lesson: 'Transaction value must support take rate. At $70 AOV, 20% = death.' },
                  { name: 'HomeAdvisor', cause: 'Lead sharing (5 contractors per lead) destroyed trust. Effective CAC $250-425+ per booked job.', lesson: 'Lead-sharing creates adversarial supply dynamics.' },
                  { name: 'Porch', cause: 'Became actual insurance carrier. Underwriting losses from Hurricane Ian devastated balance sheet. Stock down 90%.', lesson: 'Data businesses should sell data, not take balance-sheet risk.' },
                ].map((f) => (
                  <div key={f.name} className="rounded-lg p-3" style={{ background: 'var(--bg-deep)' }}>
                    <p className="text-xs font-bold mb-1" style={{ color: '#EF4444' }}>{f.name}</p>
                    <p className="text-[10px] mb-1.5" style={{ color: 'var(--text-sub)' }}>{f.cause}</p>
                    <p className="text-[10px] font-semibold" style={{ color: 'var(--emerald)' }}>Lesson: {f.lesson}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* HomeProjectIQ Advantage */}
            <div className="rounded-xl p-5" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(99,102,241,0.1))', border: '1px solid var(--emerald)' }}>
              <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text)' }}>HomeProjectIQ&apos;s Structural Advantage</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr>
                      <th className="p-2 text-left" style={{ color: 'var(--text-dim)' }}>Factor</th>
                      <th className="p-2 text-center" style={{ color: '#EF4444' }}>Angi/Thumbtack Lead</th>
                      <th className="p-2 text-center" style={{ color: '#10B981' }}>HomeProjectIQ Lead</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Project scope known', 'No', 'Yes — AI assessment complete'],
                      ['Budget established', 'No', 'Yes — AI estimated cost'],
                      ['Skill gap confirmed', 'No', 'Yes — DIY vs hire decided'],
                      ['Photo documentation', 'Sometimes', 'Always'],
                      ['Materials identified', 'No', 'Yes — full scope'],
                      ['Close rate', '10-15%', '45-60%'],
                      ['Effective contractor CAC', '$250-425+', '$150-300'],
                    ].map(([factor, angi, hpiq]) => (
                      <tr key={factor} style={{ borderTop: '1px solid var(--glass-border)' }}>
                        <td className="p-2 font-semibold" style={{ color: 'var(--text)' }}>{factor}</td>
                        <td className="p-2 text-center" style={{ color: 'var(--text-dim)' }}>{angi}</td>
                        <td className="p-2 text-center font-semibold" style={{ color: '#10B981' }}>{hpiq}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ GROWTH TAB ═══════════ */}
        {tab === 'Growth' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold" style={{ color: 'var(--text)', fontFamily: 'var(--font-heading)' }}>Growth Engine</h2>

            {/* User Growth Trajectory */}
            <div className="rounded-xl p-5" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
              <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text)' }}>User Growth (Conservative Estimates)</h3>
              <div className="flex items-end gap-4 h-40">
                {GROWTH_MODEL.map((g) => {
                  const maxU = GROWTH_MODEL[GROWTH_MODEL.length - 1].users;
                  const pct = (g.users / maxU) * 100;
                  return (
                    <div key={g.year} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] font-bold" style={{ color: 'var(--text)' }}>
                        {g.users >= 1000000 ? `${(g.users / 1000000).toFixed(1)}M` : `${(g.users / 1000).toFixed(0)}K`}
                      </span>
                      <div className="w-full rounded-t-lg transition-all duration-1000"
                        style={{ height: `${Math.max(pct, 2)}%`, background: 'linear-gradient(to top, #06B6D4, #3B82F6)' }} />
                      <span className="text-xs font-bold" style={{ color: 'var(--text-dim)' }}>{g.year}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Channel Ranking */}
            <div className="rounded-xl p-5" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
              <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text)' }}>Acquisition Channels Ranked by ROI</h3>
              <div className="space-y-2.5">
                {[
                  { rank: 1, name: 'App Store Optimization', cpi: '$0', roi: 'Highest', tier: 'Tier 1', note: '12% avg download increase. Zero marginal cost. Do this first.' },
                  { rank: 2, name: 'Content SEO (DIY Queries)', cpi: '$3-12', roi: 'Very High', tier: 'Tier 1', note: '6-12 month ramp. r/HomeImprovement = 4.5M members. Own the "DIY vs hire" query.' },
                  { rank: 3, name: 'Tool Lending Viral Loop', cpi: '$0', roi: 'Very High', tier: 'Tier 1', note: 'Only hard-trigger invite in the app. 40-60% install conversion. Requires local density.' },
                  { rank: 4, name: 'TikTok/YouTube/Reels', cpi: '$0-5', roi: 'High', tier: 'Tier 2', note: 'DIY content massive. Top accounts 1.7M followers. 1M views × 1% = 10K installs. 6-18mo to produce.' },
                  { rank: 5, name: 'Dual-Sided Referral Program', cpi: '$15-30', roi: 'High', tier: 'Tier 2', note: 'Dual-sided drives 29% more participation. "Give 1mo free, get 1mo free" converts 2.6x better.' },
                  { rank: 6, name: 'Real Estate Partnerships', cpi: '$5-20', roi: 'High', tier: 'Tier 2', note: '5.1M homes sold/yr. New homeowners = highest-intent segment. "Free 3-month checkup" at closing.' },
                  { rank: 7, name: 'Contractor-Driven (B2B2C)', cpi: '$20-50', roi: 'Medium', tier: 'Tier 3', note: '1K contractors × 10 invites = 10K homeowners. 12-18 month build timeline.' },
                  { rank: 8, name: 'Retail Partnership (HD/Lowe\'s)', cpi: 'N/A', roi: 'Medium', tier: 'Tier 3', note: 'Aspirational Y3+. Both building own AI tools. Pursue as BD relationship, not primary channel.' },
                ].map((ch) => (
                  <div key={ch.rank} className="flex items-center gap-3 rounded-lg p-3" style={{ background: 'var(--bg-deep)' }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: ch.rank <= 3 ? '#10B98133' : ch.rank <= 6 ? '#3B82F633' : '#F59E0B33', color: ch.rank <= 3 ? '#10B981' : ch.rank <= 6 ? '#3B82F6' : '#F59E0B' }}>
                      {ch.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-bold" style={{ color: 'var(--text)' }}>{ch.name}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: 'var(--glass)', color: 'var(--text-dim)' }}>{ch.tier}</span>
                      </div>
                      <p className="text-[10px]" style={{ color: 'var(--text-dim)' }}>{ch.note}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold" style={{ color: 'var(--accent)' }}>{ch.cpi}</p>
                      <p className="text-[9px]" style={{ color: 'var(--text-dim)' }}>CPI</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* K-Factor + Retention */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-xl p-4" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
                <h3 className="text-xs font-bold mb-3" style={{ color: 'var(--text)' }}>Viral Coefficient (K-Factor)</h3>
                <div className="space-y-3">
                  {[
                    { year: 'Y1', k: 0.15, sources: 'Tool lending (0.08), Leaderboard sharing (0.05), Pro referrals (0.02)' },
                    { year: 'Y2', k: 0.30, sources: 'Tool lending (0.15), Referral program (0.08), Sharing (0.07)' },
                    { year: 'Y3', k: 0.40, sources: 'Dense local networks (0.18), Referrals (0.12), Social (0.10)' },
                  ].map((v) => (
                    <div key={v.year}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold" style={{ color: 'var(--text)' }}>{v.year}: K = {v.k}</span>
                        <MiniRing pct={v.k * 100} size={28} color={v.k >= 0.3 ? '#10B981' : '#F59E0B'} />
                      </div>
                      <p className="text-[9px]" style={{ color: 'var(--text-dim)' }}>{v.sources}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[9px] mt-3 italic" style={{ color: 'var(--text-dim)' }}>K &gt; 1.0 = viral. K 0.4-0.7 = outstanding for utility app. HomeProjectIQ target: 0.40 by Y3.</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
                <h3 className="text-xs font-bold mb-3" style={{ color: 'var(--text)' }}>Retention Targets</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Day 1', target: '30%', industry: '25-26%', color: '#10B981' },
                    { label: 'Day 7', target: '15%', industry: '11-13%', color: '#3B82F6' },
                    { label: 'Day 30', target: '10%', industry: '6-7%', color: '#F59E0B' },
                    { label: 'Day 90', target: '6-8%', industry: '~3%', color: '#EF4444' },
                  ].map((r) => (
                    <div key={r.label} className="flex items-center justify-between">
                      <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{r.label}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>Industry: {r.industry}</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${r.color}22`, color: r.color }}>{r.target}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[9px] mt-3 italic" style={{ color: 'var(--text-dim)' }}>Push notifications give 2-6x higher 90-day retention. Maintenance reminders are the #1 retention hook.</p>
              </div>
            </div>

            {/* Target Segments */}
            <div>
              <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text)' }}>Target Demographics</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {SEGMENTS.map((s) => (
                  <div key={s.name} className="rounded-xl p-4" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{s.icon}</span>
                      <div>
                        <p className="text-xs font-bold" style={{ color: 'var(--text)' }}>{s.name}</p>
                        <p className="text-[10px]" style={{ color: 'var(--text-dim)' }}>Age {s.age} &middot; {s.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: '#10B98122', color: '#10B981' }}>WTP: {s.wtp}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-deep)', color: 'var(--text-dim)' }}>Trigger: {s.trigger}</span>
                    </div>
                    <p className="text-[10px]" style={{ color: 'var(--text-sub)' }}>{s.insight}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ VALUATION TAB ═══════════ */}
        {tab === 'Valuation' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold" style={{ color: 'var(--text)', fontFamily: 'var(--font-heading)' }}>Valuation & Exit Scenarios</h2>
            <p className="text-sm" style={{ color: 'var(--text-dim)' }}>Research by VC &amp; Exit Analyst. AI premium = 3-5x over non-AI at same revenue.</p>

            {/* Valuation Trajectory */}
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--glass-border)' }}>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: 'var(--glass)' }}>
                    {['Stage', 'ARR', 'MAU', 'Valuation', 'Multiple', 'Basis'].map((h) => (
                      <th key={h} className="p-3 text-left font-bold" style={{ color: 'var(--text)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {VALUATION.map((v, i) => (
                    <tr key={v.stage} style={{ borderTop: '1px solid var(--glass-border)', background: i === VALUATION.length - 1 ? 'rgba(99,102,241,0.08)' : 'transparent' }}>
                      <td className="p-3 font-bold" style={{ color: 'var(--text)' }}>{v.stage}</td>
                      <td className="p-3" style={{ color: 'var(--text-sub)' }}>{v.arr}</td>
                      <td className="p-3" style={{ color: 'var(--text-sub)' }}>{v.mau}</td>
                      <td className="p-3 font-bold" style={{ color: 'var(--accent)' }}>{v.valuation}</td>
                      <td className="p-3" style={{ color: 'var(--text-dim)' }}>{v.multiple}</td>
                      <td className="p-3 text-[10px]" style={{ color: 'var(--text-dim)' }}>{v.basis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Strategic Acquirers */}
            <div>
              <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text)' }}>Strategic Acquirers</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {ACQUIRERS.map((a) => (
                  <button key={a.name} onClick={() => setExpandedAcquirer(expandedAcquirer === a.name ? null : a.name)}
                    className="rounded-xl p-4 text-left transition-all hover:scale-[1.01]"
                    style={{ background: 'var(--glass)', border: `1px solid ${expandedAcquirer === a.name ? 'var(--accent)' : 'var(--glass-border)'}` }}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{a.logo}</span>
                      <div>
                        <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{a.name}</p>
                        <p className="text-xs font-bold" style={{ color: 'var(--accent)' }}>{a.range}</p>
                      </div>
                    </div>
                    <p className="text-[11px]" style={{ color: 'var(--text-sub)' }}>{a.thesis}</p>
                    {expandedAcquirer === a.name && (
                      <div className="mt-2 pt-2 border-t" style={{ borderColor: 'var(--glass-border)' }}>
                        <p className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
                          <strong style={{ color: 'var(--text)' }}>Trigger:</strong> {a.trigger}
                        </p>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Comparable Exits */}
            <div className="rounded-xl p-5" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
              <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text)' }}>Comparable Exits &amp; Valuations</h3>
              <div className="space-y-2.5">
                {[
                  { name: 'CoStar → Matterport (2024)', value: '$1.6B enterprise value', multiple: '12x revenue', note: '212% premium. AI 3D property scanning. Most relevant AI proptech exit.' },
                  { name: 'ServiceTitan IPO (2024)', value: '$6.3B valuation', multiple: '7.5x revenue', note: '$685M revenue. Home services contractor SaaS. Re-rated to 11-12x.' },
                  { name: 'EliseAI Series E (2025)', value: '$2.25B valuation', multiple: '~15-20x revenue', note: 'a16z led. AI for residential leasing. Latest AI proptech unicorn.' },
                  { name: 'Thumbtack (2021)', value: '$3.2B valuation', multiple: '~8x revenue', note: '$275M Series H. QIA led. Paper valuation, no IPO yet.' },
                  { name: 'Angi/HomeAdvisor (2017)', value: '$4.2B combined', multiple: '~4x revenue', note: 'IAC reverse-IPO. Peak $7B. Now sub-$500M. Cautionary tale.' },
                  { name: 'Houzz (2017)', value: '$4B peak valuation', multiple: '~15-20x revenue', note: '$614M raised. Current mark $1.5-2B. Community + marketplace.' },
                ].map((e) => (
                  <div key={e.name} className="flex items-center gap-3 rounded-lg p-3" style={{ background: 'var(--bg-deep)' }}>
                    <div className="flex-1">
                      <p className="text-xs font-bold" style={{ color: 'var(--text)' }}>{e.name}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-dim)' }}>{e.note}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold" style={{ color: 'var(--accent)' }}>{e.value}</p>
                      <p className="text-[9px]" style={{ color: 'var(--text-dim)' }}>{e.multiple}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Multiple Benchmarks */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-xl p-4" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
                <h3 className="text-xs font-bold mb-3" style={{ color: 'var(--text)' }}>Revenue Multiples by Model (2025)</h3>
                {[
                  { model: 'AI / Data Company', range: '10-20x revenue', note: 'Vertical AI with data moat' },
                  { model: 'Consumer Subscription', range: '4-7x ARR', note: 'At Series A/B stage' },
                  { model: 'Marketplace / Platform', range: '2.3x revenue', note: 'Median public (vs 5.6x historical)' },
                  { model: 'Lead Generation', range: '1.5-3x revenue', note: '3-5x with proprietary data' },
                ].map((m) => (
                  <div key={m.model} className="flex items-center justify-between py-2" style={{ borderTop: '1px solid var(--glass-border)' }}>
                    <div>
                      <p className="text-[11px] font-semibold" style={{ color: 'var(--text)' }}>{m.model}</p>
                      <p className="text-[9px]" style={{ color: 'var(--text-dim)' }}>{m.note}</p>
                    </div>
                    <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>{m.range}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-xl p-4" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
                <h3 className="text-xs font-bold mb-3" style={{ color: 'var(--text)' }}>Series A Requirements (2025)</h3>
                {[
                  { metric: 'ARR', threshold: '$1M-5M', target: '$4.2M median' },
                  { metric: 'MAU', threshold: '50K-250K', target: 'Top-tier: 250K+' },
                  { metric: 'Revenue Growth', threshold: '3x YoY minimum', target: '4x for AI premium' },
                  { metric: 'LTV/CAC', threshold: '3:1 minimum', target: '5:1+ target' },
                  { metric: 'D30 Retention', threshold: '>25%', target: '>15% for home apps' },
                  { metric: 'Check Size', threshold: '$8-20M', target: '$15-30M AI premium' },
                ].map((r) => (
                  <div key={r.metric} className="flex items-center justify-between py-2" style={{ borderTop: '1px solid var(--glass-border)' }}>
                    <span className="text-[11px] font-semibold" style={{ color: 'var(--text)' }}>{r.metric}</span>
                    <div className="text-right">
                      <p className="text-[11px] font-bold" style={{ color: 'var(--accent)' }}>{r.threshold}</p>
                      <p className="text-[9px]" style={{ color: 'var(--text-dim)' }}>{r.target}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ DATA MOAT TAB ═══════════ */}
        {tab === 'Data Moat' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold" style={{ color: 'var(--text)', fontFamily: 'var(--font-heading)' }}>Data Moat &amp; Asset Valuation</h2>
            <p className="text-sm" style={{ color: 'var(--text-dim)' }}>Research by Data Economist. Longitudinal home data compounds in value — Year 5 data worth 3-6x Year 1.</p>

            {/* Data Asset Value by Scale */}
            <div className="space-y-4">
              {DATA_MOAT.map((d, i) => (
                <div key={d.users} className="rounded-xl p-5" style={{ background: 'var(--glass)', border: `1px solid ${i === DATA_MOAT.length - 1 ? 'var(--accent)' : 'var(--glass-border)'}` }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <MiniRing pct={((i + 1) / DATA_MOAT.length) * 100} size={48} color={i === 0 ? '#F59E0B' : i === 1 ? '#3B82F6' : '#10B981'} />
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold" style={{ color: 'var(--text)' }}>{d.users}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{d.users} Users</p>
                        <p className="text-[10px]" style={{ color: 'var(--text-dim)' }}>{d.timeline}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold" style={{ color: 'var(--accent)' }}>{d.dataValue}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-dim)' }}>{d.perUser}/user</p>
                    </div>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-sub)' }}>{d.products}</p>
                </div>
              ))}
            </div>

            {/* Longitudinal Compounding */}
            <div className="rounded-xl p-5" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(59,130,246,0.1))', border: '1px solid var(--glass-border)' }}>
              <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text)' }}>The Compounding Effect</h3>
              <div className="space-y-3">
                {[
                  { year: 'Year 1', value: '$20-50/home', desc: 'System ages, contractor bids, user-reported condition. Snapshot value for insurers.' },
                  { year: 'Year 3', value: '$50-150/home', desc: 'Maintenance event history, multiple bids showing market pricing, demonstrated owner behavior patterns.' },
                  { year: 'Year 5+', value: '$100-300/home', desc: 'Actual failure/replacement events with predictive accuracy. Back-testable actuarial data no competitor has.' },
                ].map((y) => (
                  <div key={y.year} className="flex items-start gap-3">
                    <span className="text-xs font-bold px-2 py-1 rounded-lg shrink-0" style={{ background: 'var(--accent)', color: 'white' }}>{y.year}</span>
                    <div>
                      <span className="text-xs font-bold" style={{ color: 'var(--text)' }}>{y.value} — </span>
                      <span className="text-xs" style={{ color: 'var(--text-sub)' }}>{y.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] mt-3 italic" style={{ color: 'var(--text-dim)' }}>
                A 5-year dataset on 100K homes with verified maintenance &gt; a 1-year dataset on 500K homes. Time-in-market is as important as user count.
              </p>
            </div>

            {/* Data Products & Buyers */}
            <div className="rounded-xl p-5" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
              <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text)' }}>Data Products &amp; Buyers</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr style={{ background: 'var(--bg-deep)' }}>
                      {['Product', 'Price/Unit', 'Buyer', 'Annual Potential (100K users)'].map((h) => (
                        <th key={h} className="p-2.5 text-left font-bold" style={{ color: 'var(--text)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Insurance Property API', '$1-3/call', 'P&C carriers (policy binding)', '$500K-2M'],
                      ['Home Health Report', '$20-50/report', 'Insurers (new policy)', '$2M-5M'],
                      ['Maintenance Data License', '$15-40/home/yr', 'Insurers, warranty cos', '$1.5M-4M'],
                      ['OEM Failure Dataset', '$1-5/record', 'Carrier, Trane, Rheem, GE', '$500K-2M'],
                      ['Regional Demand Forecast', '$5K-50K/metro/yr', 'HVAC/plumbing chains', '$250K-1M'],
                      ['Retailer Trend Feed', '$200K-1M/yr flat', 'Home Depot, Lowe\'s', '$200K-1M'],
                      ['Warranty Underwriting Score', '$5-25/home/yr', 'AHS, Choice, First American', '$500K-2.5M'],
                    ].map(([product, price, buyer, potential]) => (
                      <tr key={product} style={{ borderTop: '1px solid var(--glass-border)' }}>
                        <td className="p-2.5 font-semibold" style={{ color: 'var(--text)' }}>{product}</td>
                        <td className="p-2.5" style={{ color: 'var(--accent)' }}>{price}</td>
                        <td className="p-2.5" style={{ color: 'var(--text-sub)' }}>{buyer}</td>
                        <td className="p-2.5 font-bold" style={{ color: 'var(--text)' }}>{potential}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Comparable Data Companies */}
            <div className="grid md:grid-cols-3 gap-3">
              {[
                { name: 'Verisk', revenue: '$2.9B/yr', asset: '32B insurance transactions', note: '55% EBITDA margin. Per-policy subscription. Took decades to build.' },
                { name: 'CoreLogic/Cotality', revenue: '$1.6B/yr', asset: '4.5B property data points', note: 'Acquired for $6B (3.75x revenue). API at $1.30-$11.50/call.' },
                { name: 'ATTOM', revenue: 'Private', asset: '158M properties, 9K attributes', note: 'API at ~$0.10/report. Bulk licenses $50K-$500K/yr.' },
              ].map((c) => (
                <div key={c.name} className="rounded-xl p-4" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
                  <p className="text-sm font-bold mb-1" style={{ color: 'var(--text)' }}>{c.name}</p>
                  <p className="text-xs font-bold mb-1" style={{ color: 'var(--accent)' }}>{c.revenue}</p>
                  <p className="text-[10px] mb-1" style={{ color: 'var(--text-sub)' }}>{c.asset}</p>
                  <p className="text-[9px]" style={{ color: 'var(--text-dim)' }}>{c.note}</p>
                </div>
              ))}
            </div>

            {/* Privacy & Compliance */}
            <div className="rounded-xl p-4" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
              <h3 className="text-xs font-bold mb-2" style={{ color: 'var(--text)' }}>Privacy-Compliant Monetization</h3>
              <div className="grid md:grid-cols-2 gap-3 text-[10px]" style={{ color: 'var(--text-sub)' }}>
                <div>
                  <p className="font-semibold mb-1" style={{ color: 'var(--text)' }}>Data Clean Room Approach</p>
                  <p>AWS Clean Rooms / LiveRamp for joint analysis without raw data sharing. Insurer queries against HomeProjectIQ data without seeing individual records. $5K-25K/yr platform fees.</p>
                </div>
                <div>
                  <p className="font-semibold mb-1" style={{ color: 'var(--text)' }}>Consent &amp; Compliance</p>
                  <p>Model on 60-80% user consent (not 100%). K-anonymity k=5+ minimum. CCPA/GDPR compliant. Frame as &ldquo;home health score&rdquo; benefit, not data sharing risk. Show estimated dollar savings before asking consent.</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t py-6 text-center" style={{ borderColor: 'var(--glass-border)' }}>
        <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
          HomeProjectIQ Monetization Intelligence &middot; Synthesized by 10 AI Council Agents &middot; Research-backed projections
        </p>
        <p className="text-[10px] mt-1" style={{ color: 'var(--text-sub)' }}>
          Sources include Angi SEC filings, Verisk 10-K, RevenueCat 2025 benchmarks, PitchBook, and 200+ web research queries
        </p>
      </footer>
    </div>
  );
}
