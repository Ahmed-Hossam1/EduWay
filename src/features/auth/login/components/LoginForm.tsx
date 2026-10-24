"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { loginInputs } from "../data/loginInputs";
import { useLogin } from "../hooks/useLogin";
import { useIsAuthBusy } from "../../shared/hooks/useIsAuthBusy";
import { loginSchema, LoginSchemaType } from "../schemas/loginSchema";
import { AuthTabs } from "../../shared/components/AuthTabs";
import { SocialLogin } from "../../oauth/components/SocialLogin";
import { EmailNotConfirmedNotice } from "../../confirm-email/components/EmailNotConfirmedNotice";
import { isEmailNotConfirmed } from "../../confirm-email/utils/isEmailNotConfirmed";

type LoginFormProps = {
    confirmLinkExpired?: boolean; // came back from an old / used confirm-signup link (/api/auth/confirm)
};

export function LoginForm({ confirmLinkExpired = false }: LoginFormProps) {
    const {
        handleSubmit,
        register,
        getValues,
        formState: { errors },
    } = useForm<LoginSchemaType>({
        resolver: zodResolver(loginSchema),
    });
    // the toast + the redirect are inside useLogin
    const { mutate: login, isPending, error } = useLogin();
    // right password, but the email is not confirmed yet → show the box with "Resend"
    const emailNotConfirmed = isEmailNotConfirmed(error);
    // any sign-in running (email or Google / GitHub) → the button can't be clicked
    const isAuthBusy = useIsAuthBusy();

    const onSubmit = (data: LoginSchemaType) => login(data);
    return (
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-7 shadow-lg sm:max-w-md sm:p-9">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-[1.75rem]">
                    Welcome back to <span className="text-primary">EduWay</span>
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">Sign in to continue your learning journey</p>
            </div>

            {/* Auth tabs */}
            <AuthTabs activeTab="login" />

            {/* Came back from an expired / used confirmation link */}
            {confirmLinkExpired && !emailNotConfirmed && (
                <p className="mt-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-center text-sm text-destructive">
                    Your confirmation link expired or was already used. Sign in to get a new one.
                </p>
            )}

            {/* Form */}
            {/* onSubmit on the form → the Enter key works too */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
                {/* Email not confirmed yet → resend the link */}
                {emailNotConfirmed && <EmailNotConfirmedNotice email={getValues("email")} />}

                {loginInputs.map((input) => {
                    const IconComponent = input.icon;
                    return (
                        <Input
                            key={input.name}
                            id={input.id || input.name}
                            type={input.type}
                            {...register(input.name)}
                            placeholder={input.placeholder}
                            leftIcon={<IconComponent className="size-4" />}
                            variant="outline"
                            Size="md"
                            rounded="lg"
                            fullWidth
                            errorText={errors[input.name]?.message}
                            aria-label={input.placeholder}
                        />
                    );
                })}

                {/* Options row */}
                <div className="flex items-center justify-between pt-0.5">
                    <label htmlFor="remember-me" className="flex cursor-pointer items-start gap-2.5 pt-0.5 text-sm">
                        <Checkbox />
                        <span>Remember me</span>
                    </label>

                    <Link
                        href="/auth/forgot-password"
                        className="text-sm font-medium text-primary transition-colors hover:text-primary-hover hover:underline"
                    >
                        Forgot password?
                    </Link>
                </div>

                {/* Primary CTA */}
                <Button
                    type="submit"
                    variant="default"
                    isLoading={isPending}
                    disabled={isAuthBusy}
                    size="lg"
                    rounded="xl"
                    className="mt-2 h-11 w-full font-semibold"
                >
                    {isPending ? (
                        "Signing in..."
                    ) : (
                        <>
                            Sign in
                            <ArrowRight className="size-4" />
                        </>
                    )}
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
                    href="/auth/signup"
                    className="font-semibold text-primary transition-colors hover:text-primary-hover hover:underline"
                >
                    Sign up free
                </Link>
            </p>
        </div>
    );
}
