import { ArrowRight, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import Input from "@/components/ui/input";
import SocialLogin from "./SocialLogin";
import { cn } from "@/lib/utils";

function LoginForm() {
    return (
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-7 shadow-lg sm:max-w-md sm:p-9">

            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-[1.75rem]">
                    Welcome back to{" "}
                    <span className="text-primary">EduWay</span>
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                    Sign in to continue your learning journey
                </p>
            </div>

            {/* Auth tabs */}
            <div className="mt-6 grid grid-cols-2 rounded-xl border border-border bg-muted/50 p-1 gap-1">
                <Button
                    type="button"
                    variant="default"
                    size="default"
                    className="h-8 w-full rounded-lg text-sm font-semibold"
                    aria-current="page"
                >
                    Sign In
                </Button>

                <Link
                    href="/signup"
                    className={cn(
                        buttonVariants({ variant: "ghost", size: "default" }),
                        "h-8 w-full rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground"
                    )}
                >
                    Sign Up
                </Link>
            </div>

            {/* Form */}
            <form className="mt-6 space-y-4" noValidate>
                <Input
                    type="email"
                    placeholder="Email address"
                    leftIcon={<Mail className="size-4" />}
                    variant="outline"
                    Size="md"
                    rounded="lg"
                    fullWidth
                    aria-label="Email address"
                    autoComplete="email"
                    id="login-email"
                />

                <Input
                    id="login-password"
                    type="password"
                    placeholder="Password"
                    leftIcon={<Lock className="size-4" />}
                    variant="outline"
                    Size="md"
                    rounded="lg"
                    fullWidth
                    aria-label="Password"
                    autoComplete="off"
                />

                {/* Options row */}
                <div className="flex items-center justify-between pt-0.5">
                    <label
                        htmlFor="remember-me"
                        className="flex cursor-pointer items-center gap-2 text-sm text-foreground/80"
                    >
                        <input
                            id="remember-me"
                            type="checkbox"
                            defaultChecked
                            className="size-4 accent-primary"
                        />
                        <span>Remember me</span>
                    </label>

                    <Link
                        href="/forgot-password"
                        className="text-sm font-medium text-primary transition-colors hover:text-primary-hover hover:underline"
                    >
                        Forgot password?
                    </Link>
                </div>

                {/* Primary CTA */}
                <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    className="mt-2 h-11 w-full rounded-xl font-semibold"
                >
                    Sign In
                    <ArrowRight className="size-4" />
                </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6 flex items-center justify-center">
                <div className="absolute inset-x-0 border-t border-border" />
                <span className="relative bg-card px-3 text-xs font-medium text-muted-foreground">
                    or continue with
                </span>
            </div>

            {/* Social login */}
            <SocialLogin />

            {/* Sign up link */}
            <p className="mt-7 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                    href="/signup"
                    className="font-semibold text-primary transition-colors hover:text-primary-hover hover:underline"
                >
                    Sign up free
                </Link>
            </p>
        </div>
    );
}

export default LoginForm;