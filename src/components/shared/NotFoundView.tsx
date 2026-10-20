import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type NotFoundAction = {
    label: string;
    href: string;
};

type NotFoundViewProps = {
    icon: LucideIcon;
    title: string;
    description: string;
    actions: NotFoundAction[]; // the first one is the main (filled) button
};

/**
 * The "not found" message: the same look on every 404 page, only the words + buttons change.
 *
 *   <NotFoundView
 *       icon={BookX}
 *       title="Course not found"
 *       description="This course doesn't exist or isn't published anymore."
 *       actions={[{ label: "Browse courses", href: "/courses" }]}
 *   />
 */
export function NotFoundView({ icon: Icon, title, description, actions }: NotFoundViewProps) {
    return (
        <section className="container mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:py-28">
            {/* Big faded 404 + the icon on top of it */}
            <div className="relative flex items-center justify-center">
                <span className="text-8xl font-black tracking-tighter text-muted/70 select-none sm:text-9xl">404</span>
                <span className="absolute flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-8 ring-background">
                    <Icon className="size-8" />
                </span>
            </div>

            <h1 className="mt-6 text-2xl font-black tracking-tight text-foreground sm:text-3xl">{title}</h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p>

            {/* Buttons: the first one filled, the others outline */}
            <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
                {actions.map((action, index) => (
                    <Button
                        key={action.href}
                        variant={index === 0 ? "default" : "outline"}
                        rounded="xl"
                        className="h-11 px-6 font-semibold"
                        asChild
                    >
                        <Link href={action.href}>{action.label}</Link>
                    </Button>
                ))}
            </div>
        </section>
    );
}
