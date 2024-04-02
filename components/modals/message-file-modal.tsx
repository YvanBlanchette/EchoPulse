"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import qs from "query-string";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { useModal } from "@/hooks/useModalStore";

const formSchema = z.object({
	fileUrl: z.string().min(1, {
		message: "Un fichier joint est requis",
	}),
});

export const MessageFileModal = () => {
	const { isOpen, onClose, type, data } = useModal();
	const { apiUrl, query } = data;
	const router = useRouter();

	const isModalOpen = isOpen && type === "messageFile";

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			fileUrl: "",
		},
	});

	const handleClose = () => {
		form.reset();
		onClose();
	};

	const isLoading = form.formState.isSubmitting;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const url = qs.stringifyUrl({ url: apiUrl || "", query });
			await axios.post(url, { ...values, content: values.fileUrl });

			form.reset();
			router.refresh();
			handleClose();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-center text-2xl font-semibold">Envoyer un document</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">Sélectionnez une image ou un document pdf à envoyer.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="space-y-8 px-6">
							<div className="flex items-center justify-center text-center">
								<FormField
									control={form.control}
									name="fileUrl"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<FileUpload endpoint="messageFile" value={field.value} onChange={field.onChange} />
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
						</div>
						<DialogFooter className="bg-gray-100 px-6 py-4">
							<Button variant="primary" disabled={isLoading} title="Envoyer le fichier">
								Envoyer
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
