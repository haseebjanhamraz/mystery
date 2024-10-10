import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, email, password } = await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne(
            {
                username,
                isVerified: true

            })
        if (existingUserVerifiedByUsername) {
            return { status: 400, body: JSON.stringify({ success: false, message: "Username already exists" }) };
        }

        const existingUserByEmail = await UserModel.findOne({ email })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return { status: 400, body: JSON.stringify({ success: false, message: "Email already exists" }) };
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: []
            })
            await newUser.save()
        }

        // send verification email

        const emailResponse = await sendVerificationEmail(email, username, verifyCode)
        if (!emailResponse.success) {
            return { status: 500, body: JSON.stringify({ success: false, message: emailResponse.message }) };
        }
        return { status: 201, body: JSON.stringify({ success: true, message: "User registered successfully. Please check your email for verification code." }) };
    } catch (error) {
        console.error("Error registering user", error);
        return { status: 500, body: JSON.stringify({ success: false, message: "Failed to register user" }) };
    }
}