import type { AppUser, Project, LogbookEntry, ToolboxItem, DiagnosisResult } from '@/types/app';

// ─── Demo User ──────────────────────────────────────────────
export const DEMO_USER: AppUser = {
  id: 'demo-user-001',
  email: 'alex@demo.homeprojectiq.com',
  username: 'alexdemo',
  display_name: 'Alex Demo',
  avatar_url: null,
  role: 'user',
  xp: 2350,
  total_xp: 2350,
  level: 5,
  total_savings: 1840,
  streak: 12,
  last_active_at: new Date().toISOString(),
  skills: {
    plumbing: 4,
    electrical: 2,
    carpentry: 3,
    painting: 5,
    landscaping: 3,
    tiling: 1,
    hvac: 2,
    masonry: 1,
  },
  badges: [
    'first_project',
    'five_projects',
    'ten_projects',
    'saved_500',
    'saved_1000',
    'streak_7',
    'logbook_10',
  ],
  onboarding_completed_at: '2025-11-15T10:00:00Z',
  locale: 'en',
  currency: 'USD',
  units: 'imperial',
  created_at: '2025-11-15T10:00:00Z',
  updated_at: new Date().toISOString(),
};

// ─── Demo Projects ──────────────────────────────────────────
export const DEMO_PROJECTS: Project[] = [
  {
    id: 'demo-proj-001',
    user_id: 'demo-user-001',
    category_id: 'plumbing',
    title: 'Kitchen Faucet Replacement',
    confidence: 92,
    verdict: 'diy_easy',
    intake_answers: { age: '10-20 years', type: 'Single-handle' },
    status: 'completed',
    estimated_diy_lo: 2500,
    estimated_diy_hi: 6000,
    estimated_pro_lo: 15000,
    estimated_pro_hi: 30000,
    actual_cost: 3500,
    xp_awarded: 50,
    created_at: '2026-02-10T14:00:00Z',
    updated_at: '2026-02-12T16:00:00Z',
    completed_at: '2026-02-12T16:00:00Z',
    outcome_status: 'success',
    outcome_actual_cost: 3500,
    outcome_actual_hours: 2,
    outcome_difficulty: 'as_expected',
    outcome_complications: null,
    outcome_would_diy_again: true,
    outcome_photos: [],
    outcome_submitted_at: '2026-02-12T16:30:00Z',
    ai_photo_url: null,
    ai_description: null,
    assessment_mode: 'category',
  },
  {
    id: 'demo-proj-002',
    user_id: 'demo-user-001',
    category_id: 'deck',
    title: 'Deck Staining & Sealing',
    confidence: 88,
    verdict: 'diy_easy',
    intake_answers: { size: '200-400 sq ft', condition: 'Moderate wear' },
    status: 'in_progress',
    estimated_diy_lo: 8000,
    estimated_diy_hi: 15000,
    estimated_pro_lo: 30000,
    estimated_pro_hi: 60000,
    actual_cost: null,
    xp_awarded: 0,
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-05T08:00:00Z',
    completed_at: null,
    outcome_status: null,
    outcome_actual_cost: null,
    outcome_actual_hours: null,
    outcome_difficulty: null,
    outcome_complications: null,
    outcome_would_diy_again: null,
    outcome_photos: [],
    outcome_submitted_at: null,
    ai_photo_url: null,
    ai_description: null,
    assessment_mode: 'category',
  },
  {
    id: 'demo-proj-003',
    user_id: 'demo-user-001',
    category_id: 'plumbing',
    title: 'Running Toilet Fix',
    confidence: 95,
    verdict: 'diy_easy',
    intake_answers: { symptom: 'Runs constantly', age: 'Under 10 years' },
    status: 'completed',
    estimated_diy_lo: 800,
    estimated_diy_hi: 2500,
    estimated_pro_lo: 10000,
    estimated_pro_hi: 20000,
    actual_cost: 1200,
    xp_awarded: 50,
    created_at: '2026-01-20T09:00:00Z',
    updated_at: '2026-01-20T11:00:00Z',
    completed_at: '2026-01-20T11:00:00Z',
    outcome_status: 'success',
    outcome_actual_cost: 1200,
    outcome_actual_hours: 0.5,
    outcome_difficulty: 'easier',
    outcome_complications: null,
    outcome_would_diy_again: true,
    outcome_photos: [],
    outcome_submitted_at: '2026-01-20T11:30:00Z',
    ai_photo_url: null,
    ai_description: null,
    assessment_mode: 'category',
  },
  {
    id: 'demo-proj-004',
    user_id: 'demo-user-001',
    category_id: 'electrical',
    title: 'Ceiling Fan Installation',
    confidence: 72,
    verdict: 'diy_caution',
    intake_answers: { existing: 'Light fixture only', height: '8-9 ft' },
    status: 'planning',
    estimated_diy_lo: 5000,
    estimated_diy_hi: 12000,
    estimated_pro_lo: 15000,
    estimated_pro_hi: 35000,
    actual_cost: null,
    xp_awarded: 0,
    created_at: '2026-03-07T15:00:00Z',
    updated_at: '2026-03-07T15:00:00Z',
    completed_at: null,
    outcome_status: null,
    outcome_actual_cost: null,
    outcome_actual_hours: null,
    outcome_difficulty: null,
    outcome_complications: null,
    outcome_would_diy_again: null,
    outcome_photos: [],
    outcome_submitted_at: null,
    ai_photo_url: null,
    ai_description: null,
    assessment_mode: 'category',
  },
];

