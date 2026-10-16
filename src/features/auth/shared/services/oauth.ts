import apiClient from "@/lib/axios/apiClient";

export type OAuthProvider = "google" | "github";

type OAuthResponse = {
    url: string; // the Google / GitHub sign-in page
};

// POST /api/auth/oauth → the url of the Google / GitHub sign-in page
export const startOAuthService = async (provider: OAuthProvider): Promise<string> => {
    const response = await apiClient.post<OAuthResponse>("/auth/oauth", { provider });
    return response.url;
};
