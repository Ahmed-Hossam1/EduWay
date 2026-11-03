/**
 * The address of the app, picked BY ITSELF (no switching by hand between dev and production):
 *   1- NEXT_PUBLIC_APP_URL is set        → use it (e.g. a tunnel link while testing webhooks)
 *   2- on Vercel, the production deploy → its domain ("eduway-one.vercel.app", or our own domain later)
 *   3- on Vercel, a preview deploy      → the link of that preview
 *   4- else (npm run dev on our computer) → http://localhost:3000
 * Vercel fills the NEXT_PUBLIC_VERCEL_* values for every deploy (without "https://").
 */
const getAppUrl = (production = false) => {
    if (production) return "https://eduway-one.vercel.app";
    return "http://localhost:3000";
};

export const APP_URL = getAppUrl(true)

export const apiConfig = {
    baseURL: APP_URL,
};
