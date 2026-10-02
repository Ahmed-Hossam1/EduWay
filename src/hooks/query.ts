import { useQuery } from "@tanstack/react-query"

export const useQueryTest = <T>(queryKey: string[], queryFn: () => Promise<T>) => {

    const { data, isPending, isError, error } = useQuery({ queryKey, queryFn })
    return { data, isPending, isError, error }
}