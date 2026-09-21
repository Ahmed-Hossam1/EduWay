"use client";

import Image from "next/image";
import Link from "next/link";

export function Logo() {

  // Instead of conditionally rendering the logo based on the current theme,
  // which would require `useTheme()`, `resolvedTheme`, and a `useEffect`
  // to wait for the initial render and avoid hydration mismatches,
  // we render both logo variants and let CSS handle the visibility.
  //
  // Tailwind's `dark:` utilities automatically show the correct logo:
  // `dark:hidden` hides the light logo in dark mode,
  // while `hidden dark:block` shows the dark logo.
  // This keeps the component simple and avoids theme-based conditional rendering.

  return (
    <Link href="/" className="relative inline-flex">
      <Image
        src="/logo-light.png"
        alt="EduWay"
        width={60}
        height={60}
        className="block dark:hidden"
      />

      <Image
        src="/logo-dark.png"
        alt="EduWay"
        width={60}
        height={60}
        className="hidden dark:block"
      />
    </Link>
  );
}