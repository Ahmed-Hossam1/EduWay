"use client";

import { Button } from "@/components/ui/button";
import { AuthRole } from "@/features/(auth)/signup/types";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { assignRoleAction } from "../actions/assignRole";
import { rolesData } from "../data/rolesData";
import ChooseRoleCard from "./ChooseRoleCard";

export default function ChooseRoleForm() {
    const [selectedRole, setSelectedRole] = useState<AuthRole | null>(null);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    function handleSubmit() {
        if (!selectedRole) return;
        setError(null);
        startTransition(async () => {
            try {
                await assignRoleAction(selectedRole);
            } catch (error) {
                if (error instanceof Error) {
                    console.error(error)
                } else {
                    setError("Something went wrong. Please try again.");
                }
            }
        });
    }

    return (
        <div className="flex w-full max-w-2xl flex-col gap-8">
            {/* Role Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {rolesData.map((roleItem) => (
                    <ChooseRoleCard
                        key={roleItem.role}
                        {...roleItem}
                        selected={selectedRole === roleItem.role}
                        onClick={() => setSelectedRole(roleItem.role)}
                    />
                ))}
            </div>

            {/* Submit */}
            <Button
                id="choose-role-submit"
                size="lg"
                disabled={!selectedRole || isPending}
                onClick={handleSubmit}
                className="w-full rounded-xl text-base font-semibold transition-all duration-200"
            >
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
                        Setting up your account…
                    </>
                ) : (
                    "Continue"
                )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
                You can update your role later from your account settings.
            </p>
        </div>
    );
}
