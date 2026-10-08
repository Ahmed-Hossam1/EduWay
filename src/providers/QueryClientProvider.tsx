"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const QueryClientProviders = ({ children }: { children: React.ReactNode }) => {
    // useState keeps the same client (and its cache) across re-renders
    const [queryClient] = useState(() => new QueryClient())
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

export default QueryClientProviders
