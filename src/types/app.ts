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

export type ToolLoanStatus = 'out' | 'returned' | 'overdue';

export interface ToolLoan {
  id: string;
  user_id: string;
  tool_id: string;
  tool_name: string;
  tool_emoji: string;
  borrower_name: string;
  lent_date: string;
  return_date: string | null;
  due_date: string | null;
  status: ToolLoanStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
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

// ── Platform Architecture Types ──────────────────────────────

export type HouseholdRole = 'owner' | 'admin' | 'member';

export interface Household {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface HouseholdMember {
  id: string;
  household_id: string;
  user_id: string;
  role: HouseholdRole;
  joined_at: string;
}

export interface Property {
  id: string;
  household_id: string;
  name: string;
  address: string | null;
  home_type: string;
  year_built: number | null;
  square_footage: number | null;
  lot_size_sqft: number | null;
  floors: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export type ZoneType = 'interior' | 'exterior' | 'garage' | 'yard' | 'roof' | 'basement' | 'attic';

export interface PropertyZone {
  id: string;
  property_id: string;
  name: string;
  zone_type: ZoneType;
  floor_number: number | null;
  notes: string | null;
  created_at: string;
}

export type SystemType = 'hvac' | 'plumbing' | 'electrical' | 'roofing' | 'foundation' | 'appliance' | 'exterior' | 'interior' | 'landscaping' | 'security' | 'other';
export type ConditionLevel = 'excellent' | 'good' | 'fair' | 'poor' | 'critical';

export interface HomeSystem {
  id: string;
  property_id: string;
  name: string;
  system_type: SystemType;
  brand: string | null;
  model: string | null;
  install_date: string | null;
  warranty_expiry: string | null;
  expected_lifespan_years: number | null;
  condition: ConditionLevel;
  last_serviced_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SystemComponent {
  id: string;
  system_id: string;
  name: string;
  component_type: string | null;
  brand: string | null;
  model: string | null;
  serial_number: string | null;
  install_date: string | null;
  warranty_expiry: string | null;
  condition: ConditionLevel;
  notes: string | null;
  created_at: string;
}

export type GuidedSessionStatus = 'active' | 'paused' | 'completed' | 'abandoned';

export interface GuidedSession {
  id: string;
  project_id: string;
  user_id: string;
  status: GuidedSessionStatus;
  current_step: number;
  total_steps: number;
  started_at: string;
  completed_at: string | null;
  paused_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type ValidationStatus = 'pending' | 'passed' | 'failed' | 'skipped';

export interface StepCheckpoint {
  id: string;
  session_id: string;
  step_number: number;
  title: string;
  instructions: string | null;
  photo_url: string | null;
  ai_validation_status: ValidationStatus;
  ai_feedback: string | null;
  completed_at: string | null;
  created_at: string;
}

export type ToolSource = 'owned' | 'borrow' | 'purchase' | 'rent';

export interface ProjectRequiredTool {
  id: string;
  project_id: string;
  tool_id: string;
  tool_name: string;
  is_owned: boolean;
  is_borrowable: boolean;
  source: ToolSource | null;
  created_at: string;
}

export interface HandyProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  bio: string | null;
  skills: string[];
  rating: number;
  total_reviews: number;
  tools_lent_count: number;
  repairs_helped: number;
  is_available: boolean;
  latitude: number | null;
  longitude: number | null;
  neighborhood: string | null;
  created_at: string;
  updated_at: string;
}

export type TimelineEventType = 'repair' | 'maintenance' | 'inspection' | 'purchase' | 'warranty' | 'incident' | 'upgrade' | 'other';

export interface TimelineEvent {
  id: string;
  user_id: string;
  property_id: string | null;
  project_id: string | null;
  event_type: TimelineEventType;
  title: string;
  description: string | null;
  cost: number | null;
  photo_urls: string[];
  metadata: Record<string, unknown>;
  event_date: string;
  created_at: string;
}

export type DocumentType = 'receipt' | 'warranty' | 'manual' | 'inspection_report' | 'insurance' | 'permit' | 'contract' | 'photo' | 'other';

export interface HomeDocument {
  id: string;
  user_id: string;
  property_id: string | null;
  document_type: DocumentType;
  title: string;
  description: string | null;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  metadata: Record<string, unknown>;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export type CapabilityLevel = 'beginner' | 'developing' | 'capable' | 'proficient' | 'expert';

export interface CapabilityScore {
  id: string;
  user_id: string;
  property_id: string | null;
  overall_score: number;
  tool_readiness: number;
  repair_experience: number;
  maintenance_completion: number;
  documentation_score: number;
  emergency_preparedness: number;
  capability_level: CapabilityLevel;
  suggestions: unknown[];
  calculated_at: string;
  created_at: string;
}

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface RiskScore {
  id: string;
  user_id: string;
  property_id: string | null;
  system_id: string | null;
  system_type: string;
  risk_level: RiskLevel;
  risk_score: number;
  failure_probability: number | null;
  estimated_repair_cost: number | null;
  time_to_failure_days: number | null;
  contributing_factors: unknown[];
  calculated_at: string;
  created_at: string;
}

export type AlertType = 'risk' | 'maintenance' | 'warranty' | 'weather' | 'system' | 'recommendation';
export type AlertSeverity = 'info' | 'warning' | 'urgent' | 'critical';

export interface Alert {
  id: string;
  user_id: string;
  property_id: string | null;
  alert_type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  action_url: string | null;
  is_read: boolean;
  is_dismissed: boolean;
  metadata: Record<string, unknown>;
  expires_at: string | null;
  created_at: string;
}

export type RecommendationType = 'preventative' | 'upgrade' | 'repair' | 'maintenance' | 'efficiency' | 'safety';
export type RecommendationPriority = 'low' | 'medium' | 'high' | 'urgent';
export type DifficultyLevel = 'easy' | 'moderate' | 'hard' | 'professional';

export interface Recommendation {
  id: string;
  user_id: string;
  property_id: string | null;
  recommendation_type: RecommendationType;
  priority: RecommendationPriority;
  title: string;
  description: string;
  estimated_cost_lo: number | null;
  estimated_cost_hi: number | null;
  estimated_savings: number | null;
  difficulty: DifficultyLevel | null;
  is_completed: boolean;
  is_dismissed: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// --- AI Engine Types ---

export type ToolReadinessLevel = 'FULLY_READY' | 'PARTIALLY_READY' | 'NOT_READY';

export interface ToolReadinessResult {
  readiness: ToolReadinessLevel;
  required: string[];
  owned: string[];
  borrowable: { tool_id: string; from: string[] }[];
  missing: string[];
  readiness_percent: number;
}

export type DIYRecommendation = 'DIY' | 'HIRE_PRO' | 'CONSIDER_BOTH';

export interface DIYDecisionResult {
  recommendation: DIYRecommendation;
  reasoning: string[];
  diy_cost: {
    materials: number;
    tools: number;
    time_value: number;
    total: number;
  };
  pro_cost: {
    low: number;
    high: number;
    average: number;
  };
  savings: number;
  factors: {
    difficulty: number;
    skill_factor: number;
    tool_readiness: number;
    safety_ok: boolean;
  };
}

export type StepValidationStatus =
  | 'STEP_COMPLETE'
  | 'STEP_INCOMPLETE'
  | 'STEP_INCORRECT'
  | 'UNEXPECTED_CONDITION'
  | 'SAFETY_WARNING';

export interface StepValidationResult {
  status: StepValidationStatus;
  confidence: number;
  feedback: string;
  recommended_action: string | null;
  safety_warnings: string[];
  reroute: boolean;
  reroute_reason: string | null;
}

export type TrustLevel = 'low' | 'medium' | 'high';

export interface TrustScore {
  user_id: string;
  overall_score: number;
  lender: {
    score: number;
    total_loans: number;
    active_loans: number;
  };
  borrower: {
    score: number;
    total_loans: number;
    returned: number;
    on_time_percent: number;
  };
  trust_level: TrustLevel;
}
