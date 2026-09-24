import { signupSchemaType } from "@/features/signup/schema/schema";
import { AuthRole } from "@/features/signup/types";
import { supabase } from "@/lib/supabase/client";


export const signupService = async (data: signupSchemaType, selectedRole: AuthRole) => {
    const { email, password, firstName, lastName } = data;
    const { error } = await supabase.auth.signUp({
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
}

