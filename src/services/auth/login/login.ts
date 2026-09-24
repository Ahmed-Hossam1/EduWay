import { LoginSchemaType } from "@/features/login/schema/loginSchema";
import { supabase } from "@/lib/supabase/client";


export const loginService = async (data: LoginSchemaType) => {
    const { email, password } = data;
    const { data: user, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (error) {
        throw (error)
    }
    return user
}
