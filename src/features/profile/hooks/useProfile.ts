import { useAppQuery } from "@/hooks/useAppQuery";
import { getMyProfileService } from "../services/getMyProfile";

// The cache key of the logged-in user's profile (import it instead of writing ["profile"] again)
export const profileQueryKey = ["profile"];

const FIVE_MINUTES = 5 * 60 * 1000;

export const useProfile = () => {
    return useAppQuery(profileQueryKey, getMyProfileService, {
        // read from the cache, but ask again after 5 minutes (e.g. an admin approved the teacher → new menu)
        staleTime: FIVE_MINUTES,
        gcTime: FIVE_MINUTES,
        retry: false, // a guest gets 401 → no need to try again
    });
};
