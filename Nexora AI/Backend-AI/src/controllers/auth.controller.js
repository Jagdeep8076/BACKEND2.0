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

const emailVerificationToken = jwt.sign({
   email:user.email,
},process.env.JWT_SECRET)

await sendEmail({
   to: email,
   subject: "Welcome to  Nexora-AI!",
   html: `<p>Hey ${username},</p><p>Thanking You for registering at <strong>Nexora-AI</strong>.We are excited to have you on board!</p>
   <p>Please verify your email address by clicking the link below:</p>
   <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
   <p>If you did not create an account, please ignore this email.</p>
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



export async function login(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "User not found"
        })
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "Incorrect password"
        })
    }

    if (!user.verified) {
        return res.status(400).json({
            message: "Please verify your email before logging in",
            success: false,
            err: "Email not verified"
        })
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username,
    }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.cookie("token", token)

    res.status(200).json({
        message: "Login successful",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}





export async function getMe( req , res){
   const userId = req.user.id;
    
   
   const user = await userModel.findById(userId).select("-password");
   
   if(!user){
      return res.status(404).json({
         message: "User Not Found",
         success: false,
         err: "User not found"
      })
   }
   res.status(200).json({
      message: "User Details Fetched Successfully",
      success: true,
      user
   })
}




export async function verifyEmail(req, res) {
    const { token } = req.query;

    try {


        const decoded = jwt.verify(token, process.env.JWT_SECRET);


        const user = await userModel.findOne({ email: decoded.email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid token",
                success: false,
                err: "User not found"
            })
        }

         if (user.verified) {
            return res.status(200).send(`
                <h1>Email Already Verified</h1>
                <p>Your email has already been verified.</p>
                <p>You can now log in to your Nexora-AI account.</p>
                <a href="http://localhost:3000/login">Go to Login</a>
            `);
        }

        user.verified = true;

        await user.save();

        const html =
            `
        <h1>Email Verified Successfully!</h1>
        <p>Your email has been verified. You can now log in to your account.</p>
        <a href="http://localhost:3000/login">Go to Login</a>
    `

        return res.send(html);
    } catch (err) {
        return res.status(400).json({
            message: "Invalid or expired token",
            success: false,
            err: err.message
        })
    }
}


export async function resendVerificationEmail(req, res) {
    const { email } = req.body;

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
                err: "User not found"
            });
        }

        if (user.verified) {
            return res.status(200).json({
                message: "Email is already verified",
                success: true,
                alreadyVerified: true
            });
        }

        const emailVerificationToken = jwt.sign(
            {
                email: user.email
            },
            process.env.JWT_SECRET
        );

        await sendEmail({
            to: user.email,
            subject: "Verify your Nexora-AI email",
            html: `
                <p>Hey ${user.username},</p>

                <p>You requested a new verification email.</p>

                <p>Please verify your email address by clicking the link below:</p>

                <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">
                    Verify Email
                </a>

                <p>If you did not request this email, please ignore it.</p>

                <p>Best regards,<br>
                The Nexora-AI Team</p>
            `
        });

        return res.status(200).json({
            message: "Verification email resent successfully",
            success: true,
            alreadyVerified: false
        });

    } catch (err) {
        return res.status(500).json({
            message: "Failed to resend verification email",
            success: false,
            err: err.message
        });
    }
}