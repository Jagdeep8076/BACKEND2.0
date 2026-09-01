import express from "express"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"
import chatRouter from "./routes/chat.routes.js"
import morgan from 'morgan'
import cors from "cors"

const app = express()

//Middleware
app.use(express.json())
app.use(express.urlencoded({ extented: true}))
app.use(cookieParser())
app.use(morgan("dev"))
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}))

app.get("/", (req , res ) =>{
    res.json ({
        message: "Server is running Successfully"})
})

app.use("/api/auth", authRouter)
app.use("/api/chats", chatRouter)

export default app