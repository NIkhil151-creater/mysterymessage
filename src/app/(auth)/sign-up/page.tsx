"use client";
import React, { useEffect, useState } from 'react';
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import Link from 'next/link';
import { useDebounceValue } from 'usehooks-ts';
import { toast } from "@/components/ui/toast";
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';
import axios, { AxiosError } from "axios";
import { ApiResponse } from '@/types/ApiResponse';
import { Loader2 } from 'lucide-react';

const SignUpPage = () => {
	const [username, setUsername] = useState("");
	const [usernameMessage, setUsernameMessage] = useState("");
	const [isCheckingUsername, setIsCheckingUsername] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [debouncedUsername] = useDebounceValue(username, 300);
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

	const onSubmit = async (data: formValues) => {
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
			const errorMessage = axiosError.response?.data.message;
			toast.add({
				title: "Signup failed",
				description: errorMessage,
			})
			setIsSubmitting(false);
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-background text-foreground">
			<div className="w-full max-w-md space-y-8 rounded-lg bg-card p-8 text-card-foreground shadow-md">
				<div className={`text-center`}>
					<h1 className={`text-4xl font-extrabold tracking-tight lg:text-5xl mb-6`} >
						Join Mystery Message
					</h1>
					<p className={`mb-4`} >
						Sign up to start your anonymous adventure.
					</p>
				</div>
				<form id="signup-form" onSubmit={form.handleSubmit(onSubmit)} className={`space-y-6`}>
					<FieldGroup>
						<Controller
							name="username"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="username">Username</FieldLabel>
									<Input
										{...field}
										id="username"
										aria-invalid={fieldState.invalid}
										autoComplete="username"
										onChange={(e) => {
											field.onChange(e);
											setUsername(e.target.value);
										}}
									/>
									{isCheckingUsername && <Loader2 className={`animate-spin`}/>}
									{!isCheckingUsername && usernameMessage && (
										<p className="text-sm text-muted-foreground">{usernameMessage}</p>
									)}
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>
					</FieldGroup>
					<FieldGroup>
						<Controller
							name="email"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="email">Email</FieldLabel>
									<Input
										{...field}
										id="email"
										type='email'
										aria-invalid={fieldState.invalid}
										autoComplete="email"
									/>
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>
					</FieldGroup>
					<FieldGroup>
						<Controller
							name="password"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="password">Password</FieldLabel>
									<Input
										{...field}
										id="password"
										type='password'
										aria-invalid={fieldState.invalid}
										autoComplete="password"
									/>
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>
					</FieldGroup>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? (
							<>
								<Loader2 className={`mr-2 h-4 w-4 animate-spin`} /> Please Wait
							</>
						) : ("SignUp")}
					</Button>
				</form>
				<div className={`text-center mt-4`} >
					<p className={``} >
						Already a member?{' '}
						<Link href={"/sign-in"} className={`text-blue-600 hover:text-blue-800`}>
							Sign In
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
}

export default SignUpPage
