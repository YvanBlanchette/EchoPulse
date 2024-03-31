"use client";

import axios from "axios";
import { useState } from "react";
import qs from "query-string";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/hooks/useModalStore";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const DeleteEchoChamberModal = () => {
	const router = useRouter();
	const { isOpen, onClose, type, data } = useModal();

	const isModalOpen = isOpen && type === "deleteEchoChamber";
	const { server, chamber } = data;

	const [isLoading, setIsLoading] = useState(false);

	const onDelete = async () => {
		try {
			setIsLoading(true);
			const url = qs.stringifyUrl({
				url: `/api/chambers/${chamber?.id}`,
				query: {
					serverId: server?.id,
				},
			});
			await axios.delete(url);
			onClose();
			router.push(`/servers/${server?.id}`);
			router.refresh();
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
					<DialogTitle className="text-secondary text-center text-2xl font-semibold">{chamber?.name}</DialogTitle>
					<DialogDescription className="text-center text-sm font-medium text-zinc-500 px-6">
						Êtes-vous certain de vouloir supprimer {chamber?.name}?<br /> Cet action est irréversible, <b>vous ne pourrez plus revenir en arrière...</b>
					</DialogDescription>
				</DialogHeader>
				<div className="p-6 flex justify-center items-center gap-4 bg-gray-100">
					<Button disabled={isLoading} onClick={() => onClose()} className="text-white bg-[#002388] hover:bg-[#002388] hover:opacity-80">
						Annuler
					</Button>
					<Button disabled={isLoading} onClick={() => onDelete()} className="text-white bg-red-600 hover:bg-red-700">
						Supprimer
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
