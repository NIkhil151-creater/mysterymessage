"use client";
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from "@/components/ui/toast";
import { Controller, useForm } from 'react-hook-form';
import * as z from "zod";
import { verifySchema } from '@/schemas/verifySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Loader2 } from 'lucide-react';
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field"
import { Input } from '@base-ui/react/input';
import { Button } from '@/components/ui/button';

const VerifyAccount = () => {
	const router = useRouter();
	const params = useParams<{ username: string }>();
	const form = useForm<z.infer<typeof verifySchema>>({
		resolver: zodResolver(verifySchema)
	})

	const onSubmit = async (data: z.infer<typeof verifySchema>) => {
		try {
			const response = await axios.post(`/api/verify-code`, {
				username: params.username,
				code: data.code,
			})

			toast.add({
				title: "Success",
				description: response.data.message
			})
			router.replace(`/sign-in`)

		} catch (error) {
			console.error("Error in signup of user,", error);
			const axiosError = error as AxiosError<ApiResponse>;
			const errorMessage = axiosError.response?.data.message;
			toast.add({
				title: "Signup failed",
				description: errorMessage,
			})
		}
	}

	return (
		<div className={`flex justify-center items-center min-h-screen bg-background`}>
			<div className={`w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-md`} >
				<div className={`text-center`} >
					<h1 className={`text-4xl font-extrabold tracking-tight lg:text-5xl mb-6`} >
						Verify Your Account
					</h1>
					<p className={`mb-4`} >
						Enter the verification code sent to your email
					</p>
				</div>

				<form id="signup-form" onSubmit={form.handleSubmit(onSubmit)} className={`space-y-6`}>
					<FieldGroup>
						<Controller
							name="code"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="code">Verification Code</FieldLabel>
									<Input
										{...field}
										id="code"
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>
					</FieldGroup>
					<Button type='submit' >
						Submit
					</Button>
				</form>
			</div>
		</div>
	)
}

export default VerifyAccount
