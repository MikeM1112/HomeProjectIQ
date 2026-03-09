import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import { DIAGNOSES, CATEGORIES } from '@/lib/project-data';
import { XP_VALUES } from '@/lib/constants';
import { rateLimiters } from '@/lib/rate-limit';
import { z } from 'zod';
import type { Database } from '@/types/database';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
];

const userContextSchema = z.object({
  experience_level: z
    .enum(['none', 'beginner', 'intermediate', 'experienced'])
    .optional(),
  tools_owned: z.array(z.string()).optional(),
  home_age_years: z.number().nullable().optional(),
});

type Verdict = Database['public']['Tables']['projects']['Row']['verdict'];

interface AIAssessmentResult {
  title: string;
  confidence: number;
  verdict: 'diy_easy' | 'diy_caution' | 'hire_pro';
  why: string;
  flags: string[];
  estimated_diy_cost: { lo: number; hi: number };
  estimated_pro_cost: { lo: number; hi: number };
  estimated_time_hours: number;
  time_description: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  tools_needed: Array<{
    name: string;
    essential: boolean;
    estimated_cost: number;
  }>;
  steps: Array<{
    step: string;
    detail: string;
    safety_note: string | null;
  }>;
  materials_needed: Array<{
    name: string;
    estimated_cost: number;
    where_to_buy: string;
  }>;
  materials_total_estimate: number;
  safety_warnings: string[];
  when_to_call_pro: string;
  pro_script: string;
}

function buildPrompt(
  description: string,
  categoryLabel: string | null,
  userContext: z.infer<typeof userContextSchema> | null
): string {
  const contextParts: string[] = [];

  if (categoryLabel) {
    contextParts.push(`Category: ${categoryLabel}`);
  }

  if (userContext?.experience_level) {
    contextParts.push(`User experience level: ${userContext.experience_level}`);
  }

  if (userContext?.tools_owned && userContext.tools_owned.length > 0) {
    contextParts.push(
      `Tools the user already owns: ${userContext.tools_owned.join(', ')}`
    );
  }

  if (userContext?.home_age_years !== undefined && userContext.home_age_years !== null) {
    contextParts.push(`Home age: approximately ${userContext.home_age_years} years`);
  }

  const contextBlock =
    contextParts.length > 0
      ? `\n\nAdditional context:\n${contextParts.join('\n')}`
      : '';

  return `You are an expert home repair and maintenance advisor. A homeowner has submitted a photo of an issue along with a description. Analyze the photo and description to provide a thorough diagnosis and repair guide.

User's description: "${description}"${contextBlock}

Analyze the image carefully and return a JSON response with the following structure. Be practical, safety-conscious, and accurate with cost estimates (in US dollars as cents, e.g. 5000 = $50.00). Consider the user's experience level when determining the verdict.

Return ONLY valid JSON with no markdown formatting, no code blocks, no extra text. The response must match this exact structure:

{
  "title": "short descriptive title of the repair issue (max 60 chars)",
  "confidence": <number 0-100 representing how confident you are in the DIY feasibility>,
  "verdict": "<one of: diy_easy, diy_caution, hire_pro>",
  "why": "<1-2 sentence explanation of why you gave this verdict>",
  "flags": ["<safety concern or code requirement — list each one>"],
  "estimated_diy_cost": { "lo": <number in cents>, "hi": <number in cents> },
  "estimated_pro_cost": { "lo": <number in cents>, "hi": <number in cents> },
  "estimated_time_hours": <number>,
  "time_description": "<e.g. '2-3 hours' or '1 weekend'>",
  "difficulty_level": "<one of: beginner, intermediate, advanced, expert>",
  "tools_needed": [
    { "name": "<tool name>", "essential": <boolean>, "estimated_cost": <number in cents> }
  ],
  "steps": [
    { "step": "<brief step title>", "detail": "<detailed instruction>", "safety_note": "<safety note or null>" }
  ],
  "materials_needed": [
    { "name": "<material name>", "estimated_cost": <number in cents>, "where_to_buy": "<store name>" }
  ],
  "materials_total_estimate": <total materials cost in cents>,
  "safety_warnings": ["<each safety warning as a separate string>"],
  "when_to_call_pro": "<describe situations when a professional should be called instead>",
  "pro_script": "<a script the homeowner can use when calling a contractor to describe the issue professionally>"
}

Rules:
- All costs must be in cents (integer). For example, $150 = 15000.
- confidence should reflect DIY feasibility: 85+ = diy_easy, 70-84 = diy_caution, below 70 = hire_pro
- Include 4-8 detailed steps
- Include at least 2 tools and 2 materials
- Be specific about safety concerns, especially for electrical, plumbing, structural, or gas-related issues
- The pro_script should be conversational and help the homeowner sound knowledgeable`;
}

