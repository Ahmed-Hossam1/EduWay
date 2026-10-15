import "server-only";
import { User } from "@supabase/supabase-js";
import { DefaultValues } from "react-hook-form";
import { Profile } from "@/features/profile/types";
import { OnboardingFormValues } from "../schemas/onboardingSchema";
import { splitFullName } from "../utils/splitFullName";

/**
 * Server only: the first values of the onboarding form.
 * The name + photo the user ALREADY gave us (signup form or Google / GitHub)
 * are filled in, everything else starts empty.
 */
export const getOnboardingDefaults = (user: User, profile: Profile): DefaultValues<OnboardingFormValues> => {
    let firstName = profile.first_name ?? "";
    let lastName = profile.last_name ?? "";

    // OAuth user: the full name is in first_name and last_name is empty
    if (lastName === "") {
        // Google sends the 2 parts separately => use them
        const givenName = user.user_metadata?.given_name;
        const familyName = user.user_metadata?.family_name;

        if (givenName && familyName) {
            firstName = givenName;
            lastName = familyName;
        } else {
            // GitHub (or no parts) => split "Ahmed Hossam" at the first space
            const parts = splitFullName(firstName);
            firstName = parts.firstName;
            lastName = parts.lastName;
        }
    }

    return {
        // step 1
        firstName,
        lastName,
        /*
            * Why are the rest of the form fields empty?
            *
            * - First name and last name are prefilled using the data collected during signup
            *   or provided by the OAuth provider (Google/GitHub).
            *
            * - The remaining fields are not provided during signup, so they start with
            *   empty default values.
            *
            * - We don't want to invent or prefill information the user hasn't provided.
            *   Empty fields make it clear that the user still needs to complete them.
            *
            * - React Hook Form uses these values as the initial form state; this does not
            *   save anything to the database by itself.
            *
            * - Required fields must pass validation before the user can complete onboarding.
            *   Optional fields can remain empty.
            *
            * - This ensures we collect the required information before submitting the
            *   onboarding data to the server.
        */
        headline: "",
        bio: "",

        // step 2 (experienceLevel stays empty => he must choose)
        categoryId: "",
        skills: [],
        university: "",
        company: "",
        certifications: [],
        teachingLanguages: [],

        // step 3
        avatarUrl: profile.avatar_url ?? "",
        linkedinUrl: "",
        websiteUrl: "",
        githubUrl: "",
        twitterUrl: "",
        confirmed: false,
    };
};
