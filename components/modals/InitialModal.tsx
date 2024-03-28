"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/file-upload";
import { useRouter } from "next/navigation";

// Using zod resolver to validate the input fields
const formSchema = z.object({
	name: z.string().min(1, { message: "Le nom de serveur est nécessaire pour créer un nouveau serveur." }),
	imageUrl: z.string().min(1, { message: "L'image de serveur est nécessaire pour créer un nouveau serveur" }),
});

const InitialModal = () => {
	const [isMounted, setIsMounted] = useState(false);
	const router = useRouter();

	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Preparing the form
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			imageUrl: "",
		},
	});

	// Initializing the loading state
	const isLoading = form.formState.isSubmitting;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.post("/api/servers", values);
			form.reset();
			router.refresh();
			window.location.reload();
		} catch (error) {
			console.error("Une erreur est survenue: ", error);
		}
	};

	if (!isMounted) {
		return null;
	}

	return (
		<Dialog open={true}>
			<DialogContent className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-center text-2xl font-semibold">Personnalisez votre serveur</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">
						Donnez un peu de personnalité à votre serveur en lui donnant un nom et une image. Vous pourrez toujours les changer plus tard.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="space-y-8 px-6">
							<div className="flex items-center justify-center text-center">
								<FormField
									control={form.control}
									name="imageUrl"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<FileUpload endpoint="serverImage" value={field.value} onChange={field.onChange} />
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
											Nom du Serveur <span className="text-red-500">*</span>
										</FormLabel>
										<FormControl>
											<Input
												disabled={isLoading}
												className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
												placeholder="Inscrire le nom du votre serveur..."
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter className="bg-gray-100 px-6 py-4">
							<Button variant="primary" disabled={isLoading}>
								Envoyer
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
export default InitialModal;
