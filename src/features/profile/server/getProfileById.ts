import "server-only"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { Profile } from "../types"

// Server only: used by API routes / server components, never imported in the browser
export const getProfileByIdService = async (id: string): Promise<Profile> => {
    const supabaseClient = await createSupabaseServerClient()
    const { data: profile, error } = await supabaseClient.from("profiles").select("*").eq("id", id).single()
    if (!profile) throw error
    return profile
}
