"use client";

import Link from "next/link";
import "./globals.css";

type GlobalErrorProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

// The last safety net: the ROOT layout itself crashed, so nothing else works
// (no providers, no Navbar, no theme) a simple page with its own <html> and <body>.
export default function GlobalError({ error, reset }: GlobalErrorProps) {
    return (
        <html lang="en">
            <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-4 text-center font-sans text-zinc-900">
                <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Something went wrong</h1>
                <p className="max-w-md text-sm text-zinc-500">
                    EduWay couldn&apos;t load. Please try again, or come back in a few minutes.
                </p>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => reset()}
                        className="h-11 rounded-xl bg-[#5624d0] px-6 text-sm font-semibold text-white hover:bg-[#4a1fb5]"
                    >
                        Try again
                    </button>
                    <Link
                        href="/"
                        className="flex h-11 items-center rounded-xl border border-zinc-300 px-6 text-sm font-semibold hover:bg-zinc-100"
                    >
                        Back to home
                    </Link>
                </div>

                {error.digest && <p className="font-mono text-xs text-zinc-400">Error ID: {error.digest}</p>}
            </body>
        </html>
    );
}
