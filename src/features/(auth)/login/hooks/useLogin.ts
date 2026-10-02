import { useMutation } from "@tanstack/react-query"
import { loginService } from "../services/login"

export const useLogin = () => {
    return useMutation({
        mutationFn: loginService
    })
}