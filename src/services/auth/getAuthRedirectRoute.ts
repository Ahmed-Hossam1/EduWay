/**
 * this function returns the next route based on the role and status of the user
 * @param role string
 * @param status string
 * @returns string
**/
export function getAuthRedirectRouteService(role: string, status: string): string {

    // Determine the destination based on role and status.
    let nextRoute = "/";

    // Profile exists but role hasn't been chosen yet
    if (!role || !status) {
        nextRoute = "/choose-role";
    }

    if (role === "student") {
        nextRoute = "/";
    }

    if (role === "teacher") {
        switch (status) {
            case "onboarding":
                nextRoute = "/onboarding";
                break;

            case "waiting":
                nextRoute = "/waiting";
                break;

            case "approved":
                nextRoute = "/dashboard";
                break;

            case "rejected":
                nextRoute = "/rejected";
                break;
        }
    }

    return nextRoute
}