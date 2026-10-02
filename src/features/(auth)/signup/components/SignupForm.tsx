"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Input from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { type AxiosError } from "axios";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AuthTabs, SocialLogin } from "../../shared/components";
import { signupInputs } from "../data/AuthInputConfig";
import { useSignup } from "../hooks/useSignup";
import { signupSchema, signupSchemaType } from "../schema/schema";
import { AuthRole } from "../types";
import RoleSelector from "./RoleSelector";


function SignupForm() {
    const [selectedRole, setSelectedRole] = useState<AuthRole>("student");
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<signupSchemaType>({
        resolver: zodResolver(signupSchema),
        defaultValues: { selectedRole: "student" },
    });
    const { mutateAsync, isPending, error } = useSignup()

    const router = useRouter()

    //  choose role handler  
    const handleRoleSelect = (role: AuthRole) => {
        setSelectedRole(role);
        setValue("selectedRole", role, { shouldValidate: true });
    };
    //  submit handler for sign up form     
    const onSubmit = async (data: signupSchemaType) => {
        try {
            const response = await mutateAsync(data)
            toast.success("Account created successfully")
            setTimeout(() => {
                router.push(response.nextRoute)
            }, 400)
        } catch (err) {
            console.error(err)
            if (axios.isAxiosError(err)) {
                const axiosError = err as AxiosError<{ message: string }>
                const message = axiosError.response?.data?.message ?? "Failed to create account"
                toast.error(message)
            } else {
                toast.error("Something went wrong. Please try again.")
            }
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
            <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
                                    variant="outline"
                                    Size="md"
                                    rounded="lg"
                                    fullWidth
                                    aria-label={input.placeholder}
                                    errorText={errors[input.name]?.message}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Role selector (Student / Teacher only) */}
                <RoleSelector selectedRole={selectedRole} onSelectRole={handleRoleSelect} />

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
                    type="submit"
                    variant="default"
                    size="lg"
                    className="mt-2 h-11 w-full rounded-xl font-semibold"
                    disabled={isPending}
                >
                    {isPending ?
                        <>
                            <span>Creating account...</span>
                            <Spinner className="size-4" />

                        </>
                        :
                        <>
                            <span>Create Account</span>
                            <ArrowRight className="size-4" />
                        </>
                    }
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
