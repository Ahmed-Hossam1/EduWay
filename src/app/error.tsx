"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCw, TriangleAlert } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

type ErrorPageProps = {
    error: Error & { digest?: string }; // digest = an id to find the error in the server logs
    reset: () => void; // tries to show the page again
};

// Shows when a page crashes (a 500: the database didn't answer, a bug in a server function...).
// It replaces the group layouts too, so we add the Navbar + Footer here.
export default function ErrorPage({ error, reset }: ErrorPageProps) {
    // keep the real error in the console (the user only sees a friendly message)
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <>
            {/* a client component can't export metadata → React puts this <title> in the <head> */}
            <title>Something went wrong | EduWay</title>
            <Navbar />
            <main className="flex flex-1 flex-col">
                <section className="container mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:py-28">
                    <span className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive ring-8 ring-destructive/5">
                        <TriangleAlert className="size-8" />
                    </span>

                    <h1 className="mt-6 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                        Something went wrong
                    </h1>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                        We couldn&apos;t load this page. It&apos;s not you, it&apos;s us. Please try again in a moment.
                    </p>

                    <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
                        <Button rounded="xl" className="h-11 px-6 font-semibold" onClick={() => reset()}>
                            <RotateCw className="size-4" />
                            Try again
                        </Button>
                        <Button variant="outline" rounded="xl" className="h-11 px-6 font-semibold" asChild>
                            <Link href="/">Back to home</Link>
                        </Button>
                    </div>

                    {/* the error id: useful when the user reports the problem */}
                    {error.digest && (
                        <p className="mt-6 font-mono text-xs text-muted-foreground/70">Error ID: {error.digest}</p>
                    )}
                </section>
            </main>
            <Footer />
        </>
    );
}
