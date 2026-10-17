import { GithubIcon, GoogleIcon } from "../components/SocialIcons";
import { SocialProvider } from "../types";

export const socialProviders: SocialProvider[] = [
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
