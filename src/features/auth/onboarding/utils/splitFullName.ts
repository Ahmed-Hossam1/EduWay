/**
 * Splits a full name at the FIRST space.
 * "Ahmed Hossam"       => { firstName: "Ahmed", lastName: "Hossam" }
 * "Ahmed Hossam Emad"  => { firstName: "Ahmed", lastName: "Hossam Emad" }
 * "Ahmed"              => { firstName: "Ahmed", lastName: "" }
 *
 * Why: Google / GitHub give us ONE full name, and today it is saved
 * in profiles.first_name with an empty last_name.
 */

export const splitFullName = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);

    return {
        firstName: parts[0] ?? "",
        lastName: parts.slice(1).join(" "),
    };
};
