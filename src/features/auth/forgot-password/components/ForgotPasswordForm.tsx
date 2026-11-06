"use client";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Info, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/layout/Logo";
import { forgotPasswordSchema, ForgotPasswordSchemaType } from "../schemas/forgotPasswordSchema";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { CheckInboxCard } from "../../shared/components/CheckInboxCard";
import { ForgotPasswordIllustration } from "./ForgotPasswordIllustration";
import { ForgotPasswordWaves } from "./ForgotPasswordWaves";

type ForgotPasswordFormProps = {
    linkExpired?: boolean; // came back from an old / used reset link (/api/auth/confirm)
};

export function ForgotPasswordForm({ linkExpired = false }: ForgotPasswordFormProps) {
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<ForgotPasswordSchemaType>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    // reset() = back to the form ("Send again")
    const { mutate: sendResetLink, isPending, isSuccess, reset } = useForgotPassword();

    // ── After sending: "Check your inbox" ──
    if (isSuccess) {
        return (
            <CheckInboxCard
                description={
                    <>
                        If an account exists for{" "}
                        <span className="font-semibold text-foreground">{getValues("email")}</span>, we sent a link to
                        reset your password. The link works for 1 hour.
                    </>
                }
                note={
                    <>
                        Didn&apos;t get the email? Check your spam folder, or{" "}
                        <button
                            type="button"
                            onClick={() => reset()}
                            className="font-semibold text-primary hover:underline"
                        >
                            send it again
                        </button>
                        .
                    </>
                }
            />
        );
    }

    // ── The form ──
    return (
        <Card className="relative block w-full max-w-md overflow-hidden rounded-3xl px-6 pt-6 pb-48 shadow-xl sm:px-9">
            {/* 1- top bar: logo + back to sign in */}
            <div className="flex items-center justify-between">
                <Logo />
                <Link
                    href="/auth/login"
                    className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="size-4" />
                    Back to sign in
                </Link>
            </div>

            {/* 2- the picture */}
            <div className="mt-8">
                <ForgotPasswordIllustration />
            </div>

            {/* 3- header */}
            <div className="mt-6 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Forgot Your <span className="text-primary">Password?</span>
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    No worries! Enter your email address and we&apos;ll send you a link to reset your password.
                </p>
            </div>

            {/* came back from an expired / used link */}
            {linkExpired && (
                <p className="mt-5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-center text-sm text-destructive">
                    Your reset link expired or was already used. Enter your email to get a new one.
                </p>
            )}

            {/* 4- the form */}
            <form onSubmit={handleSubmit((data) => sendResetLink(data))} className="mt-7 space-y-4" noValidate>
                <Input
                    id="forgot-password-email"
                    {...register("email")}
                    type="email"
                    aria-label="Email address"
                    placeholder="Email address"
                    leftIcon={<Mail className="size-4" />}
                    variant="outline"
                    Size="lg"
                    rounded="lg"
                    fullWidth
                    autoComplete="email"
                    errorText={errors.email?.message}
                />

                <Button
                    type="submit"
                    size="lg"
                    rounded="xl"
                    className="h-12 w-full font-semibold"
                    isLoading={isPending}
                >
                    {isPending ? (
                        "Sending..."
                    ) : (
                        <>
                            Send Reset Link
                            <ArrowRight className="size-4" />
                        </>
                    )}
                </Button>
            </form>

            {/* 5- what happens next */}
            <div className="mt-5 flex gap-3 rounded-xl border border-border bg-muted/40 p-4">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Info className="size-4" />
                </span>
                <div>
                    <p className="text-sm font-semibold text-foreground">Check your inbox</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                        We&apos;ll send you a secure link to reset your password. If you don&apos;t see it, check your
                        spam folder.
                    </p>
                </div>
            </div>

            {/* 6- back to login */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link href="/auth/login" className="font-semibold text-primary underline-offset-4 hover:underline">
                    Sign in
                </Link>
            </p>

            {/* 7- the waves + quote at the bottom */}
            <ForgotPasswordWaves />
        </Card>
    );
}
