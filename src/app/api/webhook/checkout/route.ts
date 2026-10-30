import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe/stripe";
import { fulfillOrder } from "@/features/checkout/server/fulfillOrder";
import { failOrder } from "@/features/checkout/server/failOrder";

// POST /api/webhook/checkout  ← Stripe calls this, NOT the browser (every webhook lives in /api/webhook/<service>)
export async function POST(request: NextRequest) {
    // 1- The raw text body (the signature check needs it exactly as Stripe sent it)
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");
    if (!signature) return NextResponse.json({ message: "Missing signature" }, { status: 400 });

    // 2- Is it really Stripe? (anyone can send a POST to this url)
    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (error) {
        console.error("Webhook signature error:", error);
        return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
    }

    // 3- Do the work for the events we care about
    try {
        // paid by card => "completed" | paid later (bank methods) => "async_payment_succeeded"
        if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
            await fulfillOrder(event.data.object.id);
        }

        // the user never paid (24h) or the late payment failed
        if (event.type === "checkout.session.expired" || event.type === "checkout.session.async_payment_failed") {
            await failOrder(event.data.object.id);
        }
    } catch (error) {
        // 500 => Stripe sends the same event again later
        console.error(`Webhook ${event.type} error:`, error);
        return NextResponse.json({ message: "Webhook handler failed" }, { status: 500 });
    }

    // 4- 200 => Stripe stops sending this event
    return NextResponse.json({ received: true }, { status: 200 });
}
