import Link from "next/link";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/features/courses/utils/format";
import { CourseThumbnail } from "@/features/courses/components/CourseThumbnail";
import { Order, OrderStatus } from "./types";

// Icon + texts for every order status
const STATUS_CONTENT: Record<
    OrderStatus,
    { icon: typeof CheckCircle2; iconClass: string; title: string; description: string }
> = {
    paid: {
        icon: CheckCircle2,
        iconClass: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
        title: "Payment successful",
        description: "You're enrolled! Your courses are waiting for you in My courses.",
    },
    pending: {
        icon: Clock,
        iconClass: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
        title: "Confirming your payment",
        description: "This usually takes a few seconds. Refresh the page in a moment.",
    },
    failed: {
        icon: XCircle,
        iconClass: "bg-destructive/10 text-destructive",
        title: "Payment failed",
        description: "We couldn't complete your payment. Your cart is still there, you can try again.",
    },
};

type CheckoutSuccessPageProps = {
    order: Order;
};

export function CheckoutSuccessPage({ order }: CheckoutSuccessPageProps) {
    const content = STATUS_CONTENT[order.status];

    return (
        <section className="container mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
            <Card className="rounded-2xl shadow-lg">
                {/* Status */}
                <CardHeader className="items-center text-center">
                    <div
                        className={`mx-auto flex size-16 items-center justify-center rounded-full ${content.iconClass}`}
                    >
                        <content.icon className="size-8" />
                    </div>
                    <h1 className="mt-4 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                        {content.title}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">{content.description}</p>
                </CardHeader>

                {/* The courses of the order */}
                <CardContent>
                    <Separator />
                    <ul className="divide-y divide-border">
                        {order.order_items.map((item) => (
                            <li key={item.course.id} className="flex items-center gap-4 py-4">
                                <div className="relative aspect-16/10 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                                    <CourseThumbnail
                                        src={item.course.thumbnail_url}
                                        alt={item.course.title}
                                        sizes="96px"
                                        iconClassName="size-5"
                                    />
                                </div>
                                <Link
                                    href={`/courses/${item.course.slug}`}
                                    className="line-clamp-2 flex-1 text-sm font-semibold text-foreground hover:text-primary"
                                >
                                    {item.course.title}
                                </Link>
                                <span className="text-sm font-bold text-foreground">
                                    {formatPrice(item.price, order.currency)}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <Separator />

                    <div className="flex items-center justify-between pt-4">
                        <span className="font-semibold text-foreground">Total</span>
                        <span className="text-xl font-black text-foreground">
                            {formatPrice(order.total, order.currency)}
                        </span>
                    </div>
                </CardContent>

                {/* Next step depends on the status */}
                <CardFooter className="flex-col gap-2 sm:flex-row">
                    {order.status === "paid" && (
                        <>
                            <Button rounded="xl" className="h-11 w-full sm:flex-1" asChild>
                                <Link href="/my-learning">Go to my courses</Link>
                            </Button>
                            <Button variant="outline" rounded="xl" className="h-11 w-full sm:flex-1" asChild>
                                <Link href="/courses">Browse more courses</Link>
                            </Button>
                        </>
                    )}

                    {order.status === "pending" && (
                        // a normal <a> (not Link) => a real reload => the server checks the payment again
                        <Button rounded="xl" className="h-11 w-full" asChild>
                            <a href="">Refresh</a>
                        </Button>
                    )}

                    {order.status === "failed" && (
                        <Button rounded="xl" className="h-11 w-full" asChild>
                            <Link href="/cart">Back to cart</Link>
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </section>
    );
}