// ─── Demo Logbook ───────────────────────────────────────────
export const DEMO_LOGBOOK: LogbookEntry[] = [
  {
    id: 'demo-log-001',
    user_id: 'demo-user-001',
    project_id: 'demo-proj-001',
    title: 'Kitchen Faucet Replacement',
    category_id: 'plumbing',
    notes: 'Replaced old single-handle Moen with new Kohler. Took about 2 hours.',
    cost: 3500,
    labor_type: 'diy',
    photo_urls: [],
    xp_awarded: 15,
    repair_date: '2026-02-12',
    created_at: '2026-02-12T16:00:00Z',
    updated_at: '2026-02-12T16:00:00Z',
  },
  {
    id: 'demo-log-002',
    user_id: 'demo-user-001',
    project_id: 'demo-proj-003',
    title: 'Running Toilet Fix',
    category_id: 'plumbing',
    notes: 'Replaced flapper valve and fill valve. Super easy 30 min fix.',
    cost: 1200,
    labor_type: 'diy',
    photo_urls: [],
    xp_awarded: 15,
    repair_date: '2026-01-20',
    created_at: '2026-01-20T11:00:00Z',
    updated_at: '2026-01-20T11:00:00Z',
  },
  {
    id: 'demo-log-003',
    user_id: 'demo-user-001',
    project_id: null,
    title: 'Master Bedroom Repaint',
    category_id: 'painting',
    notes: 'Sherwin-Williams Agreeable Gray. Two coats, cut-in by hand.',
    cost: 12000,
    labor_type: 'diy',
    photo_urls: [],
    xp_awarded: 15,
    repair_date: '2026-02-28',
    created_at: '2026-02-28T14:00:00Z',
    updated_at: '2026-02-28T14:00:00Z',
  },
  {
    id: 'demo-log-004',
    user_id: 'demo-user-001',
    project_id: null,
    title: 'HVAC Filter Change',
    category_id: 'hvac',
    notes: 'Replaced 20x25x1 MERV 13 filter. Set reminder for 90 days.',
    cost: 2500,
    labor_type: 'diy',
    photo_urls: [],
    xp_awarded: 15,
    repair_date: '2026-02-15',
    created_at: '2026-02-15T10:00:00Z',
    updated_at: '2026-02-15T10:00:00Z',
  },
  {
    id: 'demo-log-005',
    user_id: 'demo-user-001',
    project_id: null,
    title: 'Garbage Disposal Replacement',
    category_id: 'plumbing',
    notes: 'Hired Joe\'s Plumbing — old InSinkErator was shot. Warranty covered parts.',
    cost: 28000,
    labor_type: 'hired_pro',
    photo_urls: [],
    xp_awarded: 15,
    repair_date: '2026-01-05',
    created_at: '2026-01-05T15:00:00Z',
    updated_at: '2026-01-05T15:00:00Z',
  },
];

// ─── Demo Toolbox ───────────────────────────────────────────
export const DEMO_TOOLBOX: ToolboxItem[] = [
  { id: 'demo-tool-001', user_id: 'demo-user-001', tool_id: 'tape_measure', tool_name: 'Tape Measure', category: 'Measuring', notes: null, added_at: '2025-11-15T10:00:00Z' },
  { id: 'demo-tool-002', user_id: 'demo-user-001', tool_id: 'hammer', tool_name: 'Hammer', category: 'Hand Tools', notes: null, added_at: '2025-11-15T10:00:00Z' },
  { id: 'demo-tool-003', user_id: 'demo-user-001', tool_id: 'screwdriver_set', tool_name: 'Screwdriver Set', category: 'Hand Tools', notes: null, added_at: '2025-11-15T10:00:00Z' },
  { id: 'demo-tool-004', user_id: 'demo-user-001', tool_id: 'drill', tool_name: 'Cordless Drill', category: 'Power Tools', notes: 'DeWalt 20V', added_at: '2025-11-20T10:00:00Z' },
  { id: 'demo-tool-005', user_id: 'demo-user-001', tool_id: 'adjustable_wrench', tool_name: 'Adjustable Wrench', category: 'Hand Tools', notes: null, added_at: '2025-12-01T10:00:00Z' },
  { id: 'demo-tool-006', user_id: 'demo-user-001', tool_id: 'safety_glasses', tool_name: 'Safety Glasses', category: 'Safety', notes: null, added_at: '2025-11-15T10:00:00Z' },
  { id: 'demo-tool-007', user_id: 'demo-user-001', tool_id: 'level', tool_name: 'Level', category: 'Measuring', notes: null, added_at: '2025-12-15T10:00:00Z' },
  { id: 'demo-tool-008', user_id: 'demo-user-001', tool_id: 'pressure_washer', tool_name: 'Pressure Washer', category: 'Power Tools', notes: 'Ryobi 2300 PSI', added_at: '2026-02-20T10:00:00Z' },
];

// ─── Demo Diagnosis (pre-built for leaky faucet) ────────────
export const DEMO_DIAGNOSIS: DiagnosisResult = {
  title: 'Kitchen Faucet Replacement',
  conf: 92,
  xp: 50,
  save: 120,
  why: 'Standard single-handle faucet replacement is a beginner-friendly project requiring minimal tools.',
  flags: ['Turn off water supply valves under sink before starting'],
  fq: [
    { q: 'How old is the faucet?', opts: ['Under 5 years', '5-10 years', '10-20 years', 'Over 20 years'] },
    { q: 'What type of faucet?', opts: ['Single-handle', 'Two-handle', 'Pull-down sprayer', 'Wall-mounted'] },
  ],
  diy: { lo: 25, hi: 60, hrs: 2, time: '1-2 hours', risk: 'Low — straightforward swap' },
  pro: { lo: 150, hi: 300, time: '30 min - 1 hour', risk: 'None', note: 'Licensed plumber recommended if supply lines are corroded.', script: 'Hi, I need a kitchen faucet replaced. The existing faucet is a single-handle model, about 10-15 years old. I already have the new faucet. Can you give me a quote for installation?' },
  tl: [
    { phase: 'Prep & shutoff', time: '10 min' },
    { phase: 'Remove old faucet', time: '20-30 min' },
    { phase: 'Install new faucet', time: '30-45 min' },
    { phase: 'Test & cleanup', time: '15 min' },
  ],
  tools: [
    { n: 'Basin Wrench', e: '🔧', r: 'Required', tip: 'Essential for reaching nuts under the sink.' },
    { n: 'Adjustable Wrench', e: '🔧', r: 'Required', tip: 'For supply line connections.' },
    { n: 'Flashlight', e: '🔦', r: 'Helpful', tip: 'Hard to see under cabinets.' },
    { n: "Plumber's Tape", e: '🩹', r: 'Required', tip: 'Wrap all threaded connections 3-4 times clockwise.' },
  ],
  steps: [
    { s: 'Turn off hot and cold water supply valves under the sink', t: '2 min', photo: false, tip: 'Turn handles clockwise to close.' },
    { s: 'Open the faucet to release remaining water pressure', t: '1 min', photo: false, tip: 'Place a towel under the work area.' },
    { s: 'Disconnect supply lines from the old faucet', t: '10 min', photo: true, tip: 'Have a bucket ready for residual water.' },
    { s: 'Remove the mounting nuts and lift out the old faucet', t: '15 min', photo: true, tip: 'Basin wrench makes this much easier.' },
    { s: 'Clean the sink surface where the new faucet will sit', t: '5 min', photo: false, tip: 'Remove old putty or caulk residue.' },
    { s: 'Install the new faucet following manufacturer instructions', t: '20 min', photo: true, tip: 'Hand-tighten first, then snug with wrench.' },
    { s: 'Reconnect supply lines and turn water back on', t: '10 min', photo: false, tip: 'Check all connections for leaks.' },
  ],
  shop: [
    { n: 'Moen Adler Kitchen Faucet', sz: 'Standard', pr: 89, store: 'Home Depot', sku: '87233SRS', stock: 'In Stock', tag: 'Best Seller' },
    { n: "Plumber's Tape (3-pack)", sz: '1/2" x 260"', pr: 3, store: 'Home Depot', sku: '017559', stock: 'In Stock', tag: 'Essential' },
    { n: 'Basin Wrench', sz: '11 inch', pr: 15, store: "Lowe's", sku: 'BW-11', stock: 'In Stock', tag: 'Tool' },
  ],
  matEst: 107,
};

