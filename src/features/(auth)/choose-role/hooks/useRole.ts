import { useMutation } from "@tanstack/react-query"
import { assignRole } from "../services/assignRole"

export const useRole = () => {
    return useMutation({
        mutationFn: assignRole
    })
}