function mapAIResultToDiagnosis(result: AIAssessmentResult) {
  return {
    title: result.title,
    conf: result.confidence,
    xp: XP_VALUES.PROJECT_COMPLETE,
    save: result.estimated_pro_cost.lo - result.estimated_diy_cost.lo,
    why: result.why,
    flags: result.flags,
    fq: [],
    diy: {
      lo: result.estimated_diy_cost.lo,
      hi: result.estimated_diy_cost.hi,
      hrs: result.estimated_time_hours,
      time: result.time_description,
      risk: result.difficulty_level,
    },
    pro: {
      lo: result.estimated_pro_cost.lo,
      hi: result.estimated_pro_cost.hi,
      time: 'Varies by contractor availability',
      risk: 'Professional quality guaranteed',
      note: result.when_to_call_pro,
      script: result.pro_script,
    },
    tl: result.steps.map((s, i) => ({
      phase: `Step ${i + 1}: ${s.step}`,
      time: i === 0 ? 'Start' : '',
    })),
    tools: result.tools_needed.map((t) => ({
      n: t.name,
      e: t.essential ? 'Essential' : 'Helpful',
      r: t.essential ? 'Essential' : 'Optional',
      tip: `Est. cost: $${(t.estimated_cost / 100).toFixed(2)}`,
    })),
    steps: result.steps.map((s) => ({
      s: s.step,
      t: s.detail,
      photo: false,
      tip: s.safety_note ?? '',
    })),
    shop: result.materials_needed.map((m) => ({
      n: m.name,
      sz: '',
      pr: m.estimated_cost,
      store: m.where_to_buy,
      sku: '',
      stock: 'Check availability',
      tag: '',
    })),
    matEst: result.materials_total_estimate,
    // Extended AI fields (not in the original DiagnosisResult type but useful)
    safety_warnings: result.safety_warnings,
    difficulty_level: result.difficulty_level,
  };
}