// ─── NEW FEATURES: Smart Insights (AI-powered seasonal tips) ─
export interface SmartInsight {
  id: string;
  icon: string;
  accent: string;
  accentBg: string;
  label: string;
  title: string;
  body: string;
  timing?: string;
  source: 'weather' | 'seasonal' | 'ai' | 'calendar';
}

export const DEMO_SMART_INSIGHTS: SmartInsight[] = [
  {
    id: 'insight-001',
    icon: '🌱',
    accent: 'var(--emerald)',
    accentBg: 'var(--emerald-soft)',
    label: 'BEST TIME TO PLANT',
    title: 'Perfect Week for Cool-Season Grass Seed',
    body: 'Soil temp is 55\u00B0F and rain is forecast Wednesday. Overseed bare patches now \u2014 seeds will germinate in 7-10 days and fill in by mid-April.',
    timing: 'This week',
    source: 'weather',
  },
  {
    id: 'insight-002',
    icon: '🌸',
    accent: 'var(--accent)',
    accentBg: 'var(--accent-soft)',
    label: 'GARDENING TIP',
    title: 'Plant Pansies & Snapdragons Now',
    body: 'These cold-hardy annuals thrive when planted in early March. Pansies will bloom through May. Snapdragons will peak in late April \u2014 perfect for curb appeal.',
    timing: 'Plant this weekend',
    source: 'seasonal',
  },
  {
    id: 'insight-003',
    icon: '💦',
    accent: 'var(--info)',
    accentBg: 'var(--info-soft)',
    label: 'PERFECT DAY TO POWERWASH',
    title: 'Thursday: Ideal Deck Cleaning Conditions',
    body: '62\u00B0F, overcast, low wind. Powerwash your deck before staining season \u2014 direct sun causes cleaning solution to dry too fast and leave streaks.',
    timing: 'Thursday 9 AM \u2013 2 PM',
    source: 'weather',
  },
  {
    id: 'insight-004',
    icon: '🏷\uFE0F',
    accent: 'var(--gold)',
    accentBg: 'var(--gold-soft)',
    label: 'SEASONAL DEAL ALERT',
    title: 'Mulch Goes on Sale This Month',
    body: 'Home Depot & Lowe\u2019s run their annual 5-for-$10 mulch sale in mid-March. Stock up \u2014 you\u2019ll need ~15 bags for a 500 sq ft bed at 3\u201D depth.',
    timing: 'Sale starts Mar 14',
    source: 'seasonal',
  },
  {
    id: 'insight-005',
    icon: '🔥',
    accent: 'var(--danger)',
    accentBg: 'var(--danger-soft)',
    label: 'HVAC REMINDER',
    title: 'Switch HVAC from Heat to Cool Mode',
    body: 'Nighttime lows are staying above 50\u00B0F now. Switch to cooling, replace the filter, and clean the outdoor condenser coils before the first hot day.',
    timing: 'Do this weekend',
    source: 'ai',
  },
  {
    id: 'insight-006',
    icon: '🔧',
    accent: 'var(--info)',
    accentBg: 'var(--info-soft)',
    label: 'BEST TIME TO AERATE',
    title: 'Aerate This Weekend Before Overseeding',
    body: 'Soil is moist from Tuesday\u2019s rain but not waterlogged \u2014 perfect for pulling cores. Aerate Saturday morning, then overseed immediately after for direct seed-to-soil contact.',
    timing: 'Saturday AM',
    source: 'weather',
  },
  {
    id: 'insight-007',
    icon: '🌱',
    accent: 'var(--emerald)',
    accentBg: 'var(--emerald-soft)',
    label: 'YARD AI ASSESSMENT',
    title: 'Your Backyard Needs ~21 lbs of Seed',
    body: 'Based on your yard photo, 30% is bare/thin (1,260 sq ft). At 5 lbs/1,000 sq ft overseed rate, you need 21 lbs of sun & shade mix. Total cost: $95-$189 including starter fertilizer.',
    timing: 'Seed this week',
    source: 'ai',
  },
  {
    id: 'insight-008',
    icon: '🛡️',
    accent: 'var(--gold)',
    accentBg: 'var(--gold-soft)',
    label: 'CRITICAL TIMING',
    title: 'Pre-Emergent Window Closing This Week',
    body: 'Soil temp hit 55\u00B0F \u2014 crabgrass germinates at 55\u00B0F+. Apply pre-emergent to healthy lawn areas NOW, but NOT where you\u2019re overseeding (it blocks grass seed too).',
    timing: 'Apply by Mar 15',
    source: 'ai',
  },
];

