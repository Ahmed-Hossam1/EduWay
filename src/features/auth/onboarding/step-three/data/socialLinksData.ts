import { SocialLinkFieldConfig } from "../types";

export const socialLinksFields: SocialLinkFieldConfig[] = [
    {
        id: "social-linkedin",
        name: "linkedinUrl",
        type: "url",
        label: "LinkedIn (Optional)",
        placeholder: "https://linkedin.com/in/username",
        helperText: "Your public LinkedIn profile URL to verify professional experience",
    },
    {
        id: "social-portfolio",
        name: "websiteUrl",
        type: "url",
        label: "Portfolio / Website (Optional)",
        placeholder: "https://yourportfolio.com",
        helperText: "Personal portfolio, blog, or project showcase",
        required: false,
    },
    {
        id: "social-github",
        name: "githubUrl",
        type: "url",
        label: "GitHub Profile (Optional)",
        placeholder: "https://github.com/username",
        helperText: "Recommended for software engineering and technical instructors",
    },
    {
        id: "social-twitter",
        name: "twitterUrl",
        type: "url",
        label: "X / Twitter (Optional)",
        placeholder: "https://x.com/username",
        helperText: "Where students can follow your tech updates and thoughts",
    },
];
