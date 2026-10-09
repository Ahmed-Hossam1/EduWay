import { QueryFunction, QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query"

export const useAppQuery = <T>(queryKey: QueryKey, queryFn: QueryFunction<T>, options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>) => {

    return useQuery({ queryKey, queryFn, ...options })

}

