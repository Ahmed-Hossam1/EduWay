"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Building2, GraduationCap, Globe } from "lucide-react";
import { IconBrandLinkedin, IconBrandGithub, IconBrandX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { teacherProfileSchema, TeacherProfileValues } from "./schemas/teacherProfileSchema";
import { useUpdateTeacherProfile } from "./hooks/useUpdateTeacherProfile";
import { TeacherFullProfile } from "./server/getTeacherProfile";
import { ProfileAvatarField } from "./components/ProfileAvatarField";
import { ProfileSkillsField } from "./components/ProfileSkillsField";
import { ProfileLanguagesField } from "./components/ProfileLanguagesField";
import { ProfileExperienceField } from "./components/ProfileExperienceField";
import { ProfileCertificationsSection } from "./components/ProfileCertificationsSection";

type TeacherProfileFormProps = { profile: TeacherFullProfile };

export function TeacherProfileForm({ profile }: TeacherProfileFormProps) {
    const { mutate: saveProfile, isPending } = useUpdateTeacherProfile();

    const form = useForm<TeacherProfileValues>({
        resolver: zodResolver(teacherProfileSchema),
        defaultValues: {
            firstName: profile.first_name ?? "",
            lastName: profile.last_name ?? "",
            headline: profile.headline ?? "",
            bio: profile.bio ?? "",
            avatarUrl: profile.avatar_url ?? "",
            experienceLevel: profile.experience_level ?? undefined,
            skills: profile.skills ?? [],
            teachingLanguages: profile.teaching_languages ?? [],
            university: profile.university ?? "",
            company: profile.company ?? "",
            certifications: (profile.certifications ?? []).map((c) => ({
                name: c.name,
                issuer: c.issuer ?? "",
                year: c.year ? String(c.year) : "",
            })),
            linkedinUrl: profile.linkedin_url ?? "",
            websiteUrl: profile.website_url ?? "",
            githubUrl: profile.github_url ?? "",
            twitterUrl: profile.twitter_url ?? "",
        },
    });

    const { register, handleSubmit, formState } = form;

    const onSubmit = (values: TeacherProfileValues) => {
        saveProfile(values);
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Card 1 – Profile Photo */}
                <Card className="rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-base font-bold">Profile photo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ProfileAvatarField />
                    </CardContent>
                </Card>

                {/* Card 2 – Personal information */}
                <Card className="rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-base font-bold">Personal information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Input
                                id="profile-first-name"
                                {...register("firstName")}
                                label="First name"
                                placeholder="e.g. John"
                                errorText={formState.errors.firstName?.message}
                                fullWidth
                            />
                            <Input
                                id="profile-last-name"
                                {...register("lastName")}
                                label="Last name"
                                placeholder="e.g. Doe"
                                errorText={formState.errors.lastName?.message}
                                fullWidth
                            />
                        </div>

                        <Input
                            id="profile-headline"
                            {...register("headline")}
                            label="Professional title / Headline"
                            placeholder="e.g. Senior React Developer & Instructor"
                            errorText={formState.errors.headline?.message}
                            fullWidth
                        />

                        <Textarea
                            id="profile-bio"
                            {...register("bio")}
                            label="Bio"
                            placeholder="Tell students about yourself, your background, and what you teach…"
                            errorText={formState.errors.bio?.message}
                            rows={5}
                        />
                    </CardContent>
                </Card>

                {/* Card 3 – Teaching information */}
                <Card className="rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-base font-bold">Teaching information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <ProfileExperienceField />

                        <ProfileSkillsField />

                        <ProfileLanguagesField />

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Input
                                id="profile-university"
                                {...register("university")}
                                label="University (Optional)"
                                placeholder="e.g. Cairo University, Harvard"
                                errorText={formState.errors.university?.message}
                                fullWidth
                                leftIcon={<GraduationCap className="size-4 text-muted-foreground" />}
                            />
                            <Input
                                id="profile-company"
                                {...register("company")}
                                label="Company (Optional)"
                                placeholder="e.g. Google, Freelance"
                                errorText={formState.errors.company?.message}
                                fullWidth
                                leftIcon={<Building2 className="size-4 text-muted-foreground" />}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Card 4 – Certifications */}
                <Card className="rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-base font-bold">Certifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ProfileCertificationsSection />
                    </CardContent>
                </Card>

                {/* Card 5 – Social & professional links */}
                <Card className="rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-base font-bold">Social &amp; professional links</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Input
                                id="profile-linkedin"
                                type="url"
                                {...register("linkedinUrl")}
                                label="LinkedIn (Optional)"
                                placeholder="https://linkedin.com/in/username"
                                errorText={formState.errors.linkedinUrl?.message}
                                fullWidth
                                leftIcon={<IconBrandLinkedin className="size-4 text-muted-foreground" />}
                            />
                            <Input
                                id="profile-website"
                                type="url"
                                {...register("websiteUrl")}
                                label="Portfolio / Website (Optional)"
                                placeholder="https://yourportfolio.com"
                                errorText={formState.errors.websiteUrl?.message}
                                fullWidth
                                leftIcon={<Globe className="size-4 text-muted-foreground" />}
                            />
                            <Input
                                id="profile-github"
                                type="url"
                                {...register("githubUrl")}
                                label="GitHub Profile (Optional)"
                                placeholder="https://github.com/username"
                                errorText={formState.errors.githubUrl?.message}
                                fullWidth
                                leftIcon={<IconBrandGithub className="size-4 text-muted-foreground" />}
                            />
                            <Input
                                id="profile-twitter"
                                type="url"
                                {...register("twitterUrl")}
                                label="X / Twitter (Optional)"
                                placeholder="https://x.com/username"
                                errorText={formState.errors.twitterUrl?.message}
                                fullWidth
                                leftIcon={<IconBrandX className="size-4 text-muted-foreground" />}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Sticky Save Bar */}
                <div className="sticky bottom-0 z-10 -mx-1 flex items-center justify-end gap-3 border-t border-border bg-background/95 px-1 py-3 backdrop-blur">
                    {formState.isDirty && (
                        <span className="text-xs text-muted-foreground">You have unsaved changes</span>
                    )}
                    <Button
                        type="submit"
                        size="lg"
                        rounded="xl"
                        isLoading={isPending}
                        disabled={!formState.isDirty}
                    >
                        {isPending ? (
                            "Saving..."
                        ) : (
                            <>
                                <Save />
                                Save profile
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}
