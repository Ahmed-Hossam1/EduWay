import { apiClient } from "@/lib/axios/apiClient";
import { CartIdsResponse } from "../types";

// The browser talks to /api/cart (the routes check the user and call Supabase)

export const getCartIdsService = async (): Promise<string[]> => {
    const response = await apiClient.get<CartIdsResponse>("/cart");
    return response.courseIds;
};

export const addToCartService = async (courseId: string) => {
    return await apiClient.post("/cart", { courseId });
};

export const removeFromCartService = async (courseId: string) => {
    return await apiClient.delete(`/cart/${courseId}`);
};

export const removeAllFromCartService = async () => {
    await apiClient.delete("/cart");
};
