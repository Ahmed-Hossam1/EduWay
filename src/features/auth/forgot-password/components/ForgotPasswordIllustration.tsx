import { Lock } from "lucide-react";

// The picture at the top of the card: an envelope + a lock badge + small lines around it
// Drawn with SVG + the theme colors (var(--primary)) → it fits light and dark mode
export function ForgotPasswordIllustration() {
    return (
        <div aria-hidden className="relative mx-auto h-32 w-48">
            {/* the small lines around (left + right) */}
            <span className="absolute top-9 left-1 h-1 w-5 -rotate-20 rounded-full bg-primary/70" />
            <span className="absolute top-16 left-0 h-1 w-6 rounded-full bg-primary/70" />
            <span className="absolute top-1 right-6 h-1 w-5 -rotate-50 rounded-full bg-primary/70" />
            <span className="absolute top-8 right-1 h-1 w-6 -rotate-12 rounded-full bg-primary/70" />
            <span className="absolute top-14 right-3 h-1 w-3 rotate-20 rounded-full bg-primary/50" />

            {/* the envelope */}
            <svg viewBox="0 0 140 96" className="absolute top-3 left-1/2 w-34 -translate-x-1/2 drop-shadow-lg">
                <defs>
                    <linearGradient id="envelope-body" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" style={{ stopColor: "var(--primary)", stopOpacity: 0.35 }} />
                        <stop offset="100%" style={{ stopColor: "var(--primary)", stopOpacity: 0.7 }} />
                    </linearGradient>
                </defs>
                <rect x="2" y="2" width="136" height="92" rx="14" fill="url(#envelope-body)" />
                {/* the bottom folds */}
                <path d="M6 88 L56 50 M134 88 L84 50" stroke="white" strokeOpacity="0.35" strokeWidth="3" fill="none" />
                {/* the top flap */}
                <path
                    d="M8 10 L70 56 L132 10"
                    stroke="white"
                    strokeOpacity="0.8"
                    strokeWidth="4"
                    strokeLinejoin="round"
                    fill="none"
                />
            </svg>

            {/* the lock badge */}
            <div className="absolute right-6 bottom-0 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-card">
                <Lock className="size-6" />
            </div>
        </div>
    );
}
