"use client";
import React from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Message } from '@/model/User';
import axios from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { toast } from './ui/toast';

type MessageCardProps = {
	message: Message;
	onMessageDelete: (messageId:string) => void;
}

const MessageCard = ({ message, onMessageDelete } : MessageCardProps) => {
	const handleDeleteConfirm = async () => {
		const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
		toast.add({
			title : response.data.message,
		});
		onMessageDelete(String(message._id));
	}
	return (
		<div>
			<Card>
				<CardHeader>
					<CardTitle>Card Title</CardTitle>
					<AlertDialog>
						<AlertDialogTrigger render={<Button variant="destructive" />}>
							<X className={`w-5 h-5`} />
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete your account
									from our servers.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
					<CardDescription>Card Description</CardDescription>
				</CardHeader>
				<CardContent>
					<p>Card Content</p>
				</CardContent>
			</Card>
		</div>
	)
}

export default MessageCard