import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// The top of the About page: who we are + the 2 main buttons + a picture
export function AboutHero() {
    return (
        <section className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
                {/* Left: the words + buttons */}
                <div>
                    <Badge variant="accent" className="h-auto px-3 py-1 font-semibold">
                        About us
                    </Badge>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                        Your way to <span className="text-primary">learn, grow,</span> and succeed
                    </h1>
                    <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
                        EduWay is an online learning platform where real instructors teach practical skills. You watch
                        smooth HD lessons, ask questions under every lesson, and track your progress until you finish.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Button asChild size="lg">
                            <Link href="/courses">
                                Browse courses
                                <ArrowRight />
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline">
                            <Link href="/auth/signup">Become an instructor</Link>
                        </Button>
                    </div>
                </div>

                {/* Right: the picture */}
                <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-muted shadow-xl ring-1 ring-foreground/10 sm:aspect-4/3">
                    <Image
                        src="/images/hero-student.jpg"
                        alt="A student learning online"
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                    />
                </div>
            </div>
        </section>
    );
}
