"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ShieldCheck, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { DefaultValues, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OnboardingHeader } from "./OnboardingHeader";
import { OnboardingProgress } from "./OnboardingProgress";
import { TeacherStepOneForm } from "../step-one/components/TeacherStepOneForm";
import { TeacherStepTwoForm } from "../step-two/components/TeacherStepTwoForm";
import { TeacherStepThreeForm } from "../step-three/components/TeacherStepThreeForm";
import { onboardingSchema, OnboardingFormValues, STEP_FIELDS } from "../schemas/onboardingSchema";
import { useSubmitOnboarding } from "../hooks/useSubmitOnboarding";
import { CategoryOption } from "../types/index";

type Step = 1 | 2 | 3;

interface TeacherOnboardingContainerProps {
    defaultValues: DefaultValues<OnboardingFormValues>; // name + photo already filled (from the server)
    categories: CategoryOption[];
}

export function TeacherOnboardingContainer({ defaultValues, categories }: TeacherOnboardingContainerProps) {
    const [currentStep, setCurrentStep] = useState<Step>(1);

    // ONE form for the 3 steps => going Back never loses what he typed
    const form = useForm<OnboardingFormValues>({
        resolver: zodResolver(onboardingSchema),
        defaultValues,
    });

    const { mutate: submitOnboarding, isPending } = useSubmitOnboarding();

    const goToStep = (step: Step) => {
        setCurrentStep(step);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // "Continue": check ONLY the fields of this step (the next steps are still empty)
    const goToNextStep = async () => {
        // trigger means trigger the validation of the fields in the current step
        const isStepValid = await form.trigger(STEP_FIELDS[currentStep]);
        if (!isStepValid) return; // the errors show under the inputs

        if (currentStep === 1) goToStep(2);
        if (currentStep === 2) goToStep(3);
    };

    // Enter key / submit button:
    // steps 1 & 2 => go to the next step | step 3 => check everything and save
    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        if (currentStep < 3) {
            e.preventDefault();
            goToNextStep();
            return;
        }
        // handleSubmit(fn) RETURNS a function => call it with the event (e):
        // it stops the browser reload, checks all the fields, then calls fn with the values
        form.handleSubmit((values) => {
            submitOnboarding(values);
        })(e);
    };

    return (
        <main className="min-h-screen w-full bg-background text-foreground flex flex-col">
            {/* Top Header */}
            <OnboardingHeader />

            {/* Main Content Area */}
            <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                {/* Decorative background glow matching EduWay Auth */}
                <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
                    <div className="absolute -top-40 left-1/2 size-150 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
                    <div className="absolute bottom-10 right-10 size-80 rounded-full bg-primary/5 blur-3xl" />
                </div>

                {/* Content Container */}
                <div className="relative z-10 flex w-full max-w-2xl flex-col items-center gap-8">
                    {/* Header section */}
                    <div className="flex flex-col items-center gap-3 text-center">
                        {/* Step pill */}
                        <Badge
                            variant="accent"
                            className="h-auto gap-1.5 border-primary/20 px-3 py-1 font-semibold shadow-xs"
                        >
                            {currentStep === 1 && (
                                <>
                                    <Sparkles className="size-3.5" aria-hidden="true" />
                                    Step 1 of 3 · Personal Details
                                </>
                            )}
                            {currentStep === 2 && (
                                <>
                                    <BookOpen className="size-3.5" aria-hidden="true" />
                                    Step 2 of 3 · Teaching Information
                                </>
                            )}
                            {currentStep === 3 && (
                                <>
                                    <ShieldCheck className="size-3.5" aria-hidden="true" />
                                    Step 3 of 3 · Profile & Verification
                                </>
                            )}
                        </Badge>

                        {/* Main title */}
                        <div className="space-y-2">
                            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
                                {currentStep === 1 && (
                                    <>
                                        Let&apos;s build your{" "}
                                        <span className="bg-linear-to-r from-purple-500 via-primary to-violet-500 bg-clip-text text-transparent">
                                            teacher profile
                                        </span>
                                    </>
                                )}
                                {currentStep === 2 && (
                                    <>
                                        Share your{" "}
                                        <span className="bg-linear-to-r from-purple-500 via-primary to-violet-500 bg-clip-text text-transparent">
                                            teaching expertise
                                        </span>
                                    </>
                                )}
                                {currentStep === 3 && (
                                    <>
                                        Complete your{" "}
                                        <span className="bg-linear-to-r from-purple-500 via-primary to-violet-500 bg-clip-text text-transparent">
                                            teacher profile
                                        </span>
                                    </>
                                )}
                            </h1>
                            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
                                {currentStep === 1 &&
                                    "Welcome to EduWay! Tell us about yourself so students can connect with you and understand your unique expertise."}
                                {currentStep === 2 &&
                                    "Highlight your domain, skills, experience, and certifications to help students find and trust your courses."}
                                {currentStep === 3 &&
                                    "Add your profile photo, link your professional profiles, and verify your details to finalize your application."}
                            </p>
                        </div>
                    </div>

                    {/* Onboarding Card */}
                    <Card className="w-full rounded-2xl border-border bg-card p-6 shadow-xl shadow-primary/5 sm:p-9 ring-0">
                        {/* Progress indicator */}
                        <div className="pb-8 border-b border-border/60">
                            <OnboardingProgress
                                currentStep={currentStep}
                                onStepClick={(step) => goToStep(step as Step)}
                            />
                        </div>

                        {/* Step Forms (one <form>, the steps are parts of it) */}
                        <FormProvider {...form}>
                            <form onSubmit={handleFormSubmit} noValidate className="pt-8">
                                {currentStep === 1 && <TeacherStepOneForm />}
                                {currentStep === 2 && (
                                    <TeacherStepTwoForm categories={categories} onBack={() => goToStep(1)} />
                                )}
                                {currentStep === 3 && (
                                    <TeacherStepThreeForm onBack={() => goToStep(2)} isSubmitting={isPending} />
                                )}
                            </form>
                        </FormProvider>
                    </Card>
                </div>
            </div>
        </main>
    );
}
