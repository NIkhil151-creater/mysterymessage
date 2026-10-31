import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';

export async function proxy(request: NextRequest) {
	const token = await getToken({
		req: request,
		secret: process.env.NEXTAUTH_SECRET,
	});
	const url = request.nextUrl;
	let isAuthenticated = false;

	if (token?._id) {
		await dbConnect();
		isAuthenticated = Boolean(await UserModel.exists({ _id: token._id }));
	}

	if (isAuthenticated &&
		(
			url.pathname === "/" ||
			url.pathname.startsWith("/sign-in") ||
			url.pathname.startsWith("/sign-up") ||
			url.pathname.startsWith("/verify")
		)
	) {
		return NextResponse.redirect(new URL('/dashboard', request.url));
	}

	if(!isAuthenticated && url.pathname.startsWith("/dashboard")) {
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}

	return NextResponse.next();
	};

export const config = {
	matcher: [
		"/sign-in",
		"/sign-up",
		"/",
		"/dashboard/:path*",
		"/verify/:path*",
	]
};