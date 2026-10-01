import { SocialLinkFieldConfig } from "../types";

export const socialLinksFields: SocialLinkFieldConfig[] = [
  {
    id: "social-linkedin",
    name: "linkedin",
    label: "LinkedIn",
    placeholder: "https://linkedin.com/in/username",
    helperText: "Your public LinkedIn profile URL to verify professional experience",
    required: true,
  },
  {
    id: "social-portfolio",
    name: "portfolio",
    label: "Portfolio / Website",
    placeholder: "https://yourportfolio.com",
    helperText: "Personal portfolio, blog, or project showcase",
    required: false,
  },
  {
    id: "social-github",
    name: "github",
    label: "GitHub Profile (Optional)",
    placeholder: "https://github.com/username",
    helperText: "Recommended for software engineering and technical instructors",
    required: false,
  },
  {
    id: "social-twitter",
    name: "twitter",
    label: "X / Twitter (Optional)",
    placeholder: "https://x.com/username",
    helperText: "Where students can follow your tech updates and thoughts",
    required: false,
  },
];
