import { Button } from "@/components/ui/button";
import { AppleIcon, GithubIcon, GoogleIcon } from "./SocialIcons";

function SocialLogin() {
    return (
        <div className="grid grid-cols-3 gap-2.5">
            <Button
                type="button"
                variant="outline"
                size="default"
                className="h-10 gap-2 rounded-xl text-xs font-medium"
                aria-label="Continue with Google"
            >
                <GoogleIcon />
                <span>Google</span>
            </Button>

            <Button
                type="button"
                variant="outline"
                size="default"
                className="h-10 gap-2 rounded-xl text-xs font-medium"
                aria-label="Continue with GitHub"
            >
                <GithubIcon />
                <span>GitHub</span>
            </Button>

            <Button
                type="button"
                variant="outline"
                size="default"
                className="h-10 gap-2 rounded-xl text-xs font-medium"
                aria-label="Continue with Apple"
            >
                <AppleIcon />
                <span>Apple</span>
            </Button>
        </div>
    );
}

export default SocialLogin;