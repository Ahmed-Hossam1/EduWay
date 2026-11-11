import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCard } from "./DashboardCard";

// A tip card (no data → no skeleton, it shows right away)
// TODO: show it only when something is missing in the instructor profile
export function CompleteProfileCard() {
    return (
        <DashboardCard className="justify-center text-center">
            <CardHeader className="justify-items-center">
                <span className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <ShieldCheck className="size-6" />
                </span>
                <CardTitle className="font-bold">Complete your profile</CardTitle>
                <CardDescription className="text-xs">Add your LinkedIn link so students trust you more.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button size="sm" rounded="lg" asChild>
                    <Link href="/teacher/profile">Update profile</Link>
                </Button>
            </CardContent>
        </DashboardCard>
    );
}
