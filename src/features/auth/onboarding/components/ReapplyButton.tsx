"use client";

import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReapply } from "../hooks/useReapply";

// "Try again" on /account/rejected → back to the onboarding with his old answers
export function ReapplyButton() {
    const { mutate: reapply, isPending } = useReapply();

    return (
        <Button rounded="xl" className="h-11 w-full sm:flex-1" isLoading={isPending} onClick={() => reapply()}>
            {isPending ? (
                "Opening..."
            ) : (
                <>
                    <RotateCw className="size-4" />
                    Try again
                </>
            )}
        </Button>
    );
}
