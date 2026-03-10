// ─── Maintenance Engine: Task Definitions ──────────────────────────────
// Comprehensive home maintenance task library with seasonal, monthly,
// quarterly, and annual tasks.

export type Season = 'spring' | 'summer' | 'fall' | 'winter';
export type Frequency = 'monthly' | 'quarterly' | 'seasonal' | 'annual';
export type Importance = 'critical' | 'important' | 'recommended';
export type TaskCategory =
  | 'hvac'
  | 'plumbing'
  | 'exterior'
  | 'interior'
  | 'safety'
  | 'landscaping'
  | 'electrical'
  | 'appliances'
  | 'roofing';

export interface MaintenanceTaskDef {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  season: Season | 'year_round';
  frequency: Frequency;
  /** Difficulty 1-5 */
  difficultyLevel: number;
  /** Estimated time like "15 min", "1-2 hrs" */
  timeEstimate: string;
  toolsNeeded: string[];
  importance: Importance;
  /** Emoji icon */
  icon: string;
  /** Home types this applies to — empty means all */
  applicableTo?: ('house' | 'condo' | 'townhouse')[];
  /** Systems this requires — e.g. "gas", "chimney", "septic" */
  requiresSystems?: string[];
}

export const TASK_CATEGORIES: Record<TaskCategory, { label: string; icon: string; color: string }> = {
  hvac: { label: 'HVAC', icon: '❄️', color: 'var(--info)' },
  plumbing: { label: 'Plumbing', icon: '🚿', color: 'var(--info)' },
  exterior: { label: 'Exterior', icon: '🏠', color: 'var(--gold)' },
  interior: { label: 'Interior', icon: '🏡', color: 'var(--accent)' },
  safety: { label: 'Safety', icon: '🔋', color: 'var(--danger)' },
  landscaping: { label: 'Landscaping', icon: '🌿', color: 'var(--emerald)' },
  electrical: { label: 'Electrical', icon: '⚡', color: 'var(--gold)' },
  appliances: { label: 'Appliances', icon: '🔌', color: 'var(--accent)' },
  roofing: { label: 'Roofing', icon: '🏗️', color: 'var(--gold)' },
};

export const SEASON_CONFIG: Record<Season, { label: string; icon: string; color: string; bgColor: string; months: number[] }> = {
  spring: { label: 'Spring', icon: '🌸', color: '#4CAF50', bgColor: 'rgba(76, 175, 80, 0.1)', months: [2, 3, 4] },
  summer: { label: 'Summer', icon: '☀️', color: '#FF9800', bgColor: 'rgba(255, 152, 0, 0.1)', months: [5, 6, 7] },
  fall: { label: 'Fall', icon: '🍂', color: '#E65100', bgColor: 'rgba(230, 81, 0, 0.1)', months: [8, 9, 10] },
  winter: { label: 'Winter', icon: '❄️', color: '#2196F3', bgColor: 'rgba(33, 150, 243, 0.1)', months: [11, 0, 1] },
};

export function getCurrentSeason(): Season {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
}

export function getFrequencyDays(frequency: Frequency): number {
  switch (frequency) {
    case 'monthly': return 30;
    case 'quarterly': return 90;
    case 'seasonal': return 90;
    case 'annual': return 365;
  }
}

export function getFrequencyLabel(frequency: Frequency): string {
  switch (frequency) {
    case 'monthly': return 'Every month';
    case 'quarterly': return 'Every 3 months';
    case 'seasonal': return 'Seasonal';
    case 'annual': return 'Once a year';
  }
}

// ─── Comprehensive Task Library ──────────────────────────────────────

