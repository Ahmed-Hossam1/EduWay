import { useMutation } from "@tanstack/react-query"
import { AUTH_MUTATION_KEY } from "../../shared/hooks/useIsAuthBusy"
import { loginService } from "../services/login"

export const useLogin = () => {
    return useMutation({
        mutationKey: AUTH_MUTATION_KEY,
        mutationFn: loginService
    })
}
