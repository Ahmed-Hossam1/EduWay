import { Marquee } from "@/components/ui/marquee"
import Image from "next/image"

// Logos sourced from /public/companies logo/
const imageLogos = [
  { src: "/companies logo/cisco_logo.svg", alt: "Cisco", width: 150, height: 40 },
  { src: "/companies logo/citi_logo.svg", alt: "Citi", width: 150, height: 40 },
  { src: "/companies logo/ericsson_logo.svg", alt: "Ericsson", width: 150, height: 40 },
  { src: "/companies logo/procter_gamble_logo.svg", alt: "P&G", width: 150, height: 40 },
  { src: "/companies logo/samsung_logo.svg", alt: "Samsung", width: 150, height: 40 },
  { src: "/companies logo/volkswagen_logo.svg", alt: "Volkswagen", width: 150, height: 40 },
]

function LogoCard({ src, alt, width, height }: { src: string; alt: string; width: number; height: number }) {
  return (
    <div className="group mx-3 flex h-16 w-44 shrink-0 items-center justify-center rounded-2xl border border-border/50 bg-background/60 px-6 backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-background hover:shadow-md dark:bg-muted/30 dark:hover:bg-muted/60">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="h-7 w-auto object-contain opacity-50 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0 dark:invert"
      />
    </div>
  )
}

export function CompanyLogos() {
  return (
    <div className="relative flex w-full items-center overflow-hidden py-2">
      <Marquee pauseOnHover className="[--duration:25s]" repeat={6}>
        {imageLogos.map((logo, idx) => (
          <LogoCard key={idx} {...logo} />
        ))}
      </Marquee>
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-linear-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-linear-to-l from-background to-transparent" />
    </div>
  )
}
