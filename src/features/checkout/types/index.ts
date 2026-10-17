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