export const MAINTENANCE_TASKS: MaintenanceTaskDef[] = [
  // ─── SPRING ─────────────────────────────────────────────
  {
    id: 'spring-hvac-filter',
    title: 'Replace HVAC Filter',
    description: 'Swap out the HVAC filter to improve airflow and air quality before cooling season. Check filter size printed on the frame.',
    category: 'hvac',
    season: 'spring',
    frequency: 'seasonal',
    difficultyLevel: 1,
    timeEstimate: '15 min',
    toolsNeeded: ['New filter (check size)'],
    importance: 'critical',
    icon: '🌡️',
  },
  {
    id: 'spring-gutter-cleaning',
    title: 'Clean Gutters & Downspouts',
    description: 'Remove debris from gutters and flush downspouts. Check for leaks at seams and ensure water flows freely to drainage.',
    category: 'exterior',
    season: 'spring',
    frequency: 'seasonal',
    difficultyLevel: 2,
    timeEstimate: '2-3 hrs',
    toolsNeeded: ['Ladder', 'Gloves', 'Garden hose', 'Gutter scoop'],
    importance: 'important',
    icon: '🌧️',
    applicableTo: ['house', 'townhouse'],
  },
  {
    id: 'spring-deck-inspection',
    title: 'Inspect Deck & Patio',
    description: 'Check for loose boards, protruding nails, rot, and structural integrity. Look for signs of insect damage. Test railing stability.',
    category: 'exterior',
    season: 'spring',
    frequency: 'seasonal',
    difficultyLevel: 1,
    timeEstimate: '30 min',
    toolsNeeded: ['Flashlight', 'Screwdriver (probe for rot)'],
    importance: 'important',
    icon: '🪵',
    applicableTo: ['house', 'townhouse'],
  },
  {
    id: 'spring-exterior-paint',
    title: 'Check Exterior Paint & Caulking',
    description: 'Walk the perimeter looking for peeling paint, cracked caulk around windows/doors, and gaps in siding. Touch up as needed.',
    category: 'exterior',
    season: 'spring',
    frequency: 'seasonal',
    difficultyLevel: 2,
    timeEstimate: '1-2 hrs',
    toolsNeeded: ['Caulk gun', 'Exterior caulk', 'Exterior paint', 'Brush'],
    importance: 'recommended',
    icon: '🎨',
    applicableTo: ['house', 'townhouse'],
  },
  {
    id: 'spring-lawn-mower',
    title: 'Service Lawn Mower',
    description: 'Change oil, replace spark plug, sharpen or replace blade, clean air filter. Fresh gas with stabilizer.',
    category: 'landscaping',
    season: 'spring',
    frequency: 'seasonal',
    difficultyLevel: 2,
    timeEstimate: '1-2 hrs',
    toolsNeeded: ['Wrench set', 'New oil', 'Spark plug', 'Blade sharpener'],
    importance: 'recommended',
    icon: '🌿',
    applicableTo: ['house', 'townhouse'],
  },
  {
    id: 'spring-window-screens',
    title: 'Check Window Screens',
    description: 'Inspect all window screens for tears, holes, and bent frames. Repair or replace damaged screens before bug season.',
    category: 'interior',
    season: 'spring',
    frequency: 'seasonal',
    difficultyLevel: 1,
    timeEstimate: '30-60 min',
    toolsNeeded: ['Screen repair kit', 'Utility knife'],
    importance: 'recommended',
    icon: '🪟',
  },
  {
    id: 'spring-ac-service',
    title: 'Professional AC Service',
    description: 'Schedule a professional HVAC tune-up before cooling season. They will check refrigerant, clean coils, and test electrical connections.',
    category: 'hvac',
    season: 'spring',
    frequency: 'seasonal',
    difficultyLevel: 1,
    timeEstimate: '1 hr (pro visit)',
    toolsNeeded: [],
    importance: 'critical',
    icon: '❄️',
  },

  // ─── SUMMER ─────────────────────────────────────────────
  {
    id: 'summer-deck-sealing',
    title: 'Seal or Stain Deck',
    description: 'Apply waterproof sealant or stain to deck after cleaning. Protects wood from UV, moisture, and extends lifespan by years.',
    category: 'exterior',
    season: 'summer',
    frequency: 'seasonal',
    difficultyLevel: 3,
    timeEstimate: '4-6 hrs',
    toolsNeeded: ['Pressure washer', 'Deck stain/sealer', 'Roller', 'Brush', 'Painters tape'],
    importance: 'important',
    icon: '🪵',
    applicableTo: ['house', 'townhouse'],
  },
  {
    id: 'summer-fence-inspection',
    title: 'Inspect & Repair Fence',
    description: 'Check fence posts for rot or leaning. Tighten loose boards, replace broken ones, and check gate hardware.',
    category: 'exterior',
    season: 'summer',
    frequency: 'seasonal',
    difficultyLevel: 2,
    timeEstimate: '1-3 hrs',
    toolsNeeded: ['Hammer', 'Screwdriver', 'Level', 'Wood screws'],
    importance: 'recommended',
    icon: '🏡',
    applicableTo: ['house', 'townhouse'],
  },
  {
    id: 'summer-exterior-wash',
    title: 'Pressure Wash Exterior',
    description: 'Wash siding, driveway, walkways, and patio. Remove mildew, dirt, and stains. Use low pressure near windows.',
    category: 'exterior',
    season: 'summer',
    frequency: 'seasonal',
    difficultyLevel: 2,
    timeEstimate: '3-4 hrs',
    toolsNeeded: ['Pressure washer', 'Exterior cleaner', 'Safety glasses'],
    importance: 'recommended',
    icon: '💦',
    applicableTo: ['house', 'townhouse'],
  },
  {
    id: 'summer-landscape-trim',
    title: 'Trim Trees & Shrubs',
    description: 'Prune overgrown branches away from the house (6+ inch clearance). Trim hedges. Remove dead branches.',
    category: 'landscaping',
    season: 'summer',
    frequency: 'seasonal',
    difficultyLevel: 2,
    timeEstimate: '2-4 hrs',
    toolsNeeded: ['Pruning shears', 'Loppers', 'Hedge trimmer', 'Ladder'],
    importance: 'important',
    icon: '🌳',
    applicableTo: ['house', 'townhouse'],
  },
  {
    id: 'summer-pest-inspection',
    title: 'Pest Inspection',
    description: 'Check foundation, attic, and crawl spaces for signs of pests. Look for droppings, gnaw marks, mud tubes (termites), and nesting.',
    category: 'interior',
    season: 'summer',
    frequency: 'seasonal',
    difficultyLevel: 1,
    timeEstimate: '30-60 min',
    toolsNeeded: ['Flashlight', 'Gloves'],
    importance: 'important',
    icon: '🪳',
  },

  // ─── FALL ───────────────────────────────────────────────
  {
    id: 'fall-furnace-inspection',
    title: 'Professional Furnace Inspection',
    description: 'Schedule a professional furnace tune-up before heating season. Includes burner inspection, heat exchanger check, and safety tests.',
    category: 'hvac',
    season: 'fall',
    frequency: 'seasonal',
    difficultyLevel: 1,
    timeEstimate: '1 hr (pro visit)',
    toolsNeeded: [],
    importance: 'critical',
    icon: '🔥',
  },
  {
    id: 'fall-weatherstripping',
    title: 'Replace Weatherstripping',
    description: 'Check weatherstripping on all exterior doors and windows. Replace worn or compressed strips. Significant energy savings.',
    category: 'interior',
    season: 'fall',
    frequency: 'seasonal',
    difficultyLevel: 2,
    timeEstimate: '1-2 hrs',
    toolsNeeded: ['Weatherstripping', 'Utility knife', 'Scissors', 'Tape measure'],
    importance: 'important',
    icon: '🌬️',
  },
  {
    id: 'fall-gutter-guard',
    title: 'Clean Gutters After Leaf Fall',
    description: 'Final gutter cleaning after leaves are down. Install or check gutter guards. Ensure downspouts direct water away from foundation.',
    category: 'exterior',
    season: 'fall',
    frequency: 'seasonal',
    difficultyLevel: 2,
    timeEstimate: '2-3 hrs',
    toolsNeeded: ['Ladder', 'Gloves', 'Garden hose', 'Gutter scoop'],
    importance: 'critical',
    icon: '🍂',
    applicableTo: ['house', 'townhouse'],
  },
  {
    id: 'fall-pipe-insulation',
    title: 'Insulate Exposed Pipes',
    description: 'Wrap pipe insulation on exposed water lines in unheated areas (garage, crawl space, attic). Prevents costly freeze damage.',
    category: 'plumbing',
    season: 'fall',
    frequency: 'seasonal',
    difficultyLevel: 1,
    timeEstimate: '1-2 hrs',
    toolsNeeded: ['Pipe insulation foam', 'Duct tape', 'Utility knife'],
    importance: 'critical',
    icon: '🧊',
    applicableTo: ['house', 'townhouse'],
  },
  {
    id: 'fall-leaf-cleanup',
    title: 'Fall Leaf Cleanup',
    description: 'Rake or blow leaves from lawn, flower beds, and drainage areas. Heavy leaf cover smothers grass and harbors pests.',
    category: 'landscaping',
    season: 'fall',
    frequency: 'seasonal',
    difficultyLevel: 1,
    timeEstimate: '2-4 hrs',
    toolsNeeded: ['Leaf blower or rake', 'Yard bags'],
    importance: 'important',
    icon: '🍁',
    applicableTo: ['house', 'townhouse'],
  },
  {
    id: 'fall-chimney-inspection',
    title: 'Chimney Inspection & Cleaning',
    description: 'Have chimney inspected and swept before fireplace season. Check for creosote buildup, cracks, and cap condition.',
    category: 'interior',
    season: 'fall',
    frequency: 'seasonal',
    difficultyLevel: 1,
    timeEstimate: '1 hr (pro visit)',
    toolsNeeded: [],
    importance: 'critical',
    icon: '🏠',
    requiresSystems: ['chimney'],
  },

  // ─── WINTER ─────────────────────────────────────────────
  {
    id: 'winter-pipe-freeze',
    title: 'Pipe Freeze Prevention',
    description: 'During extreme cold, open cabinet doors under sinks, let faucets drip slightly, and disconnect outdoor hoses.',
    category: 'plumbing',
    season: 'winter',
    frequency: 'seasonal',
    difficultyLevel: 1,
    timeEstimate: '15-30 min',
    toolsNeeded: [],
    importance: 'critical',
    icon: '🧊',
  },
  {
    id: 'winter-snow-equipment',
    title: 'Check Snow Equipment',
    description: 'Service snow blower (oil, spark plug, auger). Stock up on ice melt. Check snow shovel condition.',
    category: 'exterior',
    season: 'winter',
    frequency: 'seasonal',
    difficultyLevel: 1,
    timeEstimate: '30-60 min',
    toolsNeeded: ['Snow blower manual', 'Oil', 'Spark plug'],
    importance: 'important',
    icon: '🌨️',
    applicableTo: ['house', 'townhouse'],
  },
  {
    id: 'winter-thermostat',
    title: 'Thermostat Optimization',
    description: 'Program thermostat for winter schedule: 68F when home, 62F sleeping, 58F away. Each degree saves 1-3% on heating.',
    category: 'hvac',
    season: 'winter',
    frequency: 'seasonal',
    difficultyLevel: 1,
    timeEstimate: '15 min',
    toolsNeeded: [],
    importance: 'recommended',
    icon: '🌡️',
  },
  {
    id: 'winter-humidity',
    title: 'Check Indoor Humidity',
    description: 'Winter air is dry. Aim for 30-50% humidity. Low humidity causes wood cracking, static, and respiratory issues.',
    category: 'interior',
    season: 'winter',
    frequency: 'seasonal',
    difficultyLevel: 1,
    timeEstimate: '10 min',
    toolsNeeded: ['Hygrometer'],
    importance: 'recommended',
    icon: '💧',
  },
  {
    id: 'winter-co-detector',
    title: 'Carbon Monoxide Detector Test',
    description: 'Test all CO detectors. Replace batteries if needed. Critical during heating season when gas appliances run continuously.',
    category: 'safety',
    season: 'winter',
    frequency: 'seasonal',
    difficultyLevel: 1,
    timeEstimate: '10 min',
    toolsNeeded: ['Batteries (9V or AA)'],
    importance: 'critical',
    icon: '🔋',
  },

  // ─── YEAR-ROUND: MONTHLY ───────────────────────────────
  {
    id: 'monthly-hvac-filter',
    title: 'Check HVAC Filter',
    description: 'Inspect HVAC filter monthly. Replace if dirty (every 1-3 months depending on type). Dirty filters raise energy bills 5-15%.',
    category: 'hvac',
    season: 'year_round',
    frequency: 'monthly',
    difficultyLevel: 1,
    timeEstimate: '5 min',
    toolsNeeded: ['Replacement filter'],
    importance: 'critical',
    icon: '🌡️',
  },
  {
    id: 'monthly-smoke-test',
    title: 'Test Smoke Detectors',
    description: 'Press test button on every smoke detector. Replace batteries in units with low-battery chirps. Replace units older than 10 years.',
    category: 'safety',
    season: 'year_round',
    frequency: 'monthly',
    difficultyLevel: 1,
    timeEstimate: '10 min',
    toolsNeeded: ['Step stool', 'Batteries'],
    importance: 'critical',
    icon: '🔋',
  },
  {
    id: 'monthly-drain-clearing',
    title: 'Clear Drains',
    description: 'Remove hair and debris from bathroom drains. Flush kitchen drain with hot water and baking soda. Prevents costly clogs.',
    category: 'plumbing',
    season: 'year_round',
    frequency: 'monthly',
    difficultyLevel: 1,
    timeEstimate: '15 min',
    toolsNeeded: ['Drain snake or zip tool', 'Baking soda', 'Vinegar'],
    importance: 'recommended',
    icon: '🚿',
  },

  // ─── YEAR-ROUND: QUARTERLY ─────────────────────────────
  {
    id: 'quarterly-water-heater',
    title: 'Flush Water Heater',
    description: 'Drain a few gallons from water heater to remove sediment. Check temperature is set to 120F. Inspect anode rod annually.',
    category: 'plumbing',
    season: 'year_round',
    frequency: 'quarterly',
    difficultyLevel: 2,
    timeEstimate: '30-45 min',
    toolsNeeded: ['Garden hose', 'Bucket', 'Wrench'],
    importance: 'important',
    icon: '💧',
  },
  {
    id: 'quarterly-fire-extinguisher',
    title: 'Check Fire Extinguishers',
    description: 'Verify gauge is in the green zone, pin is intact, and nozzle is clear. Ensure one on each floor and in the kitchen.',
    category: 'safety',
    season: 'year_round',
    frequency: 'quarterly',
    difficultyLevel: 1,
    timeEstimate: '5 min',
    toolsNeeded: [],
    importance: 'critical',
    icon: '🧯',
  },
  {
    id: 'quarterly-caulk',
    title: 'Inspect Caulking',
    description: 'Check caulk around tubs, showers, sinks, and windows. Re-caulk any cracked, peeling, or missing areas to prevent water damage.',
    category: 'plumbing',
    season: 'year_round',
    frequency: 'quarterly',
    difficultyLevel: 2,
    timeEstimate: '30-60 min',
    toolsNeeded: ['Caulk gun', 'Silicone caulk', 'Caulk remover', 'Utility knife'],
    importance: 'important',
    icon: '🛁',
  },

  // ─── YEAR-ROUND: ANNUAL ────────────────────────────────
  {
    id: 'annual-roof-inspection',
    title: 'Roof Inspection',
    description: 'Inspect roof for missing/damaged shingles, flashing issues, and sagging. Check from ground with binoculars or hire a pro for a full report.',
    category: 'roofing',
    season: 'year_round',
    frequency: 'annual',
    difficultyLevel: 2,
    timeEstimate: '30-60 min',
    toolsNeeded: ['Binoculars', 'Ladder (optional)'],
    importance: 'critical',
    icon: '🏗️',
    applicableTo: ['house', 'townhouse'],
  },
  {
    id: 'annual-foundation-check',
    title: 'Foundation Inspection',
    description: 'Walk around foundation looking for cracks wider than 1/4 inch, water stains, or efflorescence (white powder). Check grading slopes away from house.',
    category: 'exterior',
    season: 'year_round',
    frequency: 'annual',
    difficultyLevel: 1,
    timeEstimate: '30 min',
    toolsNeeded: ['Flashlight'],
    importance: 'critical',
    icon: '🧱',
    applicableTo: ['house', 'townhouse'],
  },
  {
    id: 'annual-water-heater-service',
    title: 'Water Heater Annual Service',
    description: 'Full service: check anode rod (replace if less than 50% remaining), flush tank completely, inspect T&P valve, check for leaks.',
    category: 'plumbing',
    season: 'year_round',
    frequency: 'annual',
    difficultyLevel: 3,
    timeEstimate: '1-2 hrs',
    toolsNeeded: ['Socket wrench', 'Garden hose', 'Bucket', 'Anode rod (if needed)'],
    importance: 'important',
    icon: '💧',
  },
  {
    id: 'annual-sump-pump',
    title: 'Test Sump Pump',
    description: 'Pour water into the sump pit until the pump activates. Verify it pumps water out and shuts off. Check backup battery if equipped.',
    category: 'plumbing',
    season: 'year_round',
    frequency: 'annual',
    difficultyLevel: 1,
    timeEstimate: '15 min',
    toolsNeeded: ['Bucket of water'],
    importance: 'critical',
    icon: '🚰',
    applicableTo: ['house'],
    requiresSystems: ['sump_pump'],
  },
  {
    id: 'annual-dryer-vent',
    title: 'Clean Dryer Vent',
    description: 'Disconnect dryer and clean entire vent run to exterior. Lint buildup is the #1 cause of house fires. Hire a pro if vent is long or complex.',
    category: 'safety',
    season: 'year_round',
    frequency: 'annual',
    difficultyLevel: 2,
    timeEstimate: '1-2 hrs',
    toolsNeeded: ['Dryer vent brush kit', 'Vacuum', 'Screwdriver'],
    importance: 'critical',
    icon: '🧹',
  },
  {
    id: 'annual-gfci-test',
    title: 'Test GFCI Outlets',
    description: 'Press test/reset on all GFCI outlets (kitchen, bathroom, garage, outdoor). Replace any that fail to trip. Required by code in wet areas.',
    category: 'electrical',
    season: 'year_round',
    frequency: 'annual',
    difficultyLevel: 1,
    timeEstimate: '15 min',
    toolsNeeded: ['GFCI tester (optional)'],
    importance: 'important',
    icon: '⚡',
  },
  {
    id: 'annual-garage-door',
    title: 'Service Garage Door',
    description: 'Lubricate hinges, rollers, and tracks. Test auto-reverse safety by placing a 2x4 under the door. Check weather seal.',
    category: 'exterior',
    season: 'year_round',
    frequency: 'annual',
    difficultyLevel: 1,
    timeEstimate: '30 min',
    toolsNeeded: ['Silicone spray lubricant', '2x4 board'],
    importance: 'important',
    icon: '🚗',
    applicableTo: ['house', 'townhouse'],
  },
  {
    id: 'annual-septic-inspection',
    title: 'Septic System Inspection',
    description: 'Have septic tank inspected and pumped if needed (typically every 3-5 years). Check for signs of system failure in drain field.',
    category: 'plumbing',
    season: 'year_round',
    frequency: 'annual',
    difficultyLevel: 1,
    timeEstimate: '1 hr (pro visit)',
    toolsNeeded: [],
    importance: 'critical',
    icon: '🕳️',
    requiresSystems: ['septic'],
  },
];

