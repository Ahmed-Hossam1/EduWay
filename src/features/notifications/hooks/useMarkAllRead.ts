import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { markAllReadService } from "../services/markAllRead";
import { notificationsQueryKey } from "./useMyNotifications";

/**
 * "Mark all read" in the bell.
 * The dashboard bell comes from the server (the @notifications slot) → router.refresh().
 * The site navbar bell comes from React Query → invalidate.
 *
 *   const { mutate: markAllRead, isPending } = useMarkAllRead();
 */
export const useMarkAllRead = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: markAllReadService,

        onSuccess: () => {
            // the red count + the bold rows update (in both bells)
            router.refresh();
            queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
        },

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Couldn't update your notifications"));
        },
    });
};
