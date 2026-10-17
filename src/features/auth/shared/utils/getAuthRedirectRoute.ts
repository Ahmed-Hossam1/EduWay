/**
 * this function returns the next route based on the role and status of the user
 * @param role string
 * @param status string
 * @returns string (pure function, no database calls)
 **/
export function getAuthRedirectRoute(role: string, status: string): string {
    // Determine the destination based on role and status.
    let nextRoute = "/";

    // Profile exists but role hasn't been chosen yet
    if (!role || !status) {
        nextRoute = "/account/choose-role";
    }

    if (role === "student") {
        nextRoute = "/";
    }

    if (role === "teacher") {
        switch (status) {
            case "onboarding":
                nextRoute = "/account/onboarding";
                break;

            case "waiting":
                nextRoute = "/account/waiting";
                break;

            case "approved":
                nextRoute = "/teacher/dashboard";
                break;

            case "rejected":
                nextRoute = "/account/rejected";
                break;
        }
    }

    return nextRoute;
}
