import { Caveat } from "next/font/google";

// A hand-written font, only for the small quote in the corner
const caveat = Caveat({ subsets: ["latin"], weight: "500" });

// The bottom of the card: soft waves + "Small Steps, Big Progress" (decoration only)
export function ForgotPasswordWaves() {
    return (
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-44">
            <svg viewBox="0 0 400 180" preserveAspectRatio="none" className="absolute inset-0 size-full">
                <path
                    d="M0 70 C 90 20, 170 120, 260 80 S 380 40, 400 60 L400 180 L0 180 Z"
                    fill="var(--primary)"
                    fillOpacity="0.08"
                />
                <path
                    d="M0 110 C 80 60, 160 150, 250 115 S 370 80, 400 100 L400 180 L0 180 Z"
                    fill="var(--primary)"
                    fillOpacity="0.12"
                />
                <path
                    d="M0 145 C 100 110, 190 175, 290 145 S 380 130, 400 140 L400 180 L0 180 Z"
                    fill="var(--primary)"
                    fillOpacity="0.16"
                />
            </svg>

            <p
                className={`${caveat.className} absolute right-8 bottom-8 -rotate-6 text-right text-2xl leading-7 text-primary/80`}
            >
                Small
                <br />
                Steps
                <br />
                Big Progress
                <span className="mt-1 ml-auto block h-0.5 w-20 rounded-full bg-primary/60" />
            </p>
        </div>
    );
}
