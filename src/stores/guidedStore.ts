import { create } from 'zustand';

export interface GuidedStep {
  s: string;
  t: string;
  photo: boolean;
  tip: string;
}

interface GuidedState {
  isActive: boolean;
  projectId: string | null;
  projectTitle: string;
  steps: GuidedStep[];
  currentStep: number;
  completedSteps: Set<number>;
  stepPhotos: Map<number, string>;
  stepFeedback: Map<number, { status: 'pass' | 'caution' | 'redo'; message: string }>;
  startedAt: number | null;

  startGuidedMode: (projectId: string, title: string, steps: GuidedStep[]) => void;
  exitGuidedMode: () => void;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  completeStep: (step: number) => void;
  uploadStepPhoto: (step: number, photoUrl: string) => void;
  setStepFeedback: (step: number, feedback: { status: 'pass' | 'caution' | 'redo'; message: string }) => void;
}

export const useGuidedStore = create<GuidedState>((set, get) => ({
  isActive: false,
  projectId: null,
  projectTitle: '',
  steps: [],
  currentStep: 0,
  completedSteps: new Set(),
  stepPhotos: new Map(),
  stepFeedback: new Map(),
  startedAt: null,

  startGuidedMode: (projectId, title, steps) =>
    set({
      isActive: true,
      projectId,
      projectTitle: title,
      steps,
      currentStep: 0,
      completedSteps: new Set(),
      stepPhotos: new Map(),
      stepFeedback: new Map(),
      startedAt: Date.now(),
    }),

  exitGuidedMode: () =>
    set({
      isActive: false,
      projectId: null,
      projectTitle: '',
      steps: [],
      currentStep: 0,
      completedSteps: new Set(),
      stepPhotos: new Map(),
      stepFeedback: new Map(),
      startedAt: null,
    }),

  goToStep: (step) => {
    const { steps } = get();
    if (step >= 0 && step < steps.length) {
      set({ currentStep: step });
    }
  },

  nextStep: () => {
    const { currentStep, steps } = get();
    if (currentStep < steps.length - 1) {
      set({ currentStep: currentStep + 1 });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },

  completeStep: (step) => {
    const { completedSteps } = get();
    const next = new Set(completedSteps);
    next.add(step);
    set({ completedSteps: next });
  },

  uploadStepPhoto: (step, photoUrl) => {
    const { stepPhotos } = get();
    const next = new Map(stepPhotos);
    next.set(step, photoUrl);
    set({ stepPhotos: next });
  },

  setStepFeedback: (step, feedback) => {
    const { stepFeedback } = get();
    const next = new Map(stepFeedback);
    next.set(step, feedback);
    set({ stepFeedback: next });
  },
}));
