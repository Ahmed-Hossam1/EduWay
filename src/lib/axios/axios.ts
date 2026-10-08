import { apiConfig } from "@/constants/api";
import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: `${apiConfig.baseURL}/api`,
    headers: {
        'Content-Type': 'application/json'
    }
})

