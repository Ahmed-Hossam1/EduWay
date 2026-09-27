import axios from "axios";

export const axiosInstance = axios.create({
    // No baseURL needed — relative paths work for same-origin Next.js API routes
    headers: {
        'Content-Type': 'application/json'
    }
})

