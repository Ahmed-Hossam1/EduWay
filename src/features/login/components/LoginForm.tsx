"use client"
import { ArrowRight, Loader } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { loginInputs } from "../data/login-inputs";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { loginSchema, LoginSchemaType } from "../schema/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthTabs, SocialLogin } from "@/app/(auth)/shared/components";
import { loginService } from "@/services/auth/login/login";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

function LoginForm() {
    const { handleSubmit, register, formState: { errors, } } = useForm<LoginSchemaType>({
        resolver: zodResolver(loginSchema)
    })
    const [isLoading, setIsLoading] = useState<boolean>(false);


    const onSubmit = async (data: LoginSchemaType) => {
        try {
            setIsLoading(true)
            // login service 
            const { user } = await loginService(data)
            console.log(user)
            toast.success("login successful")
            setTimeout(() => {
                location.href = "/"
            }, 400)
        } catch (error) {
            if (error instanceof Error) {
                console.error(error)
                if (error.message === "Invalid login credentials") {

                    toast.error("Invalid login credentials ")
                }
                else
                    toast.error("failed to login")
            }
        } finally {
            setIsLoading(false)
        }
    }

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
            <AuthTabs activeTab="login" />

            {/* Form */}
            <form className="mt-6 space-y-4" >
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
                            autoComplete={input.autoComplete}
                            errorText={errors[input.name]?.message}
                            aria-label={input.placeholder}
                        />
                    );
                })}

                {/* Options row */}
                <div className="flex items-center justify-between pt-0.5">
                    <label
                        htmlFor="remember-me"
                        className="flex cursor-pointer items-start gap-2.5 pt-0.5 text-sm"

                    >
                        <Checkbox />
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
                    onClick={handleSubmit(onSubmit)}
                    variant="default"
                    disabled={isLoading}
                    size="lg"
                    className="mt-2 h-11 w-full rounded-xl font-semibold"
                >
                    {isLoading ?
                        <>
                            <span>Signing in...</span>
                            <Spinner className="size-4" />
                        </>
                        :
                        <>
                            <span>sign in</span>
                            < ArrowRight className="size-4" />
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