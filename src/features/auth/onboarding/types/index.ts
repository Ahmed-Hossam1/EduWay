export interface OnboardingStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  description?: string;
}

// A category for step 2 (from the categories table)
export interface CategoryOption {
  id: string; // uuid → saved in instructor_profiles.category_id
  name: string;
  slug: string;
}

export * from "../step-one/types";
export * from "../step-two/types";
export * from "../step-three/types";