export async function POST(request: Request) {
  try {
    // Require authentication to prevent API cost abuse
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limit: 5 assessments per minute per user
    const rateResult = rateLimiters.assess(user.id);
    if (!rateResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait before trying again.', code: 'RATE_LIMITED' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rateResult.reset - Date.now()) / 1000)) } }
      );
    }

    const formData = await request.formData();

    const photo = formData.get('photo');
    const description = formData.get('description');
    const categoryId = formData.get('category_id');
    const userContextRaw = formData.get('user_context');

    // Validate description
    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return NextResponse.json(
        { error: 'Description is required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    if (description.length > 2000) {
      return NextResponse.json(
        { error: 'Description must be under 2000 characters', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Validate photo
    if (!photo || !(photo instanceof File)) {
      return NextResponse.json(
        { error: 'Photo is required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    if (photo.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Photo must be under 10MB', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    if (!ACCEPTED_TYPES.includes(photo.type)) {
      return NextResponse.json(
        {
          error: 'Photo must be JPG, PNG, WebP, or HEIC',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      );
    }

    // Parse optional user context
    let userContext: z.infer<typeof userContextSchema> | null = null;
    if (userContextRaw && typeof userContextRaw === 'string') {
      try {
        const parsed = JSON.parse(userContextRaw);
        const result = userContextSchema.safeParse(parsed);
        if (result.success) {
          userContext = result.data;
        }
      } catch {
        // Ignore invalid JSON for user context — it is optional
      }
    }

    // Resolve category label
    const catId =
      categoryId && typeof categoryId === 'string' ? categoryId : null;
    const category = catId
      ? CATEGORIES.find((c) => c.id === catId) ?? null
      : null;

    // Check for Anthropic API key
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      // Fall back to static diagnosis data
      const fallbackKey = catId && DIAGNOSES[catId] ? catId : 'ceiling';
      const fallbackDiagnosis = DIAGNOSES[fallbackKey];

      return NextResponse.json({
        ...fallbackDiagnosis,
        category: category?.label ?? fallbackKey,
        ai_powered: false,
      });
    }

    // Convert photo to base64
    const photoBuffer = await photo.arrayBuffer();
    const base64Photo = Buffer.from(photoBuffer).toString('base64');

    // Determine media type for the API
    let mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' =
      'image/jpeg';
    if (photo.type === 'image/png') mediaType = 'image/png';
    else if (photo.type === 'image/webp') mediaType = 'image/webp';
    else if (photo.type === 'image/gif') mediaType = 'image/gif';
    // HEIC/HEIF will be sent as jpeg (browsers typically convert on capture)

    const prompt = buildPrompt(
      description.trim(),
      category?.label ?? null,
      userContext
    );

    // Call Claude API with timeout
    const anthropic = new Anthropic({ apiKey });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    let message;
    try {
      message = await anthropic.messages.create(
        {
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2048,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image',
                  source: {
                    type: 'base64',
                    media_type: mediaType,
                    data: base64Photo,
                  },
                },
                {
                  type: 'text',
                  text: prompt,
                },
              ],
            },
          ],
        },
        { signal: controller.signal }
      );
    } catch (abortError: unknown) {
      if (abortError instanceof Error && abortError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'AI assessment timed out. Please try again.', code: 'TIMEOUT' },
          { status: 504 }
        );
      }
      throw abortError;
    } finally {
      clearTimeout(timeout);
    }

    // Extract text response
    const textBlock = message.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json(
        { error: 'No response from AI', code: 'AI_ERROR' },
        { status: 500 }
      );
    }

    // Parse JSON from response — handle potential markdown code blocks
    let responseText = textBlock.text.trim();
    if (responseText.startsWith('```')) {
      responseText = responseText
        .replace(/^```(?:json)?\s*\n?/, '')
        .replace(/\n?```\s*$/, '');
    }

    const aiResponseSchema = z.object({
      title: z.string().max(100),
      confidence: z.number().min(0).max(100),
      verdict: z.enum(['diy_easy', 'diy_caution', 'hire_pro']),
      why: z.string(),
      flags: z.array(z.string()),
      estimated_diy_cost: z.object({ lo: z.number(), hi: z.number() }),
      estimated_pro_cost: z.object({ lo: z.number(), hi: z.number() }),
      estimated_time_hours: z.number(),
      time_description: z.string(),
      difficulty_level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
      tools_needed: z.array(z.object({
        name: z.string(),
        essential: z.boolean(),
        estimated_cost: z.number(),
      })),
      steps: z.array(z.object({
        step: z.string(),
        detail: z.string(),
        safety_note: z.string().nullable(),
      })),
      materials_needed: z.array(z.object({
        name: z.string(),
        estimated_cost: z.number(),
        where_to_buy: z.string(),
      })),
      materials_total_estimate: z.number(),
      safety_warnings: z.array(z.string()),
      when_to_call_pro: z.string(),
      pro_script: z.string(),
    });

    let aiResult: AIAssessmentResult;
    try {
      const rawParsed = JSON.parse(responseText);
      const validated = aiResponseSchema.safeParse(rawParsed);
      if (!validated.success) {
        console.error('AI response validation failed:', validated.error.flatten());
        return NextResponse.json(
          { error: 'AI returned an invalid response format', code: 'VALIDATION_ERROR' },
          { status: 500 }
        );
      }
      aiResult = validated.data;
    } catch {
      return NextResponse.json(
        { error: 'Failed to parse AI response', code: 'PARSE_ERROR' },
        { status: 500 }
      );
    }

    // Map to DiagnosisResult-compatible format
    const diagnosis = mapAIResultToDiagnosis(aiResult);

    // Determine verdict from confidence
    let verdict: Verdict;
    if (aiResult.confidence >= 85) verdict = 'diy_easy';
    else if (aiResult.confidence >= 70) verdict = 'diy_caution';
    else verdict = 'hire_pro';

    // Save project + award XP atomically
    const { data: existingProjects } = await supabase
      .from('projects')
      .select('id')
      .eq('user_id', user.id);

    const isFirstProject =
      !existingProjects || existingProjects.length === 0;
    const xpAwarded = isFirstProject
      ? XP_VALUES.FIRST_PROJECT
      : XP_VALUES.PROJECT_COMPLETE;

    // Atomic: insert project + award XP in single database transaction
    const { error: rpcError } = await supabase.rpc('create_project_with_xp', {
      p_user_id: user.id,
      p_category_id: catId ?? 'general',
      p_title: aiResult.title,
      p_confidence: aiResult.confidence,
      p_verdict: verdict,
      p_intake_answers: { description: description.trim() },
      p_estimated_diy_lo: aiResult.estimated_diy_cost.lo,
      p_estimated_diy_hi: aiResult.estimated_diy_cost.hi,
      p_estimated_pro_lo: aiResult.estimated_pro_cost.lo,
      p_estimated_pro_hi: aiResult.estimated_pro_cost.hi,
      p_xp_amount: xpAwarded,
      p_assessment_mode: 'ai_photo',
    });

    if (rpcError) {
      console.error('Failed to create project with XP:', rpcError.message);
    }

    return NextResponse.json({
      ...diagnosis,
      verdict,
      category: category?.label ?? catId ?? 'General',
      ai_powered: true,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    console.error('Assessment API error:', message);
    return NextResponse.json(
      { error: 'Assessment failed', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
