export interface OnboardingStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  description?: string;
}

export * from "../step-one/types";
export * from "../step-two/types";
export * from "../step-three/types";
