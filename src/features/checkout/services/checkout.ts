import { apiClient } from "@/lib/axios/apiClient";

type CheckoutResponse = {
    url: string; // the Stripe payment page
};

// POST /api/checkout → the server buys the whole cart and returns the Stripe url
export const startCheckoutService = async (): Promise<string> => {
    const response = await apiClient.post<CheckoutResponse>("/checkout");
    return response.url;
};
