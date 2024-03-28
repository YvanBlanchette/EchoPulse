"use client";

import { X } from "lucide-react";
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
