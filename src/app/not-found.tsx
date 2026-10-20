import { Metadata } from "next";
import { Compass } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { NotFoundView } from "@/components/shared/NotFoundView";

export const metadata: Metadata = {
    title: "Page not found",
};

// global notFound Page
// Any link that doesn't exist (/nothing-here, /about...)
export default function NotFound() {
    return (
        <>
            <Navbar />
            <main className="flex flex-1 flex-col">
                <NotFoundView
                    icon={Compass}
                    title="Page not found"
                    description="The page you're looking for doesn't exist or was moved. Let's get you back on track."
                    actions={[
                        { label: "Back to home", href: "/" },
                        { label: "Browse courses", href: "/courses" },
                    ]}
                />
            </main>
            <Footer />
        </>
    );
}
