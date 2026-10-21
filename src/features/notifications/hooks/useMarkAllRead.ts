import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { markAllReadService } from "../services/markAllRead";

/**
 * "Mark all read" in the bell.
 * The notifications come from the server (the @notifications slot), not from React Query,
 * so after the update we ask the server for the page again: router.refresh().
 *
 *   const { mutate: markAllRead, isPending } = useMarkAllRead();
 */
export const useMarkAllRead = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: markAllReadService,

        onSuccess: () => {
            router.refresh(); // the red count + the bold rows update
        },

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Couldn't update your notifications"));
        },
    });
};
