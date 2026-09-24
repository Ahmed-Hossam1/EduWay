"use client";

import { ArrowRight, EyeOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import RoleSelector from "./RoleSelector";
import { AuthTabs, SocialLogin } from "@/app/(auth)/shared/components";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { signupInputs } from "../data/AuthInputConfig";
import { signupSchema, signupSchemaType } from "../schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase/client";
import { useState } from "react";
import { AuthRole } from "../types";


function SignupForm() {
    const [selectedRole, setSelectedRole] = useState<AuthRole>("student")
    const { register, handleSubmit, formState: { errors } } = useForm<signupSchemaType>({
        resolver: zodResolver(signupSchema),

    });

    const onSubmit = async (data: signupSchemaType) => {
        const { data: authData, error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: {
                    first_name: data.firstName,
                    last_name: data.lastName,
                    role: selectedRole
                }
            }

        });
        if (error) {
            console.log(error);
        } else {
            console.log(authData);
        }
    };

    return (
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-7 shadow-lg sm:max-w-md sm:p-9">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-[1.75rem]">
                    Create your{" "}
                    <span className="text-primary">EduWay</span> account
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    Join thousands of learners today
                </p>
            </div>

            {/* Auth tabs */}
            <AuthTabs activeTab="signup" />

            {/* Form */}
            <form className="mt-6 space-y-4" >
                {/* Data-driven inputs */}
                <div className="grid grid-cols-2 gap-3">
                    {signupInputs.map((input) => {
                        const IconComponent = input.icon;
                        return (
                            <div
                                key={input.name}
                                className={input.halfWidth ? "col-span-1" : "col-span-2"}
                            >
                                <Input
                                    id={input.id || input.name}
                                    type={input.type}
                                    {...register(input.name)}
                                    placeholder={input.placeholder}
                                    leftIcon={<IconComponent className="size-4" />}
                                    rightIcon={
                                        input.hasTogglePassword ? (
                                            <EyeOff className="size-4" />
                                        ) : undefined
                                    }
                                    variant="outline"
                                    Size="md"
                                    rounded="lg"
                                    fullWidth
                                    aria-label={input.placeholder}
                                    autoComplete={input.autoComplete}
                                    errorText={errors[input.name]?.message}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Role selector (Student / Teacher only) */}
                <RoleSelector selectedRole={selectedRole} onSelectRole={setSelectedRole} />

                {/* Terms and Privacy */}
                <label
                    htmlFor="terms"
                    className="flex cursor-pointer items-start gap-2.5 pt-0.5 text-sm"
                >
                    <Checkbox />
                    <span>
                        I agree to the{" "}
                        <Link
                            href="/terms"
                            className="font-medium text-primary hover:underline"
                        >
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                            href="/privacy"
                            className="font-medium text-primary hover:underline"
                        >
                            Privacy Policy
                        </Link>
                    </span>
                </label>

                {/* Primary CTA */}
                <Button
                    onClick={handleSubmit(onSubmit)}
                    variant="default"
                    size="lg"
                    className="mt-2 h-11 w-full rounded-xl font-semibold"
                >
                    Create Account
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

            {/* Sign in link */}
            <p className="mt-7 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="font-semibold text-primary transition-colors hover:text-primary-hover hover:underline"
                >
                    Sign in
                </Link>
            </p>
        </div>
    );
}

export default SignupForm;
