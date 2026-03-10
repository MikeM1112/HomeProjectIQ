export interface AppUser {
  id: string;
  email: string | null;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
  xp: number;
  total_xp: number;
  level: number;
  total_savings: number;
  streak: number;
  last_active_at: string | null;
  skills: Record<string, number>;
  badges: string[];
  onboarding_completed_at: string | null;
  locale: string;
  currency: string;
  units: 'metric' | 'imperial';
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  category_id: string;
  title: string;
  confidence: number;
  verdict: Verdict;
  intake_answers: Record<string, string>;
  status: 'planning' | 'in_progress' | 'completed' | 'hired_pro';
  estimated_diy_lo: number | null;
  estimated_diy_hi: number | null;
  estimated_pro_lo: number | null;
  estimated_pro_hi: number | null;
  actual_cost: number | null;
  xp_awarded: number;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  outcome_status: 'success' | 'partial' | 'failed' | null;
  outcome_actual_cost: number | null;
  outcome_actual_hours: number | null;
  outcome_difficulty: 'easier' | 'as_expected' | 'harder' | null;
  outcome_complications: string | null;
  outcome_would_diy_again: boolean | null;
  outcome_photos: string[];
  outcome_submitted_at: string | null;
  ai_photo_url: string | null;
  ai_description: string | null;
  assessment_mode: 'category' | 'ai_photo';
}

export interface LogbookEntry {
  id: string;
  user_id: string;
  project_id: string | null;
  title: string;
  category_id: string;
  notes: string | null;
  cost: number | null;
  labor_type: LaborType;
  photo_urls: string[];
  xp_awarded: number;
  repair_date: string;
  created_at: string;
  updated_at: string;
}

export interface ToolboxItem {
  id: string;
  user_id: string;
  tool_id: string;
  tool_name: string;
  category: string;
  notes: string | null;
  added_at: string;
}

export interface Friendship {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
  updated_at: string;
}

export interface FeatureFlag {
  id: string;
  flag_name: string;
  is_enabled: boolean;
  description: string | null;
  updated_by: string | null;
  updated_at: string;
  created_at: string;
}

export interface DiagnosisResult {
  title: string;
  conf: number;
  xp: number;
  save: number;
  why: string;
  flags: string[];
  fq: IntakeQuestion[];
  diy: { lo: number; hi: number; hrs: number; time: string; risk: string };
  pro: { lo: number; hi: number; time: string; risk: string; note: string; script: string };
  tl: { phase: string; time: string }[];
  tools: Tool[];
  steps: { s: string; t: string; photo: boolean; tip: string }[];
  shop: ShopItem[];
  matEst: number;
}

export interface IntakeQuestion {
  q: string;
  opts: string[];
}

export type IntakeAnswer = Record<string, string>;

export interface Category {
  id: string;
  icon: string;
  label: string;
  sub: string;
  clr: string;
}

export interface Tool {
  n: string;
  e: string;
  r: string;
  tip: string;
}

export interface ShopItem {
  n: string;
  sz: string;
  pr: number;
  store: string;
  sku: string;
  stock: string;
  tag: string;
}

export interface Badge {
  id: string;
  label: string;
  icon: string;
  condition: string;
}

export interface SkillTree {
  id: string;
  label: string;
  icon: string;
  maxLevel: number;
}

export interface ToolDefinition {
  id: string;
  name: string;
  category: string;
  emoji: string;
}

export type Verdict = 'diy_easy' | 'diy_caution' | 'hire_pro';
export type LaborType = 'diy' | 'hired_pro' | 'warranty';

export type QuoteStatus = 'pending' | 'matched' | 'quoted' | 'accepted' | 'expired' | 'cancelled';
export type QuoteTimeline = 'asap' | 'this_week' | 'this_month' | 'flexible';
export type ContactPreference = 'in_app' | 'email' | 'phone';

export interface QuoteRequest {
  id: string;
  user_id: string;
  project_id: string | null;
  title: string;
  category_id: string;
  estimated_pro_lo: number | null;
  estimated_pro_hi: number | null;
  estimated_diy_lo: number | null;
  estimated_diy_hi: number | null;
  materials_json: unknown[];
  tools_json: unknown[];
  call_script: string;
  zip_code: string;
  preferred_timeline: QuoteTimeline;
  contact_preference: ContactPreference;
  contact_phone: string | null;
  notes: string | null;
  status: QuoteStatus;
  bid_count: number;
  created_at: string;
  updated_at: string;
}
