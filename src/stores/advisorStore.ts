import { create } from 'zustand';
import type { DiagnosisResult } from '@/types/app';

interface AdvisorState {
  // Existing fields
  selectedCategory: string | null;
  intakeAnswers: Record<string, string>;
  currentStep: number;
  diagnosisResult: DiagnosisResult | null;
  isAnalyzing: boolean;

  // AI assessment fields
  photo: File | null;
  description: string;
  experienceLevel: string;
  homeAgeYears: number | null;
  assessmentMode: 'category' | 'ai';

  // Existing actions
  selectCategory: (id: string) => void;
  setAnswer: (questionId: string, answer: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  setResult: (result: DiagnosisResult) => void;
  setAnalyzing: (val: boolean) => void;
  reset: () => void;

  // AI assessment actions
  setPhoto: (photo: File | null) => void;
  setDescription: (description: string) => void;
  setExperienceLevel: (level: string) => void;
  setHomeAge: (years: number | null) => void;
  setAssessmentMode: (mode: 'category' | 'ai') => void;
}

const initialState = {
  selectedCategory: null,
  intakeAnswers: {},
  currentStep: 0,
  diagnosisResult: null,
  isAnalyzing: false,
  photo: null,
  description: '',
  experienceLevel: '',
  homeAgeYears: null,
  assessmentMode: 'category' as const,
};

export const useAdvisorStore = create<AdvisorState>((set) => ({
  ...initialState,
  selectCategory: (id) =>
    set({ selectedCategory: id || null }),
  setAnswer: (questionId, answer) =>
    set((state) => ({
      intakeAnswers: { ...state.intakeAnswers, [questionId]: answer },
    })),
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () =>
    set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),
  setResult: (result) => set({ diagnosisResult: result, isAnalyzing: false }),
  setAnalyzing: (val) => set({ isAnalyzing: val }),
  reset: () => set(initialState),

  // AI assessment actions
  setPhoto: (photo) => set({ photo }),
  setDescription: (description) => set({ description }),
  setExperienceLevel: (level) => set({ experienceLevel: level }),
  setHomeAge: (years) => set({ homeAgeYears: years }),
  setAssessmentMode: (mode) => set({ assessmentMode: mode }),
}));
