import { QueryFunction, QueryKey, useQuery } from "@tanstack/react-query"

export const useQueryClient = <T>(queryKey: QueryKey, queryFn: QueryFunction<T>) => {

    const { data, isPending, error } = useQuery({ queryKey, queryFn })
    return { data, isPending, error }
}