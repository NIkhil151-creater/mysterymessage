import NextAuth from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

const { auth } = NextAuth(authOptions);

export async function GET() {
	try {
		const session = await auth();
		const userId = session?.user?._id;

		if (!userId) {
			return Response.json(
				{ success: false, message: "Not authenticated." },
				{ status: 401 },
			);
		}

		await dbConnect();
		const user = await UserModel.findById(userId).select("isAcceptingMessages");

		if (!user) {
			return Response.json(
				{ success: false, message: "User not found." },
				{ status: 404 },
			);
		}

		return Response.json({
			success: true,
			isAcceptingMessages: user.isAcceptingMessages,
		});
	} catch (error) {
		console.error("Error fetching message acceptance status:", error);
		return Response.json(
			{ success: false, message: "Error fetching message acceptance status." },
			{ status: 500 },
		);
	}
}

export async function POST(request: Request) {
	try {
		const session = await auth();
		const userId = session?.user?._id;

		if (!userId) {
			return Response.json(
				{ success: false, message: "Not authenticated." },
				{ status: 401 },
			);
		}

		let body: unknown;
		try {
			body = await request.json();
		} catch {
			return Response.json(
				{ success: false, message: "Request body must be valid JSON." },
				{ status: 400 },
			);
		}

		if (
			typeof body !== "object" ||
			body === null ||
			!("isAcceptingMessages" in body) ||
			typeof body.isAcceptingMessages !== "boolean"
		) {
			return Response.json(
				{
					success: false,
					message: "isAcceptingMessages must be a boolean.",
				},
				{ status: 400 },
			);
		}

		await dbConnect();
		const user = await UserModel.findByIdAndUpdate(
			userId,
			{ isAcceptingMessages: body.isAcceptingMessages },
			{ new: true, runValidators: true },
		).select("isAcceptingMessages");

		if (!user) {
			return Response.json(
				{ success: false, message: "User not found." },
				{ status: 404 },
			);
		}

		return Response.json({
			success: true,
			message: "Message acceptance status updated successfully.",
			isAcceptingMessages: user.isAcceptingMessages,
		});
	} catch (error) {
		console.error("Error updating message acceptance status:", error);
		return Response.json(
			{ success: false, message: "Error updating message acceptance status." },
			{ status: 500 },
		);
	}
}
