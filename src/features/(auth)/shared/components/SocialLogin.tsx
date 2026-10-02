"use client"
import { Button } from "@/components/ui/button";
import { supabaseClient } from "@/lib/supabase/client";
import { Provider } from "@supabase/supabase-js";
import { socialProviders } from "../data";


export default function SocialLogin() {

    async function handleOAuth(provider: Provider) {

        const { error } = await supabaseClient.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/callback`,
            }
        })
        if (error) throw error
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
