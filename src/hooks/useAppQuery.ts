import { QueryFunction, QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query";

const THREE_MINUTES = 3 * 60 * 1000;

export const useAppQuery = <T>(
    queryKey: QueryKey,
    queryFn: QueryFunction<T>,
    options?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">,
) => {
    return useQuery({ queryKey, queryFn, staleTime: THREE_MINUTES, gcTime: THREE_MINUTES, ...options });
};
