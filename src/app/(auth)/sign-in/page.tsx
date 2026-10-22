"use client";
import React, { useEffect, useState } from 'react';
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import Link from 'next/link';
import { useDebounceValue } from 'usehooks-ts';
import { toast } from "@/components/ui/toast";
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';
import axios, { Axios, AxiosError } from "axios";
import { ApiResponse } from '@/types/ApiResponse';

const page = () => {
	const [username, setUsername] = useState("");
	const [usernameMessage, setUsernameMessage] = useState("");
	const [isCheckingUsername, setIsCheckingUsername] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const debouncedUsername = useDebounceValue(username, 300);
	const router = useRouter();

	//zod implementaition
	const form = useForm<z.infer<typeof signUpSchema>>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
		}
	});

	useEffect(() => {
		const checkUsernameUnique = async () => {
			if (debouncedUsername) {
				setIsCheckingUsername(true);
				setUsernameMessage("");
				try {
					const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`);
					setUsernameMessage(response.data.message);
				} catch (error) {
					const axiosError = error as AxiosError<ApiResponse>;
					setUsernameMessage(axiosError.response?.data.message ?? "Error checking username.");
				} finally {
					setIsCheckingUsername(false);
				}
			}
		}
		checkUsernameUnique();
	}, [debouncedUsername]);

	type formValues = z.infer<typeof signUpSchema>

	const onSumbit = async (data: formValues) => {
		setIsSubmitting(true);
		try {
			const response = await axios.post<ApiResponse>(`/api/sign-up`, data)
			toast.add({
				title: "Success",
				description: response.data.message
			});
			router.replace(`/verify/${username}`);
			setIsSubmitting(false);
		} catch (error) {
			console.error("Error in signup of user,", error);
			const axiosError = error as AxiosError<ApiResponse>;
			setUsernameMessage(axiosError.response?.data.message ?? "Error checking username.");
			let errorMessage = axiosError.response?.data.message;
			toast.add({
				title: "Signup failed",
				description: errorMessage,
			})
			setIsSubmitting(false);
		}
	}

	return (
		<div className={`flex justify-center items-center min-h-screen bg-gray-100`}>
			<div className={`w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md`}>
				<div className={`text-center`}>
					<h1 className={`text-4xl font-extrabold tracking-tight lg:text-5xl mb-6`} >
						Join Mystery Message
					</h1>
					<p className={`mb-4`} >
						Sign up to start your anonymous adventure.
					</p>
				</div>
				
			</div>
		</div>
	)
}

export default page