// ─── NEW FEATURES: Honey-Do List ────────────────────────────
export interface HoneyDoItem {
  id: string;
  title: string;
  assignedBy: string;
  assignedByAvatar: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
  done: boolean;
  category: string;
  icon: string;
}

export const DEMO_HONEY_DO: HoneyDoItem[] = [
  { id: 'hd-001', title: 'Fix the squeaky door in the hallway', assignedBy: 'Sarah', assignedByAvatar: '👩', priority: 'high', dueDate: '2026-03-12', done: false, category: 'Carpentry', icon: '🚪' },
  { id: 'hd-002', title: 'Hang shelves in the nursery', assignedBy: 'Sarah', assignedByAvatar: '👩', priority: 'high', dueDate: '2026-03-15', done: false, category: 'Carpentry', icon: '🪵' },
  { id: 'hd-003', title: 'Replace kitchen cabinet knobs', assignedBy: 'Sarah', assignedByAvatar: '👩', priority: 'medium', dueDate: null, done: false, category: 'General', icon: '🔘' },
  { id: 'hd-004', title: 'Caulk around bathtub', assignedBy: 'Sarah', assignedByAvatar: '👩', priority: 'medium', dueDate: '2026-03-20', done: false, category: 'Plumbing', icon: '🛁' },
  { id: 'hd-005', title: 'Fix the leaky garden hose bib', assignedBy: 'Alex', assignedByAvatar: '👨', priority: 'low', dueDate: null, done: true, category: 'Plumbing', icon: '🚰' },
];

// ─── NEW FEATURES: Tool Lending Tracker ─────────────────────
export interface ToolLoan {
  id: string;
  toolName: string;
  toolEmoji: string;
  borrowerName: string;
  borrowerAvatar: string;
  lentDate: string;
  returnDate: string | null;
  status: 'out' | 'returned' | 'overdue';
}

export const DEMO_TOOL_LOANS: ToolLoan[] = [
  { id: 'loan-001', toolName: 'Pressure Washer', toolEmoji: '💦', borrowerName: 'Mike R.', borrowerAvatar: '👨\u200D🔧', lentDate: '2026-03-01', returnDate: null, status: 'out' },
  { id: 'loan-002', toolName: 'Circular Saw', toolEmoji: '🪚', borrowerName: 'Dave K.', borrowerAvatar: '🧔', lentDate: '2026-02-20', returnDate: null, status: 'overdue' },
  { id: 'loan-003', toolName: 'Cordless Drill', toolEmoji: '🔩', borrowerName: 'Jen P.', borrowerAvatar: '👩\u200D🔧', lentDate: '2026-02-10', returnDate: '2026-02-15', status: 'returned' },
];

// ─── NEW FEATURES: Handiness Leaderboard ────────────────────
export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  levelLabel: string;
  projectCount: number;
  savings: number;
  streak: number;
  topSkill: string;
  isCurrentUser: boolean;
}

export const DEMO_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Alex Demo', avatar: '🏆', xp: 2350, level: 5, levelLabel: 'Master', projectCount: 14, savings: 1840, streak: 12, topSkill: 'Painting', isCurrentUser: true },
  { rank: 2, name: 'Mike R.', avatar: '👨\u200D🔧', xp: 2100, level: 5, levelLabel: 'Master', projectCount: 12, savings: 1620, streak: 8, topSkill: 'Plumbing', isCurrentUser: false },
  { rank: 3, name: 'Dave K.', avatar: '🧔', xp: 1850, level: 5, levelLabel: 'Master', projectCount: 11, savings: 1450, streak: 5, topSkill: 'Carpentry', isCurrentUser: false },
  { rank: 4, name: 'Sarah M.', avatar: '👩', xp: 1200, level: 5, levelLabel: 'Master', projectCount: 8, savings: 980, streak: 3, topSkill: 'Landscaping', isCurrentUser: false },
  { rank: 5, name: 'Jen P.', avatar: '👩\u200D🔧', xp: 890, level: 4, levelLabel: 'Skilled', projectCount: 6, savings: 720, streak: 2, topSkill: 'Painting', isCurrentUser: false },
  { rank: 6, name: 'Carlos T.', avatar: '🧑', xp: 650, level: 4, levelLabel: 'Skilled', projectCount: 5, savings: 540, streak: 1, topSkill: 'Electrical', isCurrentUser: false },
  { rank: 7, name: 'Lisa W.', avatar: '👩\u200D🦰', xp: 420, level: 3, levelLabel: 'Handy', projectCount: 3, savings: 350, streak: 0, topSkill: 'Plumbing', isCurrentUser: false },
];

// ─── NEW FEATURES: Live Contractor Bids ─────────────────────
export interface ContractorBid {
  id: string;
  contractorName: string;
  companyName: string;
  rating: number;
  reviewCount: number;
  bidAmount: number;
  estimatedDays: number;
  avatar: string;
  verified: boolean;
  responseTime: string;
  friendRecommended: boolean;
  friendName?: string;
}

export const DEMO_LIVE_BIDS: ContractorBid[] = [
  { id: 'bid-001', contractorName: 'Joe Martinez', companyName: 'Martinez Plumbing', rating: 4.9, reviewCount: 127, bidAmount: 18500, estimatedDays: 1, avatar: '👷', verified: true, responseTime: '2 min ago', friendRecommended: true, friendName: 'Dave K.' },
  { id: 'bid-002', contractorName: 'Sam Electric', companyName: 'Bright Spark Electric', rating: 4.7, reviewCount: 89, bidAmount: 22000, estimatedDays: 1, avatar: '⚡', verified: true, responseTime: '8 min ago', friendRecommended: false },
  { id: 'bid-003', contractorName: 'Home Right LLC', companyName: 'Home Right General', rating: 4.5, reviewCount: 203, bidAmount: 16000, estimatedDays: 2, avatar: '🏠', verified: true, responseTime: '15 min ago', friendRecommended: false },
];

// ─── NEW FEATURES: Pro Network (friends' pro recommendations) ─
export interface ProRecommendation {
  id: string;
  proName: string;
  company: string;
  specialty: string;
  rating: number;
  recommendedBy: string;
  recommenderAvatar: string;
  review: string;
  cost: string;
  icon: string;
}

