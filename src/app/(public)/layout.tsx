import { Footer } from "@/components/shared/Footer"
import { Navbar } from "@/components/shared/Navbar"
import { ReactNode } from "react"

const PublicLayout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <Navbar />
            <main>
                {children}
            </main>
            <Footer />
        </>
    )
}
export default PublicLayout