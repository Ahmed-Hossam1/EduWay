import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_APP_URL}/api`,
    headers: {
        'Content-Type': 'application/json'
    }
})

