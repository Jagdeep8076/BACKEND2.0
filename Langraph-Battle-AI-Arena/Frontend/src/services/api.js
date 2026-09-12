import axios from "axios"

const api = axios.create({
    headers: {
        "Content-Type": "application/json"
    }
})

export async function callAPI(message) {
    const response = await api.post("/use-graph", {
        message
    })

    return response.data
}