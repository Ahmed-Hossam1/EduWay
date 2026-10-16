import { useMutation } from "@tanstack/react-query"
import { AUTH_MUTATION_KEY } from "../../shared/hooks/useIsAuthBusy"
import { signupService } from "../services/signup"

export const useSignup = () => {
    return useMutation({
        mutationKey: AUTH_MUTATION_KEY,
        mutationFn: signupService
    })
}
