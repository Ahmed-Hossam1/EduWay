import axios from "axios";

export const axiosInstance = axios.create({
    // baseURL: 'localhost:3000',
    headers: {
        'Content-Type': 'application/json'
    }
})

