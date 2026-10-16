import { GithubIcon, GoogleIcon } from "../components/SocialIcons";
import { OAuthProvider } from "../services/oauth";

export const socialProviders: { id: OAuthProvider; name: string; icon: typeof GoogleIcon; ariaLabel: string }[] = [
    {
        id: "google", // sent to POST /api/auth/oauth
        name: "Google", // shown on the button
        icon: GoogleIcon,
        ariaLabel: "Sign in with Google",
    },
    {
        id: "github",
        name: "GitHub",
        icon: GithubIcon,
        ariaLabel: "Sign in with GitHub",
    },
];
