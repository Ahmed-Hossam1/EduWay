import { Button } from "@/components/ui/button";
import { FacebookIcon, GoogleIcon } from "./SocialIcons";

function SocialLogin() {
    return (
        <div className="grid grid-cols-2 gap-2">
            <Button
                type="button"
                variant="outline"
                size="default"
                className="h-10 rounded-xl gap-2 text-xs font-semibold"
            >
                <GoogleIcon />
                <span>Google</span>
            </Button>

            <Button
                type="button"
                variant="outline"
                size="default"
                className="h-10 rounded-xl gap-2 text-xs font-semibold"
            >
                <FacebookIcon />
                <span>Facebook</span>
            </Button>
        </div>
    );
}
export default SocialLogin