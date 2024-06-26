"use client";

import { FileIcon, X } from "lucide-react";
import Image from "next/image";

import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";

interface FileUploadProps {
	onChange: (url?: string) => void;
	value: string;
	endpoint: "messageFile" | "serverImage";
}

export const FileUpload = ({ endpoint, value, onChange }: FileUploadProps) => {
	const fileType = value?.split(".").pop();

	if (value && fileType !== "pdf") {
		return (
			<div className="relative h-48 w-48">
				<Image fill src={value} alt="Upload" className="rounded-full" />
				<button
					onClick={() => onChange("")}
					className="bg-red-600 hover:bg-red-500 text-white p-1.5 rounded-full absolute top-4 right-4 shadow-sm"
					type="button"
				>
					<X />
				</button>
			</div>
		);
	}

	if (value && fileType === "pdf") {
		return (
			<div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
				<FileIcon className="h-10 w-10 fill-[#002388] stroke-[#eb9947]" />
				<a href={value} target="_blank" rel="noopener noreferrer" title="Ouvrir le fichier" className="ml-2 text-sm text-[#002388] hover:underline">
					{value}
				</a>
				<button
					onClick={() => onChange("")}
					className="bg-red-600 hover:bg-red-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
					type="button"
					title="Supprimer le fichier"
				>
					<X className="h-4 w-4" />
				</button>
			</div>
		);
	}

	return (
		<UploadDropzone
			endpoint={endpoint}
			onClientUploadComplete={(response) => {
				onChange(response?.[0].url);
			}}
			onUploadError={(error: Error) => {
				console.log(error);
			}}
			className="focus:outline-0"
		/>
	);
};
