const getAppUrl = (production = false) => {
    if (production) return "https://eduway-one.vercel.app";
    return "http://localhost:3000";
};

export const APP_URL = getAppUrl(false)

export const apiConfig = {
    baseURL: APP_URL,
};
