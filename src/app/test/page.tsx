"use client"
import { Play } from "lucide-react";
import { useEffect, useState } from "react"

export default function test() {
    const [progress, setProgress] = useState<number>(0)

    function delay(ms: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }


    async function test() {
        for (let i = 0; i <= 100; i += 10) {
            setProgress(i);
            await delay(500);
        }
    }


    return (
        <div className="mx-auto w-full max-w-2xl space-y-4">

            {/* Video Preview */}
            <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-900">

                {/* Poster */}
                <img
                    src="/images/video-poster.jpg"
                    alt="Course video preview"
                    className="h-full w-full object-cover"
                />

                {/* Loading Overlay - Apply your logic here */}
                <div
                    data-progress-overlay
                    className="absolute inset-0 bg-white transition-opacity duration-300"
                    style={{
                        opacity: 0.8 * (1 - progress / 100)
                    }}
                >
                    <Play className="mb-3 size-10 text-white" />

                    <p className="text-sm font-medium text-white">
                        Preparing video preview...
                    </p>

                    <span
                        data-progress-label
                        className="mt-2 text-sm text-white/70"
                    >
                        {progress}%
                    </span>
                </div>

            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={test}
                    className="rounded-lg  cursor-pointer bg-violet-600 px-5 py-2 text-sm text-white"
                >
                    Start Loading
                </button>

                <button
                    type="button"
                    className="rounded-lg border cursor-pointer border-zinc-700 px-5 py-2 bg-black text-sm text-white"
                >
                    Reset
                </button>
            </div>

            {/* Status */}
            <p data-status className="text-sm text-zinc-400">
                Waiting to start...
            </p>

        </div >
    )
}