export const DEMO_PRO_RECS: ProRecommendation[] = [
  { id: 'pro-001', proName: 'Joe Martinez', company: 'Martinez Plumbing', specialty: 'Plumbing', rating: 4.9, recommendedBy: 'Dave K.', recommenderAvatar: '🧔', review: 'Fixed my slab leak in one day. Fair price, clean work.', cost: '$150-300', icon: '🔧' },
  { id: 'pro-002', proName: 'Sarah Kim', company: 'Kim\'s Painting', specialty: 'Painting', rating: 4.8, recommendedBy: 'Jen P.', recommenderAvatar: '👩\u200D🔧', review: 'Did our whole exterior. Incredible attention to detail.', cost: '$2,000-5,000', icon: '🎨' },
  { id: 'pro-003', proName: 'Tom Reeves', company: 'Bright Spark Electric', specialty: 'Electrical', rating: 4.7, recommendedBy: 'Mike R.', recommenderAvatar: '👨\u200D🔧', review: 'Installed our EV charger and panel upgrade. Licensed, insured, great communication.', cost: '$200-800', icon: '⚡' },
];

// ─── NEW FEATURES: Maintenance Schedule ─────────────────────
export interface MaintenanceTask {
  id: string;
  title: string;
  icon: string;
  category: string;
  frequencyLabel: string;
  frequencyDays: number;
  lastDone: string | null;
  nextDue: string;
  status: 'on_track' | 'due_soon' | 'overdue';
  notes: string | null;
  /** Useful to partner services (e.g. filter delivery) */
  partnerTag?: string;
}

export const DEMO_MAINTENANCE: MaintenanceTask[] = [
  {
    id: 'maint-001',
    title: 'Replace HVAC Filter',
    icon: '🌡️',
    category: 'HVAC',
    frequencyLabel: 'Every 90 days',
    frequencyDays: 90,
    lastDone: '2026-02-15',
    nextDue: '2026-05-16',
    status: 'on_track',
    notes: '20x25x1 MERV 13',
    partnerTag: 'filter_delivery',
  },
  {
    id: 'maint-002',
    title: 'Lawn Fertilizer Application',
    icon: '🌿',
    category: 'Landscaping',
    frequencyLabel: 'Every 6 weeks (spring/summer)',
    frequencyDays: 42,
    lastDone: '2026-02-01',
    nextDue: '2026-03-15',
    status: 'due_soon',
    notes: 'Scotts Turf Builder — next round is crabgrass preventer',
    partnerTag: 'lawn_care',
  },
  {
    id: 'maint-003',
    title: 'Test Smoke & CO Detectors',
    icon: '🔋',
    category: 'Safety',
    frequencyLabel: 'Monthly',
    frequencyDays: 30,
    lastDone: '2026-02-08',
    nextDue: '2026-03-08',
    status: 'overdue',
    notes: 'Replace batteries every 6 months (next: June)',
  },
  {
    id: 'maint-004',
    title: 'Clean Gutters',
    icon: '🌧️',
    category: 'Exterior',
    frequencyLabel: 'Twice a year',
    frequencyDays: 180,
    lastDone: '2025-11-10',
    nextDue: '2026-05-09',
    status: 'on_track',
    notes: 'Last cleaned after leaf fall',
  },
  {
    id: 'maint-005',
    title: 'Deep Clean Dryer Vent',
    icon: '🧹',
    category: 'Safety',
    frequencyLabel: 'Every 12 months',
    frequencyDays: 365,
    lastDone: '2025-09-20',
    nextDue: '2026-09-20',
    status: 'on_track',
    notes: 'Hired ServiceMaster last time — $120',
  },
  {
    id: 'maint-006',
    title: 'Water Heater Flush',
    icon: '🚿',
    category: 'Plumbing',
    frequencyLabel: 'Every 12 months',
    frequencyDays: 365,
    lastDone: '2025-08-15',
    nextDue: '2026-08-15',
    status: 'on_track',
    notes: '50 gal gas — flush sediment, check anode rod',
  },
  {
    id: 'maint-007',
    title: 'HVAC Professional Service',
    icon: '❄️',
    category: 'HVAC',
    frequencyLabel: 'Twice a year (spring/fall)',
    frequencyDays: 180,
    lastDone: '2025-10-22',
    nextDue: '2026-04-20',
    status: 'on_track',
    notes: 'AC tune-up before summer',
    partnerTag: 'hvac_service',
  },
  {
    id: 'maint-008',
    title: 'Re-caulk Bathtub & Shower',
    icon: '🛁',
    category: 'Plumbing',
    frequencyLabel: 'Every 12 months',
    frequencyDays: 365,
    lastDone: null,
    nextDue: '2026-03-01',
    status: 'overdue',
    notes: 'Never tracked — check all 3 bathrooms',
  },
];

// ─── NEW FEATURES: Last-Done Activity Tracker ───────────────
export interface LastDoneItem {
  id: string;
  title: string;
  icon: string;
  category: string;
  lastDone: string;
  daysSince: number;
  frequency: string;
  /** Whether this data is useful to partner services */
  partnerRelevant: boolean;
  partnerNote?: string;
}

export const DEMO_LAST_DONE: LastDoneItem[] = [
  { id: 'ld-001', title: 'Changed HVAC filter', icon: '🌡️', category: 'HVAC', lastDone: '2026-02-15', daysSince: 22, frequency: 'Every 90 days', partnerRelevant: true, partnerNote: 'Filter delivery subscription' },
  { id: 'ld-002', title: 'Applied lawn fertilizer', icon: '🌿', category: 'Landscaping', lastDone: '2026-02-01', daysSince: 36, frequency: 'Every 6 weeks', partnerRelevant: true, partnerNote: 'Lawn care service' },
  { id: 'ld-003', title: 'Tested smoke detectors', icon: '🔋', category: 'Safety', lastDone: '2026-02-08', daysSince: 29, frequency: 'Monthly', partnerRelevant: false },
  { id: 'ld-004', title: 'Replaced faucet', icon: '🚿', category: 'Plumbing', lastDone: '2026-02-12', daysSince: 25, frequency: 'As needed', partnerRelevant: false },
  { id: 'ld-005', title: 'Repainted bedroom', icon: '🎨', category: 'Painting', lastDone: '2026-02-28', daysSince: 9, frequency: '5-7 years', partnerRelevant: false },
  { id: 'ld-006', title: 'Cleaned gutters', icon: '🌧️', category: 'Exterior', lastDone: '2025-11-10', daysSince: 119, frequency: 'Twice a year', partnerRelevant: true, partnerNote: 'Gutter cleaning service' },
  { id: 'ld-007', title: 'Flushed water heater', icon: '💧', category: 'Plumbing', lastDone: '2025-08-15', daysSince: 206, frequency: 'Yearly', partnerRelevant: true, partnerNote: 'Plumber annual service' },
  { id: 'ld-008', title: 'Serviced HVAC', icon: '❄️', category: 'HVAC', lastDone: '2025-10-22', daysSince: 138, frequency: 'Twice a year', partnerRelevant: true, partnerNote: 'HVAC tune-up' },
];

