import { supabaseClient } from "@/lib/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => supabaseClient.auth.signOut(),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["profile"] });
            const prevProfile = queryClient.getQueryData(["profile"])
            queryClient.setQueryData(["profile"], null);
            queryClient.removeQueries({ queryKey: ["wishlist"] });
            queryClient.removeQueries({ queryKey: ["cart"] });
            queryClient.removeQueries({ queryKey: ["enrollments"] });

            return { prevProfile }
        },
        onError: (err, variables, context) => {
            queryClient.setQueryData(["profile"], context?.prevProfile)
        },
        onSuccess: () => {
            location.href = "/"
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] })
        }
    })
}