import { ArrowRight, EyeOff, Link, Lock, Mail } from "lucide-react";
import SocialLogin from "./SocialLogin";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";

function LoginForm() {
    return (
        <div className="w-full max-w-110 rounded-2xl border border-border/80 bg-card/60 p-7 shadow-xl backdrop-blur-xl sm:p-9">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-7">
                    Welcome to <span className="text-primary">EduWay</span>
                </h2>

                <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
                    Sign in to your account or create a new one
                </p>
            </div>

            {/* Auth tabs */}
            <div className="mt-6 grid grid-cols-2 rounded-xl border border-border/50 bg-muted/60 p-1">
                <Button
                    type="button"
                    variant="default"
                    size="default"
                    className="rounded-lg border-b-2 border-primary"
                >
                    Sign In
                </Button>

                <Link
                    href="/signup"
                    className="flex h-8 items-center justify-center rounded-lg px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                    Sign Up
                </Link>
            </div>

            {/* Form */}
            <form className="mt-6 space-y-4">
                <Input
                    type="email"
                    placeholder="Email address"
                    leftIcon={<Mail className="size-4" />}
                    variant="outline"
                    Size="md"
                    rounded="lg"
                    fullWidth
                    aria-label="Email address"
                />

                <Input
                    type="password"
                    placeholder="Password"
                    leftIcon={<Lock className="size-4" />}
                    rightIcon={<EyeOff className="size-4" />}
                    variant="outline"
                    Size="md"
                    rounded="lg"
                    fullWidth
                    aria-label="Password"
                />

                {/* Options */}
                <div className="flex items-center justify-between pt-1">
                    <label className="flex cursor-pointer items-center gap-2 text-xs text-foreground/80 sm:text-sm">
                        <input
                            type="checkbox"
                            defaultChecked
                            className="size-4 accent-primary"
                        />

                        <span>Remember me</span>
                    </label>

                    <Link
                        href="/forgot-password"
                        className="text-xs font-medium text-primary transition-colors hover:text-primary-hover hover:underline sm:text-sm"
                    >
                        Forgot password?
                    </Link>
                </div>

                {/* Main CTA */}
                <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    className="mt-2 h-11 w-full rounded-xl font-semibold"
                >
                    <span>Sign In</span>
                    <ArrowRight className="size-4" />
                </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6 flex items-center justify-center">
                <div className="absolute inset-x-0 border-t border-border/60" />

                <span className="relative bg-card px-3 text-xs font-medium text-muted-foreground">
                    or continue with
                </span>
            </div>

            {/* Social */}
            <SocialLogin />

            {/* Signup */}
            <p className="mt-8 text-center text-xs text-muted-foreground sm:text-sm">
                Don&apos;t have an account?{" "}
                <Link
                    href="/signup"
                    className="font-semibold text-primary transition-colors hover:text-primary-hover hover:underline"
                >
                    Sign up
                </Link>
            </p>
        </div>
    );
}

export default LoginForm