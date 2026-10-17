import { ComponentType } from "react";

// The providers we support (sent to POST /api/auth/oauth)
export type OAuthProvider = "google" | "github";

// One "Sign in with ..." button
export interface SocialProvider {
    id: OAuthProvider; // sent to the API
    name: string; // shown on the button ("Google")
    icon: ComponentType; // GoogleIcon / GithubIcon
    ariaLabel: string;
}
