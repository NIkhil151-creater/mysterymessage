"use client";

import { useState } from 'react';
import type * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { signInSchema } from '@/schemas/signInSchema';

const SignUpPage = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();
	type formValues = z.infer<typeof signInSchema>;

	const form = useForm<formValues>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			identifier: "",
			password: "",
		},
	});

	const onSubmit = async (data: formValues) => {
		setIsSubmitting(true);

		try {
			const result = await signIn('credentials', {
				redirect: false,
				identifier: data.identifier,
				password: data.password,
			});

			if (result?.error) {
				toast.add({
					title: "Login Failed",
					description: "Incorrect username or password",
				});
				return;
			}

			if (result?.url) {
				router.replace("/dashboard");
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-background text-foreground">
			<div className="w-full max-w-md space-y-8 rounded-lg bg-card p-8 text-card-foreground shadow-md">
				<div className={`text-center`}>
					<h1 className={`text-4xl font-extrabold tracking-tight lg:text-5xl mb-6`}>
						Join Mystery Message
					</h1>
					<p className={`mb-4`}>
						Sign in to start your anonymous adventure.
					</p>
				</div>
				<form id="signup-form" onSubmit={form.handleSubmit(onSubmit)} className={`space-y-6`}>
					<FieldGroup>
						<Controller
							name="identifier"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="email">Email</FieldLabel>
									<Input
										{...field}
										id="email"
										type="email"
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
										type="password"
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
						) : "Sign In"}
					</Button>
				</form>
				<div className={`text-center mt-4`}>
					<p className={``}>
						Already a member?{' '}
						<Link href={"/sign-in"} className={`text-blue-600 hover:text-blue-800`}>
							Sign In
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default SignUpPage;
