"use server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { Profile } from "@/types/profile"


export const getProfileService = async (id: string): Promise<Profile> => {
    const supabaseClient = await createSupabaseServerClient()
    const { data: profile, error } = await supabaseClient.from("profiles").select("*").eq("id", id).single()
    if (!profile) throw error
    return profile
}

