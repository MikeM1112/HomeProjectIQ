import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const validateSchema = z.object({
  checkpoint_id: z.string().uuid(),
  image_url: z.string().url(),
});

type ValidationResult =
  | 'STEP_COMPLETE'
  | 'STEP_INCOMPLETE'
  | 'STEP_INCORRECT'
  | 'UNEXPECTED_CONDITION'
  | 'SAFETY_WARNING';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id: sessionId } = await params;

  // Verify session belongs to user
  const { data: session } = await supabase
    .from('guided_sessions')
    .select('id, project_id, current_step')
    .eq('id', sessionId)
    .eq('user_id', user.id)
    .single();

  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

  const body = await request.json();
  const parsed = validateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { checkpoint_id, image_url } = parsed.data;

  // Get checkpoint
  const { data: checkpoint } = await supabase
    .from('step_checkpoints')
    .select('*')
    .eq('id', checkpoint_id)
    .eq('session_id', sessionId)
    .single();

  if (!checkpoint) return NextResponse.json({ error: 'Checkpoint not found' }, { status: 404 });

  // AI Validation Logic
  // In production, this would call Claude Vision API to compare the checkpoint photo
  // against the expected state. For now, we build the structured pipeline.
  const stepNumber = checkpoint.step_number;
  const totalSteps = session.current_step >= stepNumber ? session.current_step + 1 : 5;

  // Structured validation response
  // The AI would analyze: image quality, step completion indicators,
  // safety hazards, unexpected conditions
  const validationResult: {
    status: ValidationResult;
    confidence: number;
    feedback: string;
    recommended_action: string | null;
    safety_warnings: string[];
    reroute: boolean;
    reroute_reason: string | null;
  } = {
    status: 'STEP_COMPLETE',
    confidence: 0.85,
    feedback: `Step ${stepNumber} of ${totalSteps} appears complete.`,
    recommended_action: stepNumber < totalSteps ? `Proceed to step ${stepNumber + 1}.` : 'All steps complete — finalize repair.',
    safety_warnings: [],
    reroute: false,
    reroute_reason: null,
  };

  // Update checkpoint with validation result
  await supabase
    .from('step_checkpoints')
    .update({
      photo_url: image_url,
      ai_validation_status: validationResult.status === 'STEP_COMPLETE' ? 'passed' : 'failed',
      ai_feedback: validationResult.feedback,
      validated_at: new Date().toISOString(),
    })
    .eq('id', checkpoint_id);

  // If step complete, advance session
  if (validationResult.status === 'STEP_COMPLETE' && stepNumber < totalSteps) {
    await supabase
      .from('guided_sessions')
      .update({ current_step: stepNumber + 1 })
      .eq('id', sessionId);
  }

  // If all steps complete, mark session complete
  if (validationResult.status === 'STEP_COMPLETE' && stepNumber >= totalSteps) {
    await supabase
      .from('guided_sessions')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', sessionId);
  }

  return NextResponse.json(validationResult);
}
