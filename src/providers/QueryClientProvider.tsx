"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";



// this line of code s from 7 to line 18 
// i added it for window.__react-query__ devtools to work in development  and dose not effect anything in code 


// Provider that wraps the app with QueryClientProvider to make it available to all child components 
export const QueryClientProviders = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient();
    // useState keeps the same client (and its cache) across re-renders
    const [state] = useState(queryClient);
    return <QueryClientProvider client={state}>{children}</QueryClientProvider>;
};
