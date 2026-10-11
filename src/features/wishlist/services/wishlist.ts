import apiClient from "@/lib/axios/apiClient";
import { WishlistIdsResponse } from "../types";

// The browser talks to /api/wishlist (the routes check the user and call Supabase)

export const getWishlistIdsService = async (): Promise<string[]> => {
    const response = await apiClient.get<WishlistIdsResponse>("/wishlist");
    return response.courseIds;
};

export const addToWishlistService = async (courseId: string) => {
    return await apiClient.post("/wishlist", { courseId });
};

export const removeFromWishlistService = async (courseId: string) => {
    return await apiClient.delete(`/wishlist/${courseId}`);
};
