import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from 'zod'
import { usernameValidation } from "@/schemas/signUpSchema";

const UserNameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {

    await dbConnect()
    try {
        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }
        // Validate with zod
        const result = UserNameQuerySchema.safeParse(queryParam)
        console.log(result)
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameErrors.length > 0 ? usernameErrors : "Invalid query parameters"
            }, { status: 500 })
        }

        const { username } = result.data
        const existingUsername = await UserModel.findOne({ username, isVerified: true })
        if (existingUsername) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, { status: 400 })
        }
        return Response.json({
            success: true,
            message: "Username is available"
        }, { status: 200 })

    } catch (error) {
        console.error("Error Checking Username", error)
        return Response.json({
            success: false,
            message: "Error checking for existing username"
        },
            {
                status: 500
            }
        )
    }
}
