import { Globe } from "lucide-react";
import { IconBrandGithub, IconBrandLinkedin, IconBrandX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { InstructorProfile } from "../types";

type InstructorSocialLinksProps = {
  profile: InstructorProfile;
};

// Only the links the teacher filled are shown
export function InstructorSocialLinks({ profile }: InstructorSocialLinksProps) {
  const links = [
    { url: profile.website_url, label: "Website", icon: Globe },
    { url: profile.linkedin_url, label: "LinkedIn", icon: IconBrandLinkedin },
    { url: profile.github_url, label: "GitHub", icon: IconBrandGithub },
    { url: profile.twitter_url, label: "X", icon: IconBrandX },
  ].filter((link) => link.url);

  if (links.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => (
        <Button
          key={link.label}
          variant="outline"
          size="sm"
          rounded="full" asChild>
          <a href={link.url!} target="_blank" rel="noopener noreferrer">
            <link.icon className="size-4" />
            {link.label}
          </a>
        </Button>
      ))}
    </div>
  );
}
