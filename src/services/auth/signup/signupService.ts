import { signupSchemaType } from "@/features/(auth)/signup/schema/schema";
import { supabaseClient } from "@/lib/supabase/client";


export const signupService = async (data: Omit<signupSchemaType, 'confirmPassword'>) => {
    const { email, password, firstName, lastName, selectedRole } = data;
    const { data: user, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
            data: {
                first_name: firstName,
                last_name: lastName,
                role: selectedRole
            }
        }

    });

    if (error) {
        throw (error)
    }
    return user
}

