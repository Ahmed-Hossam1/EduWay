"use client";

import { Button } from "@/components/ui/button";
import { AuthRole } from "@/features/auth/shared/types";
import { useState } from "react";
import { rolesData } from "../data/rolesData";
import { useRole } from "../hooks/useRole";
import { ChooseRoleCard } from "./ChooseRoleCard";

export function ChooseRoleForm() {
    const [selectedRole, setSelectedRole] = useState<AuthRole | null>(null);
    // the redirect + the error toast are inside useRole
    const { mutate: chooseRole, isPending } = useRole();

    function handleSubmit() {
        if (!selectedRole) return;
        chooseRole(selectedRole);
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
                disabled={!selectedRole}
                isLoading={isPending}
                onClick={handleSubmit}
                rounded="xl"
                className="w-full text-base font-semibold transition-all duration-200"
            >
                {isPending ? "Setting up your account…" : "Continue"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
                You can update your role later from your account settings.
            </p>
        </div>
    );
}
