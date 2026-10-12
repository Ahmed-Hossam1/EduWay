"use client"
import Link from "next/link"
import { ArrowRight, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { formatPrice } from "@/features/courses/utils/format"
import { useCheckout } from "@/features/checkout/hooks/useCheckout"

type CartSummaryProps = {
    itemsCount: number
    total: number
    currency: string
}

// The order summary on the right (bottom on mobile). "Checkout" → Stripe payment page.
export function CartSummary({ itemsCount, total, currency }: CartSummaryProps) {
    const { mutate: startCheckout, isPending, isSuccess } = useCheckout()
    // isSuccess: the request is done but the browser is still loading Stripe → keep the spinner
    const isRedirecting = isPending || isSuccess

    return (
        <Card className="rounded-2xl shadow-lg">
            <CardHeader>
                <CardTitle className="text-lg font-bold">Order summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                    <span>Subtotal ({itemsCount} {itemsCount === 1 ? "course" : "courses"})</span>
                    <span>{formatPrice(total, currency)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-2xl font-black text-foreground">{formatPrice(total, currency)}</span>
                </div>
            </CardContent>

            <CardFooter className="flex-col gap-3 border-t-0 bg-transparent">
                <Button
                    size="lg"
                    rounded="xl"
                    className="h-11 w-full font-semibold"
                    disabled={isRedirecting}
                    onClick={() => startCheckout()}
                >
                    {isRedirecting ? (
                        <>
                            <Spinner className="size-4" />
                            Redirecting to payment...
                        </>
                    ) : (
                        <>
                            Checkout
                            <ArrowRight />
                        </>
                    )}
                </Button>
                <Button variant="ghost" rounded="xl" className="w-full" nativeButton={false} render={<Link href="/courses" />}>
                    Continue shopping
                </Button>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Lock className="size-3.5" />
                    Secure checkout
                </p>
            </CardFooter>
        </Card>
    )
}
