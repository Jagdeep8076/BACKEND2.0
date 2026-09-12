import axios from "axios";

const API_URL = "http://localhost:3000";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

export async function callAPI(message) {
    const response = await api.post("/use-graph", {
        message
    });

    return response.data;
}