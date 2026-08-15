import express from "express"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"

const app = express()

//Middleware
app.use(express.json())
app.use(express.urlencoded({ extented: true}))
app.use(cookieParser())

app.get("/", (req , res ) =>{
    res.json ({
        message: "Server is running Successfully"})
})

app.use("/api/auth", authRouter)

export default app