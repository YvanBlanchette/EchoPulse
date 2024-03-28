import { auth } from "@clerk/nextjs";

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// Function to handle authentification
const handleAuth = () => {
	// Extract userId form auth()
	const { userId } = auth();

	// If there is no userId, refuse access...
	if (!userId) throw new Error("Accès Refusé");

	// Otherwise return the userId.
	return { userId: userId };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
	serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
		.middleware(() => handleAuth())
		.onUploadComplete(() => {}),
	// To add more file types add them here VvV
	messageFile: f(["image", "pdf"])
		.middleware(() => handleAuth())
		.onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
