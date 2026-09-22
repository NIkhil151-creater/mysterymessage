import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export const authOptions : NextAuthConfig ={
    providers : [
        Credentials({
            id : "credentials",
            name : "Credentials",
            credentials: {
                username : {label : "Username", type : "text", placeholder : "jsmith"},
                password : {label : "Password", type : "password",},
            },
        })
    ]
}