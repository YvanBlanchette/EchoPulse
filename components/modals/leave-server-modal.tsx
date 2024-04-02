"use client";

import axios from "axios";
import { useState } from "react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const LeaveServerModal = () => {
	const router = useRouter();
	const { isOpen, onClose, type, data } = useModal();

	const isModalOpen = isOpen && type === "leaveServer";
	const { server } = data;

	const [isLoading, setIsLoading] = useState(false);

	const onLeave = async () => {
		try {
			setIsLoading(true);
			await axios.patch(`/api/servers/${server?.id}/leave`);
			onClose();
			router.refresh();
			router.push("/");
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-10 flex flex-col items-center gap-1">
					<Logo width={300} height={60} variant="light" />
					<DialogTitle className="text-secondary text-center text-2xl font-semibold">{server?.name}</DialogTitle>
					<DialogDescription className="text-center text-sm font-medium text-zinc-500 px-6">
						Êtes-vous certain de vouloir quitter {server?.name}?<br /> Vous aurez besoin d&apos;une invitation pour y accéder de nouveau...
					</DialogDescription>
				</DialogHeader>
				<div className="p-6 flex justify-center items-center gap-4 bg-gray-100">
					<Button disabled={isLoading} onClick={() => onClose()} className="text-white">
						Annuler
					</Button>
					<Button disabled={isLoading} onClick={() => onLeave()} className="text-white bg-red-600 hover:bg-red-700">
						Quitter le serveur
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
