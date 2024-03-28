"use client";

import axios from "axios";
import { useState } from "react";
import { Check, Copy, RefreshCw } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/hooks/useModalStore";
import Logo from "@/components/Logo";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useOrigin } from "@/hooks/useOrigin";

export const InviteModal = () => {
	const { onOpen, isOpen, onClose, type, data } = useModal();
	const origin = useOrigin();

	const isModalOpen = isOpen && type === "invite";
	const { server } = data;

	const [copied, setCopied] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

	const onCopy = () => {
		navigator.clipboard.writeText(inviteUrl);
		setCopied(true);

		setTimeout(() => {
			setCopied(false);
		}, 1000);
	};

	const onNew = async () => {
		try {
			setIsLoading(true);
			const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);

			onOpen("invite", { server: response.data });
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 flex flex-col items-center gap-2">
					<Logo width={300} height={60} variant="light" />
					<DialogTitle className="text-secondary text-center text-2xl font-semibold">Inviter des amis</DialogTitle>
					<DialogDescription className="text-center text-md font-medium text-zinc-500">Invitez vos amis à rejoindre la communauté EchoPulse!</DialogDescription>
				</DialogHeader>
				<div className="p-6">
					<Label className="uppercase text-xs font-bold text-zinc-500 dark:text-primary/70">Lien d'invitation du serveur</Label>
					<div className="flex items-center mt-2 gap-x-2">
						<Input
							disabled={isLoading}
							className="bg-zinc-300/50 my-2 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
							value={inviteUrl}
						/>
						<Button disabled={isLoading} onClick={onCopy} variant="transparent" size="icon">
							{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
						</Button>
					</div>
					<div className="w-full flex justify-center items-center">
						<Button onClick={onNew} disabled={isLoading} variant="primary" size="md" className="text-sm text-white mt-4 text-center">
							Générer une nouvelle invitation
							<RefreshCw className="h-5 w-5 ml-4" />
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
