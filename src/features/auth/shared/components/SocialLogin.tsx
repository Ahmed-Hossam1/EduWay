"use client"
import { Button } from "@/components/ui/button";
import { supabaseClient } from "@/lib/supabase/client";
import { Provider } from "@supabase/supabase-js";
import { socialProviders } from "../data";
import { toast } from "sonner";


export default function SocialLogin() {


    // Handles OAuth login using Supabase Auth
    async function handleOAuth(provider: Provider) {
        try {
            const { error } = await supabaseClient.auth.signInWithOAuth({
                provider,
                options: {
                    // This redirects the user to our callback API route after OAuth
                    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
                }
            })
            if (error) throw error
        } catch (error) {
            // Handles the Error object or just the message
            console.error("Error during OAuth login:", error);
            toast.error("Something went wrong. Please try again");
        }

    }
    return (
        <div className="grid grid-cols-2 gap-3">
            {socialProviders.map((provider) => {
                const IconComponent = provider.icon;
                return (
                    <Button
                        key={provider.name}
                        onClick={() => handleOAuth(provider.name as Provider)}

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
