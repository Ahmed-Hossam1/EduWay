"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Input from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AuthTabs } from "../../shared/components";
import { SocialLogin } from "../../oauth/components";
import { signupInputs } from "../data/AuthInputConfig";
import { useSignup } from "../hooks/useSignup";
import { useIsAuthBusy } from "../../shared/hooks/useIsAuthBusy";
import { signupSchema, signupSchemaType } from "../schemas/signupSchema";


function SignupForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<signupSchemaType>({
        resolver: zodResolver(signupSchema),

    });
    const { mutateAsync, isPending } = useSignup()
    // any sign-in running (email or Google / GitHub) → the button can't be clicked
    const isAuthBusy = useIsAuthBusy()

    const router = useRouter()

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
            toast.error(getErrorMessage(err, "Failed to create account"))
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
                    rounded="xl" className="mt-2 h-11 w-full font-semibold"
                    isLoading={isPending}
                    disabled={isAuthBusy}
                >
                    {isPending ? (
                        "Creating account..."
                    ) : (
                        <>
                            Create Account
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

            {/* Sign in link */}
            <p className="mt-7 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                    href="/auth/login"
                    className="font-semibold text-primary transition-colors hover:text-primary-hover hover:underline"
                >
                    Sign in
                </Link>
            </p>
        </div>
    );
}

export default SignupForm;
