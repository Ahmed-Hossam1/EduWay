import { useMutation } from "@tanstack/react-query"
import { signupService } from "../service/signup"

export const useSignup = () => {
    return useMutation({
        mutationFn: signupService
    })
}