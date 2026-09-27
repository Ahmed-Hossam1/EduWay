import { signupSchemaType } from "@/features/signup/schema/schema";
import { supabase } from "@/lib/supabase/client";


export const signupService = async (data: Omit<signupSchemaType, 'confirmPassword'>) => {
    const { email, password, firstName, lastName, selectedRole } = data;
    const { data: user, error } = await supabase.auth.signUp({
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