// ─── NEW FEATURES: Home Health Score ────────────────────────
export interface HomeHealthData {
  overallScore: number; // 0-100
  grade: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'D' | 'F';
  trend: 'improving' | 'stable' | 'declining';
  trendDelta: number;
  categories: HomeHealthCategory[];
  streakDays: number;
  lastActivity: string;
}

export interface HomeHealthCategory {
  id: string;
  label: string;
  icon: string;
  score: number; // 0-100
  status: 'excellent' | 'good' | 'fair' | 'needs_attention';
  lastServiced: string | null;
  nextDue: string | null;
  tip: string;
  /** System-level details for the expanded view */
  system?: HomeSystem;
}

export interface HomeSystem {
  installYear: number;
  model?: string;
  brand?: string;
  estimatedLifespan: string;
  ageYears: number;
  lifespanPct: number; // 0-100, how far through expected life
  condition: 'like_new' | 'good' | 'worn' | 'failing';
  conditionNote: string;
  maintenanceCount: number;
  maintenanceVerified: boolean;
  photoAssessed: boolean;
  photoNote?: string;
}

export const DEMO_HOME_HEALTH: HomeHealthData = {
  overallScore: 82,
  grade: 'B+',
  trend: 'improving',
  trendDelta: 7,
  streakDays: 12,
  lastActivity: '2026-03-09',
  categories: [
    {
      id: 'hh-plumbing', label: 'Plumbing', icon: '🚿', score: 92, status: 'excellent',
      lastServiced: '2026-02-12', nextDue: null,
      tip: 'All fixtures recently serviced',
      system: { installYear: 2019, brand: 'Kohler / Moen', estimatedLifespan: '15-20 yrs', ageYears: 7, lifespanPct: 40, condition: 'good', conditionNote: 'Faucet replaced Feb 2026, toilet flapper replaced Jan 2026', maintenanceCount: 4, maintenanceVerified: true, photoAssessed: false },
    },
    {
      id: 'hh-hvac', label: 'HVAC', icon: '❄️', score: 78, status: 'good',
      lastServiced: '2026-02-15', nextDue: '2026-04-20',
      tip: 'Filter fresh — spring tune-up due next month',
      system: { installYear: 2016, brand: 'Carrier', model: 'Performance 16', estimatedLifespan: '15-20 yrs', ageYears: 10, lifespanPct: 57, condition: 'good', conditionNote: 'Installed 2016. Routinely maintained — 6 professional services on record. Filter changed every 90 days.', maintenanceCount: 6, maintenanceVerified: true, photoAssessed: false },
    },
    {
      id: 'hh-electrical', label: 'Electrical', icon: '⚡', score: 85, status: 'good',
      lastServiced: null, nextDue: null,
      tip: 'Ceiling fan project will boost this',
      system: { installYear: 2005, brand: 'Panel: Square D', estimatedLifespan: '25-40 yrs', ageYears: 21, lifespanPct: 65, condition: 'good', conditionNote: '200A panel, no known issues. GFCI outlets tested monthly.', maintenanceCount: 2, maintenanceVerified: false, photoAssessed: false },
    },
    {
      id: 'hh-exterior', label: 'Exterior & Deck', icon: '🏠', score: 64, status: 'fair',
      lastServiced: '2025-11-10', nextDue: '2026-05-09',
      tip: 'Deck needs staining — wood is graying and showing wear',
      system: { installYear: 2012, brand: 'Pressure-treated pine', estimatedLifespan: '15-25 yrs (maintained)', ageYears: 14, lifespanPct: 70, condition: 'worn', conditionNote: 'AI photo assessment: Deck boards show UV graying, minor splitting on 3 boards. Staining overdue by ~1 year. Gutters OK — cleaned Nov 2025.', maintenanceCount: 3, maintenanceVerified: true, photoAssessed: true, photoNote: 'Photo analyzed Mar 5 — wood graying, light splitting, stain needed' },
    },
    {
      id: 'hh-safety', label: 'Safety', icon: '🔋', score: 60, status: 'needs_attention',
      lastServiced: '2026-02-08', nextDue: '2026-03-08',
      tip: 'Smoke detector test overdue by 1 day',
      system: { installYear: 2020, brand: 'First Alert / Kidde', estimatedLifespan: '10 yrs', ageYears: 6, lifespanPct: 60, condition: 'good', conditionNote: 'Detectors installed 2020. Battery swap due June. Monthly test overdue.', maintenanceCount: 8, maintenanceVerified: true, photoAssessed: false },
    },
    {
      id: 'hh-landscape', label: 'Landscaping & Yard', icon: '🌿', score: 74, status: 'fair',
      lastServiced: '2026-02-01', nextDue: '2026-03-15',
      tip: 'Bare patches detected — overseed now for spring fill-in',
      system: { installYear: 2005, brand: 'Bermuda / Fescue mix', estimatedLifespan: 'Ongoing', ageYears: 21, lifespanPct: 0, condition: 'worn', conditionNote: 'AI photo assessment: ~30% bare/thin patches in backyard, front lawn 80% healthy. Needs overseeding, aeration, and fertilizer program.', maintenanceCount: 3, maintenanceVerified: true, photoAssessed: true, photoNote: 'Photo analyzed Mar 8 — 30% bare patches, soil compaction likely' },
    },
    {
      id: 'hh-interior', label: 'Interior', icon: '🎨', score: 95, status: 'excellent',
      lastServiced: '2026-02-28', nextDue: null,
      tip: 'Master bedroom freshly painted',
      system: { installYear: 2005, estimatedLifespan: 'Ongoing', ageYears: 21, lifespanPct: 0, condition: 'like_new', conditionNote: 'Master repainted Feb 2026. Kitchen and living areas painted 2024.', maintenanceCount: 5, maintenanceVerified: true, photoAssessed: false },
    },
    {
      id: 'hh-roof', label: 'Roof', icon: '🏗️', score: 72, status: 'fair',
      lastServiced: '2025-04-15', nextDue: '2026-04-15',
      tip: 'Annual inspection due next month — 10 yrs into 25-yr shingles',
      system: { installYear: 2016, brand: 'GAF Timberline HDZ', estimatedLifespan: '25-30 yrs', ageYears: 10, lifespanPct: 38, condition: 'good', conditionNote: 'Installed 2016. Last inspected April 2025 — no missing shingles, flashing intact. Annual inspection recommended.', maintenanceCount: 2, maintenanceVerified: true, photoAssessed: false },
    },
    {
      id: 'hh-water-heater', label: 'Water Heater', icon: '💧', score: 65, status: 'fair',
      lastServiced: '2025-08-15', nextDue: '2026-08-15',
      tip: 'Anode rod may need replacement at 8+ years',
      system: { installYear: 2018, brand: 'Rheem', model: 'Performance Plus 50 gal', estimatedLifespan: '8-12 yrs', ageYears: 8, lifespanPct: 73, condition: 'good', conditionNote: 'Flushed Aug 2025. 8 years old — approaching mid-life. Check anode rod at next flush to prevent tank corrosion.', maintenanceCount: 3, maintenanceVerified: true, photoAssessed: false },
    },
  ],
};