// ─── Home Setup Types ─────────────────────────────────────────────────

export type HomeType = 'house' | 'condo' | 'townhouse';

export interface HomeProfile {
  homeType: HomeType;
  homeAge: 'new' | '1-10' | '10-25' | '25-50' | '50+';
  heatingType: 'gas' | 'electric' | 'heat_pump' | 'oil';
  hasAC: boolean;
  hasChimney: boolean;
  hasSeptic: boolean;
  hasSumpPump: boolean;
  hasGarage: boolean;
  hasDeck: boolean;
  hasYard: boolean;
}

/**
 * Filter tasks based on home profile. Removes tasks that don't apply
 * to the user's home type or missing systems.
 */
export function filterTasksForHome(profile: HomeProfile): MaintenanceTaskDef[] {
  return MAINTENANCE_TASKS.filter((task) => {
    // Check home type applicability
    if (task.applicableTo && task.applicableTo.length > 0) {
      if (!task.applicableTo.includes(profile.homeType)) return false;
    }

    // Check required systems
    if (task.requiresSystems) {
      for (const sys of task.requiresSystems) {
        if (sys === 'chimney' && !profile.hasChimney) return false;
        if (sys === 'septic' && !profile.hasSeptic) return false;
        if (sys === 'sump_pump' && !profile.hasSumpPump) return false;
      }
    }

    // Skip deck tasks if no deck
    if (task.id.includes('deck') && !profile.hasDeck) return false;

    // Skip yard/landscaping tasks if no yard
    if (task.category === 'landscaping' && !profile.hasYard) return false;

    // Skip garage tasks if no garage
    if (task.id.includes('garage') && !profile.hasGarage) return false;

    return true;
  });
}

