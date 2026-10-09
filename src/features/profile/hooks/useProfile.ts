import { useAppQuery } from "@/hooks/useAppQuery"
import { getMyProfileService } from "../services/getMyProfile"

export const useProfile = () => {
    return useAppQuery(["profile"], getMyProfileService, {
        staleTime: Infinity, // fetch once, then read from the cache
        retry: false,        // a guest gets 401 → no need to try again
    })
}
