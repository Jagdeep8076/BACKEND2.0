import userModel from "../models/user.model.js";
 import jwt from "jsonwebtoken"
import { sendEmail } from "../services/mail.service.js";

 export async function register(req , res) {
     const { username , email , password } = req.body;

     const isUserAlreadyExists = await userModel.findOne({
        $or: [ { email }, { username } ]
     })

     if(isUserAlreadyExists){
        return res.status(400).json({
            message: "User with Same Email or Username Already Exists ",
            success: false,
            err: "User Already Exists"
        }) 
     }

      const user = await userModel({
        username, email, password })

        await user.save();

await sendEmail({
   to: email,
   subject: "Welcome to  Nexora-AI!",
   html: `<p>Hey ${username},</p><p>Thanking You for registering at <strong>Nexora-AI</strong>.We are excited to have you on board!</p>
   <p>Best regards, <br>The Nexora-AI Team</p>`
})
res.status(201).json({
   message:"User Registerd Successfully",
   success: true,
   user: {
      id:user._id,
      username: user.username,
      email: user.email
   }
})
        
 }
