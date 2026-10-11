import { Award, Languages } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { InstructorProfile } from "../types";

type InstructorAboutProps = {
  profile: InstructorProfile | null;
};

// Bio, skills, languages and certifications — every block hides itself when empty
export function InstructorAbout({ profile }: InstructorAboutProps) {
  if (!profile) return null;

  return (
    <div className="space-y-10">
      {profile.bio && (
        <section aria-labelledby="about-title">
          <h2 id="about-title" className="text-2xl font-bold tracking-tight text-foreground">About me</h2>
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground sm:text-base">
            {profile.bio}
          </p>
        </section>
      )}

      {profile.skills.length > 0 && (
        <section aria-labelledby="skills-title">
          <h2 id="skills-title" className="text-2xl font-bold tracking-tight text-foreground">Skills</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <Badge key={skill} variant="outline" className="h-auto px-3 py-1 text-sm">{skill}</Badge>
            ))}
          </div>
        </section>
      )}

      {profile.teaching_languages.length > 0 && (
        <section aria-labelledby="languages-title">
          <h2 id="languages-title" className="text-2xl font-bold tracking-tight text-foreground">Teaches in</h2>
          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground sm:text-base">
            <Languages className="size-4 text-primary" />
            {profile.teaching_languages.join(" · ")}
          </p>
        </section>
      )}

      {profile.certifications.length > 0 && (
        <section aria-labelledby="certifications-title">
          <h2 id="certifications-title" className="text-2xl font-bold tracking-tight text-foreground">Certifications</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {profile.certifications.map((certification) => (
              <Card key={certification.id} className="flex-row items-start gap-3 rounded-xl p-4">
                <Award className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{certification.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {[certification.issuer, certification.year].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
