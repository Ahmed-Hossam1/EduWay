"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

// Wraps the app so every component can use React Query (useQuery / useMutation)
export const QueryClientProviders = ({ children }: { children: React.ReactNode }) => {
    // useState(() => ...) → the client (and its cache) is created once, not on every render
    const [queryClient] = useState(() => new QueryClient());

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
