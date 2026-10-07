import { getUserService } from "@/services/auth/getUser"
import { useQueryClient } from "./useQuery"

export const useProfile = () => {
    return useQueryClient(["profile"], getUserService)
}