import { AuthHero } from "../../shared/components/AuthHero";
import { loginFeaturesData } from "../data/loginFeaturesData";

// The left half of /auth/login (the layout lives in AuthHero, shared with the signup page)
export function LoginHero() {
    return (
        <AuthHero
            imageSrc="/images/login.png"
            imageAlt="Student studying with EduWay"
            title={
                <>
                    Your Way to
                    <br />
                    Learn, Grow,
                    <br />
                    and{" "}
                    <span className="bg-linear-to-r from-purple-300 via-purple-400 to-primary bg-clip-text text-transparent">
                        Succeed.
                    </span>
                </>
            }
            description="Access high-quality courses, learn from experts, and build the skills you need for a brighter future."
            features={loginFeaturesData}
        />
    );
}
