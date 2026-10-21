import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// A tip card (no data → no skeleton, it shows right away)
// TODO: show it only when something is missing in the instructor profile
export function CompleteProfileCard() {
    return (
        <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 justify-center text-center">
            <CardHeader className="justify-items-center">
                <span className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <ShieldCheck className="size-6" />
                </span>
                <CardTitle className="font-bold">Complete your profile</CardTitle>
                <CardDescription className="text-xs">Add your LinkedIn link so students trust you more.</CardDescription>
            </CardHeader>
            <CardContent>
                {/* TODO: link to /teacher/profile when the page exists */}
                <Button size="sm" rounded="lg" disabled>
                    Update profile
                </Button>
            </CardContent>
        </Card>
    );
}