// ─── NEW FEATURES: Yard AI Photo Assessment ─────────────────
export interface YardAssessment {
  photoDate: string;
  overallCondition: 'healthy' | 'fair' | 'poor';
  healthPct: number;
  barePatchPct: number;
  estimatedSqFt: number;
  grassType: string;
  issues: YardIssue[];
  seedCalculation: {
    overseedLbs: number;
    fullReseedLbs: number;
    costPerLb: number;
    totalCostLo: number;
    totalCostHi: number;
    coverageNote: string;
  };
  materials: YardMaterial[];
  aiPlan: YardPlanStep[];
}

export interface YardIssue {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  icon: string;
}

export interface YardMaterial {
  name: string;
  quantity: string;
  estimatedCost: number;
  store: string;
  icon: string;
  tag?: string;
}

export interface YardPlanStep {
  step: number;
  title: string;
  description: string;
  timing: string;
  icon: string;
}

export const DEMO_YARD_ASSESSMENT: YardAssessment = {
  photoDate: '2026-03-08',
  overallCondition: 'fair',
  healthPct: 70,
  barePatchPct: 30,
  estimatedSqFt: 4200,
  grassType: 'Bermuda / Fescue mix',
  issues: [
    { id: 'yi-001', title: 'Bare patches in backyard', severity: 'high', description: 'About 1,260 sq ft of thin/bare areas, concentrated near the tree line and high-traffic path.', icon: '🟫' },
    { id: 'yi-002', title: 'Soil compaction', severity: 'medium', description: 'Ground feels hard underfoot in play areas — aeration needed before overseeding.', icon: '🧱' },
    { id: 'yi-003', title: 'Thin spots along fence line', severity: 'medium', description: 'Shade from fence causing thinning. Consider shade-tolerant fescue blend.', icon: '🌑' },
    { id: 'yi-004', title: 'Early weed pressure', severity: 'low', description: 'Some clover and dandelion starting. Pre-emergent timing is critical this week.', icon: '🌼' },
  ],
  seedCalculation: {
    overseedLbs: 21,
    fullReseedLbs: 42,
    costPerLb: 4.50,
    totalCostLo: 95,
    totalCostHi: 189,
    coverageNote: 'Overseed rate: 5 lbs/1,000 sq ft for bare patches (1,260 sq ft) + 3 lbs/1,000 sq ft for thin areas (2,940 sq ft). Full reseed: 10 lbs/1,000 sq ft.',
  },
  materials: [
    { name: 'Scotts Turf Builder Grass Seed (Sun & Shade)', quantity: '21 lbs (overseed)', estimatedCost: 95, store: 'Home Depot', icon: '🌱', tag: 'Primary' },
    { name: 'Scotts Turf Builder Starter Fertilizer', quantity: '1 bag (5,000 sq ft)', estimatedCost: 28, store: 'Home Depot', icon: '🧪' },
    { name: 'Peat moss or seed cover mulch', quantity: '3 bales', estimatedCost: 18, store: "Lowe's", icon: '🟤' },
    { name: 'Scotts Halts Crabgrass Preventer', quantity: '1 bag (5,000 sq ft)', estimatedCost: 32, store: 'Home Depot', icon: '🛡️', tag: 'Do NOT apply where overseeding' },
    { name: 'Core aerator rental (half-day)', quantity: '4 hours', estimatedCost: 75, store: 'Home Depot Rental', icon: '🔧' },
    { name: 'Garden rake', quantity: '1', estimatedCost: 18, store: 'Already owned', icon: '🧹' },
    { name: 'Sprinkler / garden hose', quantity: '1', estimatedCost: 0, store: 'Already owned', icon: '💦' },
  ],
  aiPlan: [
    { step: 1, title: 'Aerate the lawn', description: 'Rent a core aerator and make 2 passes over compacted areas. This breaks up soil so seed, water, and nutrients can penetrate. Best done when soil is moist but not wet.', timing: 'This Saturday (Mar 15)', icon: '🔧' },
    { step: 2, title: 'Apply pre-emergent to front yard ONLY', description: 'Apply crabgrass preventer to healthy front lawn areas. Do NOT apply where you plan to overseed — it will prevent grass seed from germinating too.', timing: 'Same day as aeration', icon: '🛡️' },
    { step: 3, title: 'Overseed bare and thin patches', description: 'Spread seed at 5 lbs/1,000 sq ft on bare areas, 3 lbs/1,000 sq ft on thin areas. Use a broadcast spreader for even coverage. Rake seed lightly into soil.', timing: 'Mar 15-16', icon: '🌱' },
    { step: 4, title: 'Apply starter fertilizer', description: 'Spread starter fertilizer over seeded areas. It\u2019s high in phosphorus to promote root growth in new seedlings.', timing: 'Immediately after seeding', icon: '🧪' },
    { step: 5, title: 'Cover with peat moss', description: 'Lightly cover seeded areas with a thin layer of peat moss. This retains moisture and protects seeds from birds and wind.', timing: 'Same day', icon: '🟤' },
    { step: 6, title: 'Water 2-3x daily for 2 weeks', description: 'Keep seeded areas consistently moist (not flooded). Water lightly in morning, midday, and late afternoon. Reduce to 1x daily after germination starts.', timing: 'Mar 15 \u2013 Mar 29', icon: '💦' },
    { step: 7, title: 'First mow at 3.5 inches', description: 'Once new grass reaches 4 inches, mow at 3.5\u201D. Don\u2019t remove more than 1/3 of blade length. Use a sharp blade to avoid pulling up seedlings.', timing: 'Around Apr 5-10', icon: '🌿' },
    { step: 8, title: 'Apply regular fertilizer', description: 'After first mow, switch to regular lawn fertilizer (Scotts Turf Builder). Apply every 6-8 weeks through growing season.', timing: 'Mid-April', icon: '📅' },
  ],
};

