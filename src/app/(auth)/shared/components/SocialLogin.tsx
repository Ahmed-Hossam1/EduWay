import { Button } from "@/components/ui/button";
import { socialProviders } from "../data";


export default function SocialLogin() {
    return (
        <div className="grid grid-cols-3 gap-3">
            {socialProviders.map((provider) => {
                const IconComponent = provider.icon;
                return (
                    <Button
                        key={provider.name}
                        type="button"
                        variant="outline"
                        size="default"
                        className="h-10 rounded-xl"
                        aria-label={provider.ariaLabel}
                    >
                        <IconComponent />
                        {provider.name}
                    </Button>
                );
            })}
        </div>
    );
}
