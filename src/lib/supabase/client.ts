import { createClient } from "@supabase/supabase-js";

const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabase_publishable_key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
if (!supabase_url || !supabase_publishable_key) throw new Error("missing important keys `supabase_url || supabase_key` ")

export const supabase = createClient(supabase_url, supabase_publishable_key)