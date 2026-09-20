"use client"
import { ThemeProvider } from "next-themes";

const NextThemeProvider = ({ children }: { children: React.ReactNode }) => {
    return <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>{children}</ThemeProvider>

}
export default NextThemeProvider