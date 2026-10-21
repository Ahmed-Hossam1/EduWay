import * as React from "react"

const MOBILE_BREAKPOINT = 768

/*
 * useIsMobile Hook
 *
 * Purpose:
 * Detects whether the current screen is considered mobile based on a
 * predefined breakpoint (MOBILE_BREAKPOINT).
 *
 * How it works:
 * 1. Initializes isMobile as undefined because the screen size is checked
 *    after the component mounts.
 * 2. Uses window.matchMedia() to create a media query that matches screens
 *    narrower than the mobile breakpoint.
 * 3. Defines onChange to update isMobile whenever the screen size crosses
 *    the media query breakpoint.
 * 4. Checks the initial screen width and sets isMobile to true or false.
 * 5. Removes the event listener when the component unmounts to prevent
 *    memory leaks.
 *
 * Return value:
 * Returns a boolean:
 * - true  -> The screen width is below the mobile breakpoint.
 * - false -> The screen width is equal to or above the breakpoint.
 *
 * Usage:
 * Use this hook when you need different behavior or rendering for mobile
 * and desktop screens, such as showing a mobile menu or changing a layout.
 *
 * Note:
 * The hook returns !!isMobile to convert the initial undefined value to
 * false, ensuring that the returned value is always a boolean.
 */

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
