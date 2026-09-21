import {
    BarChart3,
    GraduationCap,
    Users
} from "lucide-react";
import Image from "next/image";
import { loginFeaturesData } from "./data";
import LoginForm from "./components/LoginForm";


const icons = {
    graduationCap: GraduationCap,
    barChart3: BarChart3,
    users: Users
}

export default function LoginPage() {
    return (
        <main className="min-h-screen w-full bg-background text-foreground">
            <div className="flex min-h-screen flex-col lg:flex-row">
                {/* Left side (content)  */}
                <div className="relative hidden min-h-screen overflow-hidden lg:flex lg:w-1/2">
                    {/* Background */}
                    <div className="absolute inset-0">
                        <Image
                            src="/images/career-woman.jpg"
                            alt="Student studying with EduWay"
                            fill
                            priority
                            className="object-cover object-center brightness-[0.55] contrast-[1.1]"
                        />
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-background via-background/75 to-background/45" />

                    <div className="absolute -bottom-32 -left-32 size-112 rounded-full bg-primary/20 blur-3xl" />

                    {/* Content */}
                    <div className="relative z-10 flex min-h-screen w-full flex-col justify-between p-10 xl:p-14">
                        {/* Logo */}

                        {/* Hero content */}
                        <div className="my-auto max-w-lg py-12">
                            <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-white xl:text-5xl">
                                Your Way to
                                <br />
                                Learn, Grow,
                                <br />
                                and{" "}
                                <span className="bg-linear-to-r from-purple-300 via-purple-400 to-primary bg-clip-text text-transparent">
                                    Succeed.
                                </span>
                            </h1>

                            <p className="mt-5 max-w-md text-sm leading-relaxed text-zinc-300 sm:text-base">
                                Access high-quality courses, learn from experts, and build the
                                skills you need for a brighter future.
                            </p>

                            <div className="mt-8 space-y-5">
                                {loginFeaturesData.map((feature, idx) => {
                                    const IconComponent = feature.icon;
                                    return (
                                        <div className="flex items-center gap-3.5" key={idx}>
                                            <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md">
                                                <IconComponent className="size-5" />
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-semibold text-white">{feature.title}</h3>
                                                <p className="text-xs text-zinc-300">{feature.description}</p>
                                            </div>
                                        </div>
                                    )
                                }
                                )}

                            </div>
                        </div>

                        {/* Quote */}
                        <div className="max-w-md border-t border-white/10 pt-4">
                            <p className="text-xs italic leading-relaxed text-zinc-300 sm:text-sm">
                                “Education is the most powerful weapon you can use to change your
                                life.”
                            </p>

                            <p className="mt-1.5 text-xs text-zinc-400">
                                — Nelson <span className="font-medium text-white">Mandela</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side (Form)  */}
                <div className="flex min-h-screen w-full flex-col p-6 sm:p-10 lg:w-1/2 lg:p-12">
                    <div className="my-auto flex w-full justify-center py-8">
                        <LoginForm />
                    </div>

                    <div className="hidden h-6 lg:block" />
                </div>
            </div>
        </main>
    );
}