import express from "express"
import cookieParser from "cookie-parser"

const app = express()

//Middleware
app.use(express.json())
app.use(express.urlencoded({ extented: true}))
app.use(cookieParser())

app.get("/", (req , res ) =>{
    res.json ({
        message: "Server is running Successfully"
    })
})

export default app