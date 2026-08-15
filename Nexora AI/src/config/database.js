import mongoose from "mongoose"

const ConnectToDataBase = async() =>{
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDB Connected Successfully")
}

export default ConnectToDataBase
