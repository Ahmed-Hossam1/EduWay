import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { markReadService } from "../services/markRead";
import { notificationsQueryKey } from "./useMyNotifications";

/**
 * A click on a notification → it becomes read (the bold title + the red count update).
 * Quiet: no toast (the click opens the notification's page anyway).
 *
 *   const { mutate: markRead } = useMarkRead();
 *   markRead(notification.id);
 */
export const useMarkRead = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: markReadService,

        onSuccess: () => {
            // the dashboard bell (server) + the site navbar bell (React Query)
            router.refresh();
            queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
        },

        onError: (error) => {
            console.error(error);
        },
    });
};
