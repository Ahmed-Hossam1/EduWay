import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PurchasableCart } from "../types";

/**
 * Server only: what the logged-in user can send to Stripe from his cart.
 * The business rules of buying live in the database (get_purchasable_cart):
 *   published + paid + not his own course + not owned already (a refunded course can be bought again)
 * It also returns the total, the currency, and the two problems the checkout must report.
 * The server reads the cart itself → the browser can't send fake courses or fake prices.
 *
 *   { courses: [...], total: 74.98, currency: "USD", mixedCurrencies: false, hasOwnCourse: false }
 */
export async function getPurchasableCart(): Promise<PurchasableCart> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc("get_purchasable_cart");

    if (error) throw error;

    return data as PurchasableCart;
}
