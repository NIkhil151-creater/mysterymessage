import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
	username: usernameValidation,
});

export async function GET(request: Request) {
	try {
		await dbConnect();
		const { searchParams } = new URL(request.url);
		const queryParam = {
			username: searchParams.get("username")
		}
		//! validate with zod
		const result = UsernameQuerySchema.safeParse(queryParam);
		// console.log(result); //todo For checking what the result contains inside it.
		if (!result.success) {
			const usernameErrors = result.error.format().username?._errors || [];
			return Response.json(
				{
					success: false,
					message: usernameErrors.length > 0 ? usernameErrors.join(", ") : "Invalid query parameters",
				}, { status: 400 }
			)
		}

		const { username } = result.data;
		const existingVerfiedUser = await UserModel.findOne({ username, isVerified: true });

		if (existingVerfiedUser) {
			return Response.json(
				{
					success: false,
					message: "Username is already taken.",
				}, { status: 400 }
			)
		}

		return Response.json(
			{
				success: true,
				message: "Username is unique and available.",
			}, { status: 200 }
		)

	} catch (error) {
		console.error("Error checking username", error);
		return Response.json(
			{
				success: false,
				message: "Could not check username availability. Check the database connection and try again."
			}, { status: 503 }
		)
	}
}