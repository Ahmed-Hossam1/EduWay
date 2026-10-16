"use client"
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

// ─────────────────────────────────────────────────────────────────────
// Small helpers to change a list of ids (the cache of cart / wishlist / enrollments)
// ─────────────────────────────────────────────────────────────────────

// add the id at the start (only once)   ["b"] + "a" → ["a", "b"]
export const addId = (ids: string[] = [], id: string) => (ids.includes(id) ? ids : [id, ...ids])

// remove the id   ["a", "b"] - "a" → ["b"]
// (list not loaded yet → stays undefined, nothing to change)
export const removeId = (ids: string[] | undefined, id: string) => ids?.filter((item) => item !== id)


// ─────────────────────────────────────────────────────────────────────
// The hook
// ─────────────────────────────────────────────────────────────────────

// One cached list to change: which list (queryKey) + how (update)
type IdsUpdate<TVariables> = {
    queryKey: QueryKey
    update: (ids: string[] | undefined, variables: TVariables) => string[] | undefined
}

// A toast text, or a function when the text depends on what was clicked
type Message<TVariables> = string | ((variables: TVariables) => string)

type OptimisticIdsMutationOptions<TVariables> = {
    mutationFn: (variables: TVariables) => Promise<unknown>
    updates: IdsUpdate<TVariables>[]
    successMessage?: Message<TVariables> // not given → no success toast
    errorMessage: Message<TVariables>
}

/**
 * A mutation with an OPTIMISTIC UPDATE on one or more lists of ids:
 *   1- before the request: change the cached lists right away (the UI updates at once)
 *   2- the request runs in the background
 *   3- it failed → put the old lists back + error toast
 *   4- in the end → refetch the lists so the cache matches the database
 *
 *   useOptimisticIdsMutation({
 *       mutationFn: (courseId: string) => removeFromCartService(courseId),
 *       updates: [{ queryKey: cartQueryKey, update: (ids, courseId) => removeId(ids, courseId) }],
 *       successMessage: "Removed from cart",
 *       errorMessage: "Couldn't remove from cart",
 *   })
 */
export const useOptimisticIdsMutation = <TVariables = void>({
    mutationFn,
    updates,
    successMessage,
    errorMessage,
}: OptimisticIdsMutationOptions<TVariables>) => {
    const queryClient = useQueryClient()
    const queryKeys = updates.map((item) => item.queryKey)

    // "text" or (variables) => "text"  →  "text"
    const getMessage = (message: Message<TVariables>, variables: TVariables) =>
        typeof message === "function" ? message(variables) : message

    return useMutation({
        mutationFn,

        // 1- before the request
        onMutate: async (variables) => {
            // stop running fetches of these lists, so they can't overwrite our change
            await Promise.all(queryKeys.map((queryKey) => queryClient.cancelQueries({ queryKey })))

            // keep the old lists (same order as queryKeys), to undo if the request fails
            const previousLists = queryKeys.map((queryKey) => queryClient.getQueryData<string[]>(queryKey))

            // change every list right away
            updates.forEach(({ queryKey, update }) => {
                queryClient.setQueryData<string[]>(queryKey, (ids) => update(ids, variables))
            })

            return { previousLists }
        },

        // 3- the request failed: undo
        onError: (_error, variables, context) => {
            queryKeys.forEach((queryKey, index) => {
                queryClient.setQueryData(queryKey, context?.previousLists[index])
            })
            toast.error(getMessage(errorMessage, variables))
        },

        onSuccess: (_data, variables) => {
            if (successMessage) toast.success(getMessage(successMessage, variables))
        },

        // 4- success or error: make sure the cache matches the database
        onSettled: () => {
            queryKeys.forEach((queryKey) => queryClient.invalidateQueries({ queryKey }))
        },
    })
}