// ─── NEW FEATURES: Lawn Calendar (AI-recommended timing) ────
export interface LawnCalendarItem {
  id: string;
  month: string;
  title: string;
  icon: string;
  description: string;
  bestWindow: string;
  whyNow: string;
  accent: string;
  accentBg: string;
  category: 'seeding' | 'fertilizing' | 'mowing' | 'aerating' | 'watering' | 'pest' | 'general';
}

export const DEMO_LAWN_CALENDAR: LawnCalendarItem[] = [
  {
    id: 'lc-001', month: 'Mar', title: 'Overseed Bare Patches', icon: '🌱',
    description: 'Cool-season seed germinates best with soil temps 50-65\u00B0F. March gives seedlings 6-8 weeks to establish before summer heat.',
    bestWindow: 'Mar 10-25', whyNow: 'Soil temp hit 55\u00B0F this week + rain forecast Wed',
    accent: 'var(--emerald)', accentBg: 'var(--emerald-soft)', category: 'seeding',
  },
  {
    id: 'lc-002', month: 'Mar', title: 'Apply Pre-Emergent (non-seeded areas)', icon: '🛡️',
    description: 'Crabgrass preventer must go down before soil hits 55\u00B0F for 3+ consecutive days. You\u2019re right at the edge — this week is the last chance.',
    bestWindow: 'Mar 8-15', whyNow: 'Soil temp at threshold — window closing',
    accent: 'var(--gold)', accentBg: 'var(--gold-soft)', category: 'pest',
  },
  {
    id: 'lc-003', month: 'Mar', title: 'Core Aerate Before Overseeding', icon: '🔧',
    description: 'Aerating breaks up compacted soil and gives seed direct contact with earth. Always aerate BEFORE seeding for best germination.',
    bestWindow: 'Mar 14-15', whyNow: 'Soil is moist from recent rain — ideal for pulling cores',
    accent: 'var(--info)', accentBg: 'var(--info-soft)', category: 'aerating',
  },
  {
    id: 'lc-004', month: 'Apr', title: 'First Mow of the Season', icon: '🌿',
    description: 'Mow when grass reaches 4\u201D, cut to 3.5\u201D. Never remove more than 1/3 of blade. A high first cut encourages root depth.',
    bestWindow: 'Apr 5-15', whyNow: 'New seedlings will be 3-4 weeks old by then',
    accent: 'var(--emerald)', accentBg: 'var(--emerald-soft)', category: 'mowing',
  },
  {
    id: 'lc-005', month: 'Apr', title: 'Spring Fertilizer Application', icon: '🧪',
    description: 'Apply slow-release nitrogen fertilizer after the first mow. This feeds the lawn through spring growth without burning new grass.',
    bestWindow: 'Apr 15-25', whyNow: 'New seedlings need 4+ weeks before fertilizing',
    accent: 'var(--accent)', accentBg: 'var(--accent-soft)', category: 'fertilizing',
  },
  {
    id: 'lc-006', month: 'May', title: 'Adjust Irrigation Schedule', icon: '💦',
    description: 'Switch from daily light watering (for seed) to deep watering 2-3x per week. 1\u201D of water per week total — trains roots to grow deep.',
    bestWindow: 'May 1-10', whyNow: 'Seedlings are established — shift to deep watering',
    accent: 'var(--info)', accentBg: 'var(--info-soft)', category: 'watering',
  },
  {
    id: 'lc-007', month: 'Sep', title: 'Fall Aeration & Overseeding', icon: '🍂',
    description: 'The #1 best time to seed cool-season grass. Warm soil + cool air + fall rain = perfect germination. Plan for Labor Day weekend.',
    bestWindow: 'Sep 1-20', whyNow: 'Mark your calendar — fall is the prime window',
    accent: 'var(--gold)', accentBg: 'var(--gold-soft)', category: 'seeding',
  },
  {
    id: 'lc-008', month: 'Nov', title: 'Winterizer Fertilizer', icon: '❄️',
    description: 'Last feeding before dormancy. High-potassium winterizer strengthens roots for cold months and gives you a head start in spring.',
    bestWindow: 'Nov 1-15', whyNow: 'Apply before first hard frost',
    accent: 'var(--info)', accentBg: 'var(--info-soft)', category: 'fertilizing',
  },
];

// ─── Mock API Routes (for fetch interception) ───────────────
export const DEMO_API_ROUTES: Record<string, unknown> = {
  '/api/user': DEMO_USER,
  '/api/analyze': DEMO_PROJECTS,
  '/api/assess': DEMO_DIAGNOSIS,
  '/api/toolbox': DEMO_TOOLBOX,
  '/api/logbook': DEMO_LOGBOOK,
  '/api/admin/flags': [],
  '/api/friends': DEMO_LEADERBOARD,
};
