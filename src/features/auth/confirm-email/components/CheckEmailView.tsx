"use client";
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheckInboxCard } from "../../shared/components/CheckInboxCard";
import { useResendConfirmation } from "../hooks/useResendConfirmation";

type CheckEmailViewProps = {
    email: string; // the email the user signed up with
};

// After signing up (when "Confirm email" is on): "Check your inbox" + send the email again
export function CheckEmailView({ email }: CheckEmailViewProps) {
    const { mutate: resend, isPending } = useResendConfirmation();

    return (
        <CheckInboxCard
            description={
                <>
                    We sent a confirmation link to <span className="font-semibold text-foreground">{email}</span>. Click
                    it to activate your account.
                </>
            }
            note={<>Didn&apos;t get the email? Check your spam folder, or send it again.</>}
            action={
                <Button
                    variant="outline"
                    rounded="xl"
                    className="mt-5 h-11 w-full font-semibold"
                    isLoading={isPending}
                    onClick={() => resend({ email })}
                >
                    {isPending ? (
                        "Sending..."
                    ) : (
                        <>
                            <RotateCw className="size-4" />
                            Resend email
                        </>
                    )}
                </Button>
            }
        />
    );
}
