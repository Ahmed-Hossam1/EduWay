import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextThemeProvider } from "@/providers/NextThemeProvider";
import { Toaster } from "sonner";
import { CircleAlert, CircleCheck, CircleX, Loader } from "lucide-react";
import { QueryClientProviders } from "@/providers/QueryClientProvider";
import { OAuthErrorRedirect } from "@/features/auth/oauth/components/OAuthErrorRedirect";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const domain = process.env.NEXT_PUBLIC_APP_URL
const url = String(domain)
export const metadata: Metadata = {
    metadataBase: new URL(url),

    title: {
        default: "EduWay",
        template: "%s | EduWay",
    },

    description:
        "EduWay — Your Way to Learn, Grow, and Succeed ,  is a modern learning platform that helps you learn new skills, track your progress, and build your path toward your goals.",

    applicationName: "EduWay",

    keywords: [
        "EduWay",
        "online learning",
        "online courses",
        "education platform",
        "e-learning",
        "learn online",
        "skills",
    ],

    authors: [{ name: "ahmed hossam" }],
    creator: "ahmed hossam",
    publisher: "ahmed hossam",

    robots: {
        index: true,
        follow: true,
    },

    openGraph: {
        type: "website",
        locale: "en_US",
        url: url,
        siteName: "EduWay",
        title: "EduWay — Your Way to Learn, Grow, and Succeed",
        description: "Learn new skills, track your progress, and build your path toward your goals with EduWay.",
        images: [
            {
                url: "/favicon.ico",
                width: 1200,
                height: 630,
                alt: "EduWay — Your Way to Learn, Grow, and Succeed",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "EduWay — Your Way to Learn, Grow, and Succeed",
        description: "Learn new skills, track your progress, and build your path toward your goals with EduWay.",
        images: ["/favicon.ico"],
    },

    icons: {
        icon: "/favicon.ico",
        apple: "/apple-icon.png",
    },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
            suppressHydrationWarning
        >
            <body className="min-h-full flex flex-col">
                <NextThemeProvider>
                    <QueryClientProviders>
                        {children}
                        <Toaster
                            position="top-right"
                            icons={{
                                success: <CircleCheck />,
                                warning: <CircleAlert />,
                                error: <CircleX />,
                                loading: <Loader />,
                            }}
                        />
                        {/* Google / GitHub sign-in failed → Supabase puts the error in the URL → OAuth failure page */}
                        <OAuthErrorRedirect />
                    </QueryClientProviders>
                </NextThemeProvider>
            </body>
        </html>
    );
}
