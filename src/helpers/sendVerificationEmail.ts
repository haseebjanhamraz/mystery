import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiReponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string,
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'has@gmail.com',
            to: email,
            subject: 'SAPLAY - Verification Code',
            react: VerificationEmail({ username, otp: verifyCode })
        });
        return { success: true, message: "Verification email sent successfully" };
    } catch (emailError) {
        console.error("Error sending email", emailError);
        return { success: false, message: "Failed to send verification email" };
    }
}