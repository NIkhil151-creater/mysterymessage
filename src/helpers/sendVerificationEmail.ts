import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verfiyCode: string,
): Promise<ApiResponse> {
    if (!resend) {
        return {
            success: false,
            message: "Email delivery is not configured. Add RESEND_API_KEY to your environment variables.",
        };
    }

    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Mystery message | Verification Code",
            react: VerificationEmail({ username, otp: verfiyCode }),
        });

        return {
            success: true,
            message: "Verification email sent successfully.",
        };
    } catch (emailError) {
        console.error(`Error sending verification email: ${emailError}`);
        return {
            success: false,
            message: "Failed to send verification email.",
        };
    }
}