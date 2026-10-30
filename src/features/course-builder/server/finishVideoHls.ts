import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Server only: Cloudinary finished (or failed) making the HLS copy of a video → save the result.
 *   hlsUrl = the .m3u8 link → the video is 'ready' | null → 'failed' (the teacher sees "Retry")
 * Finds the video by its name: a lesson video (eduway/lessons/...) OR a course preview (eduway/course-previews/...).
 * → "lesson" / "course" / null (unknown name, e.g. the lesson was deleted meanwhile → nothing to do)
 *
 * Called from the Cloudinary webhook. Admin client: Cloudinary calls us, there is no logged-in user,
 * and finish_video_hls can be called by the server only (a teacher can never mark his video as ready).
 */
export const finishVideoHls = async (publicId: string, hlsUrl: string | null): Promise<string | null> => {
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase.rpc("finish_video_hls", { p_public_id: publicId, p_hls_url: hlsUrl });

    if (error) throw error;
    return data as string | null;
};
