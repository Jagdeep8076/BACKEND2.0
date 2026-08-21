import "dotenv/config"
import app from "./src/app.js"
import ConnectToDataBase from "./src/config/database.js"
import http from "http"
import { initSocket } from "./src/sockets/server.socket.js"

const PORT = process.env.PORT || 8000


const httpServer = http.createServer(app)

initSocket(httpServer);

ConnectToDataBase()
.catch((err)=>{
    console.log("Mongoose Connection Failed:",err)
    process.exit(1)
})

httpServer.listen(PORT, () =>{
    console.log(`Server is running on port${PORT} Successfully`)
})