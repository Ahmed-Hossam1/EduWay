"use client";
import { Lock, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { resetPasswordSchema, ResetPasswordSchemaType } from "../schemas/resetPasswordSchema";
import { useResetPassword } from "../hooks/useResetPassword";
import { resetPasswordFormInputs } from "../data/resetFormInputs";

// /auth/reset-password — shown only when the email link logged the user in (see the page)
export function ResetPasswordForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordSchemaType>({
        resolver: zodResolver(resetPasswordSchema),
    });

    // the toast + the redirect to login are inside useResetPassword
    const { mutate: resetPassword, isPending } = useResetPassword();

    return (
        <Card className="block w-full max-w-sm rounded-2xl p-7 shadow-lg sm:max-w-md sm:p-9">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-8 ring-primary/5">
                <ShieldCheck className="size-6" />
            </div>

            <div className="mt-6 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-[1.75rem]">
                    Choose a new password
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    8–18 characters with an uppercase letter, a lowercase letter, a number and a symbol.
                </p>
            </div>

            <form onSubmit={handleSubmit((data) => resetPassword(data))} className="mt-7 space-y-4" noValidate>

                {
                    resetPasswordFormInputs.map((input) => {
                        const IconComponent = input.icon;
                        return (
                            < Input
                                key={input.id}
                                id={input.id}
                                {...register(input.name)}
                                type={input.type}
                                label={input.label}
                                placeholder={input.placeholder}
                                leftIcon={<IconComponent size={15} />}
                                fullWidth={input.fullWidth}
                                autoComplete={input.autoComplete}
                                errorText={errors[input.name]?.message}
                            />
                        )
                    })
                }

                <Button
                    type="submit"
                    size="lg"
                    rounded="xl"
                    className="mt-2 h-11 w-full font-semibold"
                    isLoading={isPending}
                >
                    {isPending ? "Updating..." : "Update password"}
                </Button>
            </form>
        </Card>
    );
}
