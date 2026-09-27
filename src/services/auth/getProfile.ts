import { supabase } from "@/lib/supabase/client"
import { Profile } from "@/types"


export const getProfileService = async (id: string): Promise<Profile> => {
    const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", id).single()
    if (!profile) throw error
    return profile
}

