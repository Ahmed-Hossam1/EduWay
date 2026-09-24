import Link from "next/link";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Logo } from "@/components/shared/Logo";

export default function AuthHeader() {
    return (
        <div className="flex items-center justify-between px-6 pt-6 sm:px-10 lg:px-12">
            <Link
                href="/"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground lg:hidden"
            >
                <Logo />
            </Link>
            {/* Desktop spacer: Logo is displayed inside the hero section */}
            <div className="hidden lg:block" />

            <AnimatedThemeToggler
                variant="circle"
                className="flex size-9 cursor-pointer items-center justify-center rounded-lg border border-border bg-muted/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Toggle theme"
            />
        </div>
    );
}
