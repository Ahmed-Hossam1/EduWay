"use client";

import { useState } from "react";
import { GraduationCap, School } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthRole } from "../types";
import { roles } from "../data/RoleOption";

interface RoleSelectorProps {
    selectedRole: AuthRole;
    onSelectRole: (role: AuthRole) => void;
}

export default function RoleSelector({
    selectedRole,
    onSelectRole,
}: RoleSelectorProps) {

    return (
        <div className="space-y-2.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                I am a
            </p>
            <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => {
                    const Icon = role.icon;
                    const isActive = role.id === selectedRole;
                    return (
                        <button
                            key={role.id}
                            type="button"
                            onClick={() => onSelectRole(role.id)}
                            aria-pressed={isActive}
                            className={cn(
                                "flex flex-col items-center gap-1.5 rounded-xl border px-4 py-3.5 text-center transition-all cursor-pointer",
                                isActive
                                    ? "border-primary bg-primary/8 text-primary"
                                    : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:bg-muted/50 hover:text-foreground"
                            )}
                        >
                            <Icon className="size-5 shrink-0" />
                            <span className="text-sm font-semibold leading-none">
                                {role.label}
                            </span>
                            <span className="text-xs leading-none opacity-70">
                                {role.subLabel}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
