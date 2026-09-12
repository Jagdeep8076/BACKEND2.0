import express from "express"
import cors from "cors"
import useGraph from "./services/graph.ai.service.js"

const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
}))

app.use(express.json())

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Backend is running"
    })
})

app.post("/use-graph", async (req, res) => {
    try {
        const { message } = req.body

        if (!message || typeof message !== "string" || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            })
        }

        const result = await useGraph(message.trim())

        return res.status(200).json({
            success: true,
            result
        })

    } catch (error) {
        console.error("Graph Error:", error)

        return res.status(500).json({
            success: false,
            message: "AI Battle failed"
        })
    }
})

export default app