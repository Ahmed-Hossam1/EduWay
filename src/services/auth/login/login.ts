import { LoginSchemaType } from "@/features/login/schema/loginSchema";
import { supabaseClient } from "@/lib/supabase/client";


export const loginService = async (data: LoginSchemaType) => {
    const { email, password } = data;
    const { data: user, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
    })

    if (error) {
        throw (error)
    }
    return user
}
