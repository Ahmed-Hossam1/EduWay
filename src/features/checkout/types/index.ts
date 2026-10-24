// Same values as the Postgres enum order_status
export type OrderStatus = "pending" | "paid" | "failed";

// One course inside the order (price = what he paid, not today's price)
export interface OrderItem {
    price: number;
    course: {
        id: string;
        title: string;
        slug: string;
        thumbnail_url: string | null;
    };
}

// What the success page receives
export interface Order {
    id: string;
    status: OrderStatus;
    total: number;
    currency: string;
    created_at: string;
    order_items: OrderItem[];
}

// A course of the cart that can go to Stripe (what get_purchasable_cart returns for each course)
export interface PurchasableCourse {
    id: string;
    title: string;
    price: number;
    currency: string;
    thumbnail_url: string | null;
}

// What get_purchasable_cart() returns (database function): ready for the checkout route
export interface PurchasableCart {
    courses: PurchasableCourse[]; // what he can buy now (published + paid + not his own + not owned)
    total: number; // the sum of their prices
    currency: string | null; // null when "courses" is empty
    mixedCurrencies: boolean; // true → they can't be paid in one Stripe payment
    hasOwnCourse: boolean; // his own course is in the cart → a clear message
}
