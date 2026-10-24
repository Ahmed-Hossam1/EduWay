import { supabaseClient } from "@/lib/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => supabaseClient.auth.signOut(),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["profile"] });
            const prevProfile = queryClient.getQueryData(["profile"]);
            queryClient.setQueryData(["profile"], null);
            queryClient.removeQueries({ queryKey: ["wishlist"] });
            queryClient.removeQueries({ queryKey: ["cart"] });
            queryClient.removeQueries({ queryKey: ["enrollments"] });

            return { prevProfile };
        },
        onError: (_error, _variables, context) => { // _ = not used, only context is needed
            queryClient.setQueryData(["profile"], context?.prevProfile);
        },
        onSuccess: () => {
            // a full page reload on purpose: every cache and every server component starts clean after logout
            location.href = "/";
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
};
