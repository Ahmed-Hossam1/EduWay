import { BarChart3, GraduationCap, Users } from "lucide-react";
import Image from "next/image";
import { Logo } from "@/components/shared/Logo";
import { heroFeatures } from "../data/heroFeatures";


export default function SignUpHero() {
    return (
        <div className="relative hidden min-h-screen overflow-hidden lg:flex lg:w-1/2">
            {/* Background image */}
            <div className="absolute inset-0">
                <Image
                    src="/images/signup.png"
                    alt="Student learning with EduWay"
                    fill
                    priority
                    className="object-cover object-center brightness-[0.5] contrast-[1.1]"
                />
            </div>

            {/* Gradient overlay — soft white in light mode, dark in dark mode */}
            <div className="absolute inset-0 bg-linear-to-t from-white/50 via-white/20 to-white/5 dark:from-black/85 dark:via-black/50 dark:to-black/15" />

            {/* Brand glow accent */}
            <div className="absolute -bottom-32 -left-32 size-112 rounded-full bg-primary/20 blur-3xl" />

            {/* Content */}
            <div className="relative z-10 flex min-h-screen w-full flex-col justify-between p-10 xl:p-14">
                {/* Logo */}
                <div>
                    <Logo />
                </div>

                {/* Hero copy */}
                <div className="max-w-lg py-12">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/60">
                        More than learning
                    </p>
                    <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-white xl:text-5xl">
                        Your Journey
                        <br />
                        <span className="bg-linear-to-r from-purple-300 via-purple-400 to-primary bg-clip-text text-transparent">
                            Starts
                        </span>{" "}
                        Here.
                    </h1>

                    <p className="mt-5 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
                        Join thousands of learners and take the next step toward a
                        brighter future with EduWay.
                    </p>

                    <div className="mt-8 space-y-5">
                        {heroFeatures.map((feature, idx) => {
                            const Icon = feature.icon;
                            return (
                                <div className="flex items-center gap-3.5" key={idx}>
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-sm">
                                        <Icon className="size-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-white">
                                            {feature.title}
                                        </h3>
                                        <p className="text-xs text-white/60">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Quote */}
                <div className="max-w-md border-t border-white/10 pt-4">
                    <p className="text-xs italic leading-relaxed text-white/60 sm:text-sm">
                        &ldquo;Education is the most powerful weapon you can use to change
                        your life.&rdquo;
                    </p>
                    <p className="mt-1.5 text-xs text-white/50">
                        — Nelson{" "}
                        <span className="font-medium text-white/80">Mandela</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
