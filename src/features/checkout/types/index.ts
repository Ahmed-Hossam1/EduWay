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

// A course of the order that goes to Stripe (what create_order returns for each course)
export interface PurchasableCourse {
    id: string;
    title: string;
    price: number;
    currency: string;
    thumbnail_url: string | null;
}

// What create_order() returns (database function): the new pending order, ready for Stripe
export interface CreatedOrder {
    orderId: string;
    courses: PurchasableCourse[]; // what he can buy (published + paid + not his own + not owned)
    total: number; // the sum of their prices (the database prices)
    currency: string; // one currency for the whole order
}
