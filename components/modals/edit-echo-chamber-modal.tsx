"use client";

import qs from "query-string";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ChamberType } from "@prisma/client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/useModalStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect } from "react";
import Logo from "@/components/Logo";

const formSchema = z.object({
	name: z
		.string()
		.min(1, {
			message: "Chamber name is required.",
		})
		.refine((name) => name !== "général", {
			message: "Le nom 'général' est un nom réservé, SVP choisir un autre nom.",
		}),
	type: z.nativeEnum(ChamberType),
});

export const EditEchoChamberModal = () => {
	const { isOpen, onClose, type, data } = useModal();
	const router = useRouter();

	const isModalOpen = isOpen && type === "editEchoChamber";
	const { chamber, server } = data;

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			type: chamber?.type || ChamberType.TEXT,
		},
	});

	useEffect(() => {
		if (chamber) {
			form.setValue("name", chamber.name);
			form.setValue("type", chamber.type);
		}
	}, [form, chamber]);

	const isLoading = form.formState.isSubmitting;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const url = qs.stringifyUrl({
				url: `/api/chambers/${chamber?.id}`,
				query: {
					serverId: server?.id,
				},
			});
			await axios.patch(url, values);

			form.reset();
			router.refresh();
			onClose();
		} catch (error) {
			console.log(error);
		}
	};

	const handleClose = () => {
		form.reset();
		onClose();
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6 flex flex-col items-center gap-2">
					<Logo width={300} height={60} variant="light" />
					<DialogTitle className="text-center text-2xl font-semibold">Modifier une EchoChambre</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="space-y-8 px-6">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-sm font-bold text-zinc-500 dark:text-secondary/70">
											Nom de l'EchoChambre <span className="text-red-500">*</span>
										</FormLabel>
										<FormControl>
											<Input
												disabled={isLoading}
												className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
												placeholder="Inscrire le nom du votre EchoChambre..."
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Type d'EchoChambre <span className="text-red-500">*</span>
										</FormLabel>
										<Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
													<SelectValue placeholder="Choisir le type d'EchoChambre" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{Object.values(ChamberType).map((type) => (
													<SelectItem key={type} value={type} className="capitalize">
														{type.toLowerCase()}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter className="bg-gray-100 px-6 py-4">
							<Button variant="primary" disabled={isLoading}>
								Enregistrer
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
