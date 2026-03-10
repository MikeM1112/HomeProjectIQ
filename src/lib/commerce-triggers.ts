/**
 * Contextual Commerce Engine
 *
 * Maps user actions to relevant partner offers using the "Gratitude Test":
 * Would the homeowner thank us for showing this? If no, don't show it.
 *
 * Revenue model: CPA-first (pay per conversion), never CPM banner ads.
 */

export interface PartnerOffer {
  id: string;
  partner: string;
  headline: string;
  description: string;
  cta: string;
  href: string;
  cpaRange: string;
  icon: string;
  tier: 'high' | 'medium' | 'standard';
}

export interface TriggerContext {
  categoryId?: string;
  verdict?: 'diy_easy' | 'diy_caution' | 'hire_pro';
  confidence?: number;
  estimatedCostDiy?: number; // cents
  estimatedCostPro?: number; // cents
  toolsNeeded?: string[];
  toolsOwned?: string[];
  userLevel?: number;
  season?: 'spring' | 'summer' | 'fall' | 'winter';
}

// ── Partner Offers Database ──

const MATERIAL_OFFERS: PartnerOffer[] = [
  {
    id: 'hd-pro',
    partner: 'Home Depot',
    headline: 'Get everything you need',
    description: 'Free delivery on orders over $45. Pro Xtra members save more.',
    cta: 'Shop at Home Depot',
    href: 'https://www.homedepot.com',
    cpaRange: '2-8%',
    icon: '🏠',
    tier: 'high',
  },
  {
    id: 'lowes',
    partner: "Lowe's",
    headline: 'Materials ready for pickup',
    description: "Buy online, pick up in store. Lowe's MVP rewards earn 5% back.",
    cta: "Shop at Lowe's",
    href: 'https://www.lowes.com',
    cpaRange: '2-6%',
    icon: '🔵',
    tier: 'high',
  },
  {
    id: 'amazon-home',
    partner: 'Amazon',
    headline: 'Get it tomorrow',
    description: 'Prime members get free next-day delivery on most items.',
    cta: 'Shop on Amazon',
    href: 'https://www.amazon.com',
    cpaRange: '3-4%',
    icon: '📦',
    tier: 'medium',
  },
];

const TOOL_OFFERS: PartnerOffer[] = [
  {
    id: 'hd-rental',
    partner: 'Home Depot Tool Rental',
    headline: "Don't buy — rent it",
    description: 'Rent pro-grade tools by the hour or day. No commitment.',
    cta: 'Browse Rentals',
    href: 'https://www.homedepot.com/c/tool_and_vehicle_rental',
    cpaRange: '$8-20/booking',
    icon: '🔧',
    tier: 'high',
  },
  {
    id: 'milwaukee',
    partner: 'Milwaukee Tool',
    headline: 'Level up your toolkit',
    description: 'Professional-grade power tools with industry-leading warranties.',
    cta: 'Shop Milwaukee',
    href: 'https://www.milwaukeetool.com',
    cpaRange: '$5-15',
    icon: '🔴',
    tier: 'medium',
  },
];

const PRO_SERVICE_OFFERS: PartnerOffer[] = [
  {
    id: 'angi',
    partner: 'Angi',
    headline: 'Get matched with vetted pros',
    description: 'Pre-screened, background-checked professionals in your area.',
    cta: 'Find a Pro on Angi',
    href: 'https://www.angi.com',
    cpaRange: '$15-40/lead',
    icon: '🔶',
    tier: 'high',
  },
  {
    id: 'thumbtack',
    partner: 'Thumbtack',
    headline: 'Compare quotes from local pros',
    description: 'Get free estimates from top-rated professionals nearby.',
    cta: 'Get Free Quotes',
    href: 'https://www.thumbtack.com',
    cpaRange: '$10-30/lead',
    icon: '📌',
    tier: 'high',
  },
  {
    id: 'taskrabbit',
    partner: 'TaskRabbit',
    headline: 'Book a Tasker today',
    description: 'Same-day booking for handyman tasks and small repairs.',
    cta: 'Book a Tasker',
    href: 'https://www.taskrabbit.com',
    cpaRange: '$5-15/booking',
    icon: '🐰',
    tier: 'medium',
  },
];

const INSURANCE_OFFERS: PartnerOffer[] = [
  {
    id: 'hippo',
    partner: 'Hippo Insurance',
    headline: 'Is your home covered?',
    description: 'Smart home insurance with proactive protection. Get a quote in 60 seconds.',
    cta: 'Get a Quote',
    href: 'https://www.hippo.com',
    cpaRange: '$25-75/policy',
    icon: '🦛',
    tier: 'high',
  },
  {
    id: 'ahs',
    partner: 'American Home Shield',
    headline: 'Home warranty protection',
    description: 'Cover major systems and appliances. Plans from $29/month.',
    cta: 'See Plans',
    href: 'https://www.ahs.com',
    cpaRange: '$30-60/policy',
    icon: '🛡️',
    tier: 'high',
  },
];

const FINANCING_OFFERS: PartnerOffer[] = [
  {
    id: 'affirm',
    partner: 'Affirm',
    headline: 'Pay over time, 0% APR',
    description: 'Split your project costs into easy monthly payments.',
    cta: 'Check Your Rate',
    href: 'https://www.affirm.com',
    cpaRange: '$10-25/origination',
    icon: '💳',
    tier: 'high',
  },
  {
    id: 'sofi',
    partner: 'SoFi Home Improvement',
    headline: 'Finance your project',
    description: 'Home improvement loans from $5K-$100K. No fees, fixed rates.',
    cta: 'See Your Rate',
    href: 'https://www.sofi.com/home-improvement-loans',
    cpaRange: '$25-60/origination',
    icon: '🏦',
    tier: 'high',
  },
];

