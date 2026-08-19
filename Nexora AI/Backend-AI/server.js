import "dotenv/config"
import app from "./src/app.js"
import ConnectToDataBase from "./src/config/database.js"


const PORT = process.env.PORT || 8000


ConnectToDataBase()
.catch((err)=>{
    console.log("Mongoose Connection Failed:",err)
    process.exit(1)
})

app.listen(PORT, () =>{
    console.log(`Server is running on port${PORT} Successfully`)
})