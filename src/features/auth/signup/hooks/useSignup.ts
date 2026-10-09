import { useMutation } from "@tanstack/react-query"
import { signupService } from "../services/signup"

export const useSignup = () => {
    return useMutation({
        mutationFn: signupService
    })
}