const EDUCATION_OFFERS: PartnerOffer[] = [
  {
    id: 'toh',
    partner: 'This Old House',
    headline: 'Learn from the experts',
    description: 'Step-by-step video guides from the most trusted name in home improvement.',
    cta: 'Start Learning',
    href: 'https://www.thisoldhouse.com/insider',
    cpaRange: '$5-10/sub',
    icon: '📺',
    tier: 'medium',
  },
];

// ── Trigger Engine ──

/**
 * Get relevant partner offers based on the current context.
 * Returns offers ordered by relevance, max 3.
 */
export function getContextualOffers(context: TriggerContext): PartnerOffer[] {
  const offers: PartnerOffer[] = [];

  // Verdict-based triggers
  if (context.verdict === 'hire_pro' || (context.confidence && context.confidence < 70)) {
    // High-value: user needs a professional
    offers.push(...PRO_SERVICE_OFFERS);

    // If expensive project, suggest insurance/warranty
    if (context.estimatedCostPro && context.estimatedCostPro > 200000) {
      offers.push(...INSURANCE_OFFERS);
    }
  }

  if (context.verdict === 'diy_easy' || context.verdict === 'diy_caution') {
    // User will DIY — show materials and tools
    offers.push(...MATERIAL_OFFERS);

    // If user is missing tools, suggest tool offers
    if (context.toolsNeeded && context.toolsOwned) {
      const missing = context.toolsNeeded.filter((t) => !context.toolsOwned!.includes(t));
      if (missing.length > 0) {
        offers.push(...TOOL_OFFERS);
      }
    }
  }

  // Cost-based triggers
  if (context.estimatedCostDiy && context.estimatedCostDiy > 200000) {
    // Project costs > $2,000 — financing makes sense
    offers.push(...FINANCING_OFFERS);
  }

  // Skill-based triggers
  if (context.userLevel && context.userLevel <= 2) {
    // Beginner — education offers
    offers.push(...EDUCATION_OFFERS);
  }

  // Category-specific triggers
  if (context.categoryId) {
    const electricalCategories = ['electric'];
    const hvacCategories = ['hvac'];
    const roofingCategories = ['roofing'];

    if (electricalCategories.includes(context.categoryId) ||
        hvacCategories.includes(context.categoryId) ||
        roofingCategories.includes(context.categoryId)) {
      // High-risk categories — always show pro option and insurance
      if (!offers.some((o) => o.id === 'angi')) {
        offers.push(PRO_SERVICE_OFFERS[0]); // Angi
      }
      if (!offers.some((o) => o.id === 'hippo')) {
        offers.push(INSURANCE_OFFERS[0]); // Hippo
      }
    }
  }

  // Deduplicate and limit to top 3
  const seen = new Set<string>();
  const unique = offers.filter((o) => {
    if (seen.has(o.id)) return false;
    seen.add(o.id);
    return true;
  });

  // Sort: high tier first, then medium, then standard
  const tierOrder = { high: 0, medium: 1, standard: 2 };
  unique.sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier]);

  return unique.slice(0, 3);
}

/**
 * Get the current season based on month.
 */
export function getCurrentSeason(): 'spring' | 'summer' | 'fall' | 'winter' {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
}

/**
 * Get seasonal maintenance offers.
 */
export function getSeasonalOffers(season: ReturnType<typeof getCurrentSeason>): PartnerOffer[] {
  const seasonalMap: Record<string, PartnerOffer> = {
    spring: {
      id: 'spring-hvac',
      partner: 'Home Depot',
      headline: 'Spring HVAC tune-up',
      description: 'Get your AC ready for summer. Schedule a pro tune-up.',
      cta: 'Book HVAC Service',
      href: 'https://www.homedepot.com/services/heating-cooling',
      cpaRange: '$15-30/booking',
      icon: '🌸',
      tier: 'medium',
    },
    summer: {
      id: 'summer-deck',
      partner: "Lowe's",
      headline: 'Deck & patio season',
      description: 'Everything for outdoor living — stains, furniture, grills.',
      cta: 'Shop Outdoor Living',
      href: 'https://www.lowes.com/l/outdoor-living',
      cpaRange: '2-6%',
      icon: '☀️',
      tier: 'medium',
    },
    fall: {
      id: 'fall-weatherize',
      partner: 'Home Depot',
      headline: 'Winterize your home',
      description: 'Insulation, weather stripping, and pipe protection before the cold hits.',
      cta: 'Shop Weatherization',
      href: 'https://www.homedepot.com/b/Building-Materials-Insulation',
      cpaRange: '2-8%',
      icon: '🍂',
      tier: 'medium',
    },
    winter: {
      id: 'winter-indoor',
      partner: 'Amazon',
      headline: 'Indoor project season',
      description: 'Perfect time for painting, tiling, and interior upgrades.',
      cta: 'Shop Project Supplies',
      href: 'https://www.amazon.com/home-improvement',
      cpaRange: '3-4%',
      icon: '❄️',
      tier: 'standard',
    },
  };

  return [seasonalMap[season]];
}
