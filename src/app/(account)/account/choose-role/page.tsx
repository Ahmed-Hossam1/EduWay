import ChooseRoleForm from "@/features/auth/choose-role/components/ChooseRoleForm";
import { Logo } from "@/components/layout/Logo";
import { Sparkles } from "lucide-react";
import { AuthHeader } from "@/features/auth/shared/components";

export const metadata = {
    title: "Choose Your Role - EduWay",
    description:
        "Tell us who you are so we can personalise your EduWay experience - start as a student or a teacher.",
};

export default function ChooseRolePage() {
    return (
        <main className="min-h-screen w-full bg-background text-foreground">
            <div className="flex min-h-screen flex-col">
                {/* Header */}
                <AuthHeader />

                {/* Body */}
                <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                    {/* Decorative glow */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none fixed inset-0 overflow-hidden"
                    >
                        <div className="absolute -top-40 left-1/2 size-150 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
                        <div className="absolute bottom-0 right-0 size-80 rounded-full bg-primary/5 blur-3xl" />
                    </div>

                    <div className="relative z-10 flex w-full max-w-2xl flex-col items-center gap-10">
                        {/* Heading section */}
                        <div className="flex flex-col items-center gap-4 text-center">
                            {/* Badge */}
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-accent px-3.5 py-1 text-xs font-medium text-accent-foreground">
                                <Sparkles className="size-3.5" aria-hidden="true" />
                                Almost there!
                            </span>

                            {/* Logo visible only on mobile (hero not shown) */}
                            <div className="lg:hidden">
                                <Logo />
                            </div>

                            <div className="space-y-2">
                                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                                    How will you use{" "}
                                    <span className="bg-linear-to-r from-purple-500 via-primary to-violet-500 bg-clip-text text-transparent">
                                        EduWay?
                                    </span>
                                </h1>
                                <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                                    Pick the role that best describes you. This helps us tailor
                                    your experience from day one.
                                </p>
                            </div>
                        </div>

                        {/* Role selection form */}
                        <ChooseRoleForm />
                    </div>
                </div>
            </div>
        </main>
    );
}
