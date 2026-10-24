"use client";
import Link from "next/link";
import { ArrowLeft, KeyRound, Mail, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { forgotPasswordSchema, ForgotPasswordSchemaType } from "../schemas/forgotPasswordSchema";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { CheckInboxCard } from "../../shared/components/CheckInboxCard";

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
        <Card className="block w-full max-w-sm rounded-2xl p-7 shadow-lg sm:max-w-md sm:p-9">
            {/* Icon */}
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-8 ring-primary/5">
                <KeyRound className="size-6" />
            </div>

            {/* Header */}
            <div className="mt-6 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-[1.75rem]">
                    Forgot your password?
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    No worries! Enter the email you signed up with and we&apos;ll send you a link to reset your
                    password.
                </p>
            </div>

            {/* Came back from an expired / used link */}
            {linkExpired && (
                <p className="mt-5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-center text-sm text-destructive">
                    Your reset link expired or was already used. Enter your email to get a new one.
                </p>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit((data) => sendResetLink(data))} className="mt-7 space-y-4" noValidate>
                <Input
                    id="forgot-password-email"
                    {...register("email")}
                    type="email"
                    label="Email"
                    placeholder="you@example.com"
                    leftIcon={<Mail className="size-4" />}
                    variant="outline"
                    Size="md"
                    rounded="lg"
                    fullWidth
                    autoComplete="email"
                    errorText={errors.email?.message}
                />

                <Button
                    type="submit"
                    size="lg"
                    rounded="xl"
                    className="mt-2 h-11 w-full font-semibold"
                    isLoading={isPending}
                >
                    {isPending ? (
                        "Sending..."
                    ) : (
                        <>
                            Send reset link
                            <Send className="size-4" />
                        </>
                    )}
                </Button>
            </form>

            {/* Back to login */}
            <Link
                href="/auth/login"
                className="mt-6 flex items-center justify-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
            >
                <ArrowLeft className="size-4" />
                Back to sign in
            </Link>
        </Card>
    );
}
