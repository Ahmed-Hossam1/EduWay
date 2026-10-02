import { supabaseClient } from "@/lib/supabase/client"
import { Profile } from "@/types/profile"


export const getProfileService = async (id: string): Promise<Profile> => {
    const { data: profile, error } = await supabaseClient.from("profiles").select("*").eq("id", id).single()
    if (!profile) throw error
    return profile
}

