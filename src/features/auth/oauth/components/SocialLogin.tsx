"use client"
import { Button } from "@/components/ui/button";
import { socialProviders } from "../data/socialProviders";
import { useOAuthLogin } from "../hooks/useOAuthLogin";
import { useIsAuthBusy } from "../../shared/hooks/useIsAuthBusy";

// "Sign in with Google / GitHub" buttons (login + signup pages)
export default function SocialLogin() {
    // variables = the provider that was clicked ("google" / "github")
    const { mutate: signInWith, isPending, variables: clickedProvider } = useOAuthLogin();

    // any sign-in running (email or Google / GitHub) → no button can be clicked
    const isAuthBusy = useIsAuthBusy();

    return (
        <div className="grid grid-cols-2 gap-3">
            {socialProviders.map((provider) => {
                const IconComponent = provider.icon;
                // the spinner only on the button that was clicked
                const isThisLoading = isPending && clickedProvider === provider.id;

                return (
                    <Button
                        key={provider.id}
                        onClick={() => signInWith(provider.id)}
                        isLoading={isThisLoading}
                        disabled={isAuthBusy}
                        variant="outline"
                        size="default"
                        rounded="xl" className="h-10"
                        aria-label={provider.ariaLabel}
                    >
                        {!isThisLoading && <IconComponent />}
                        {provider.name}
                    </Button>
                );
            })}
        </div>
    );
}
