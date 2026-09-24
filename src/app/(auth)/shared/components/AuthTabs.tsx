import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface AuthTabsProps {
    activeTab: "login" | "signup";
}

export default function AuthTabs({ activeTab }: AuthTabsProps) {
    return (
        <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl border border-border bg-muted/50 p-1">
            {activeTab === "login" ? (
                <Button
                    type="button"
                    variant="default"
                    size="default"
                    className="h-8 w-full rounded-lg text-sm font-semibold"
                    aria-current="page"
                >
                    Sign In
                </Button>
            ) : (
                <Link
                    href="/login"
                    className={cn(
                        buttonVariants({ variant: "ghost", size: "default" }),
                        "h-8 w-full rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground"
                    )}
                >
                    Sign In
                </Link>
            )}

            {activeTab === "signup" ? (
                <Button
                    type="button"
                    variant="default"
                    size="default"
                    className="h-8 w-full rounded-lg text-sm font-semibold"
                    aria-current="page"
                >
                    Sign Up
                </Button>
            ) : (
                <Link
                    href="/signup"
                    className={cn(
                        buttonVariants({ variant: "ghost", size: "default" }),
                        "h-8 w-full rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground"
                    )}
                >
                    Sign Up
                </Link>
            )}
        </div>
    );
}
