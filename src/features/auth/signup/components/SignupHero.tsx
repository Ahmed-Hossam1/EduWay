import { AuthHero } from "../../shared/components/AuthHero";
import { heroFeatures } from "../data/heroFeatures";

// The left half of /auth/signup (the layout lives in AuthHero, shared with the login page)
export function SignupHero() {
    return (
        <AuthHero
            imageSrc="/images/signup.png"
            imageAlt="Student learning with EduWay"
            eyebrow="More than learning"
            title={
                <>
                    Your Journey
                    <br />
                    <span className="bg-linear-to-r from-purple-300 via-purple-400 to-primary bg-clip-text text-transparent">
                        Starts
                    </span>{" "}
                    Here.
                </>
            }
            description="Join thousands of learners and take the next step toward a brighter future with EduWay."
            features={heroFeatures}
        />
    );
}
