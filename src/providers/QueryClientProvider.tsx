"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";



// this line of code s from 7 to line 18 
// i added it for window.__react-query__ devtools to work in development  and dose not effect anything in code 

const queryClient = new QueryClient();
// TypeScript only:
declare global {
    interface Window {
        __TANSTACK_QUERY_CLIENT__:
        import('@tanstack/query-core')
        .QueryClient
    }
}

window.__TANSTACK_QUERY_CLIENT__ = queryClient


// Provider that wraps the app with QueryClientProvider to make it available to all child components 
export const QueryClientProviders = ({ children }: { children: React.ReactNode }) => {
    // useState keeps the same client (and its cache) across re-renders
    const [state] = useState(queryClient);
    return <QueryClientProvider client={state}>{children}</QueryClientProvider>;
};
