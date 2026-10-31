import NextAuth from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";
const { auth } = NextAuth(authOptions);

export async function GET() {
    const session = await auth();
    await dbConnect();

    if(!session || !session.user) {
        return Response.json(
            {
                success : false,
                message : "Not authenticated."
            }, {status : 401}
        )
    }
    const userId = new mongoose.Types.ObjectId(session.user._id);

    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind : "$messages"},
            { $sort : {"messages.createdAt" : -1}},
            { $group : {_id : "$_id", messages : {$push : "$messages"}}}
        ])
        if (!user || user.length === 0) {
            return Response.json(
                {
                    success : false,
                    message : "User not found."
                }, {status : 404}
            )
        }

        return Response.json(
            {
                success : true, 
                messages : user[0].messages
            },
            {status : 200}
        )
    } catch (error) {
        console.log("An unexpected error occurred ," , error);
        return Response.json(
				{
					success: false,
					message: "An unexpected error occurred."
				},
				{ status: 500 }
			)
    }
}