/**
 * Calculate the next due date based on frequency.
 */
export function calculateNextDueDate(frequency: Frequency, fromDate?: Date): Date {
  const from = fromDate || new Date();
  const days = getFrequencyDays(frequency);
  const next = new Date(from);
  next.setDate(next.getDate() + days);
  return next;
}

/**
 * Determine urgency status based on due date.
 */
export function getUrgencyStatus(nextDue: Date | string): 'overdue' | 'due_soon' | 'upcoming' | 'on_track' {
  const now = new Date();
  const due = typeof nextDue === 'string' ? new Date(nextDue) : nextDue;
  const daysUntil = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntil < 0) return 'overdue';
  if (daysUntil <= 7) return 'due_soon';
  if (daysUntil <= 30) return 'upcoming';
  return 'on_track';
}

/**
 * Calculate home health score from task statuses.
 */
export function calculateHomeHealthScore(
  tasks: Array<{ next_due_at: string | null; is_dismissed: boolean; last_completed_at: string | null }>
): number {
  const activeTasks = tasks.filter((t) => !t.is_dismissed);
  if (activeTasks.length === 0) return 100;

  let score = 0;
  for (const task of activeTasks) {
    if (!task.next_due_at) {
      score += 100;
      continue;
    }
    const status = getUrgencyStatus(task.next_due_at);
    switch (status) {
      case 'on_track': score += 100; break;
      case 'upcoming': score += 85; break;
      case 'due_soon': score += 50; break;
      case 'overdue': score += 0; break;
    }
  }

  return Math.round(score / activeTasks.length);
}
