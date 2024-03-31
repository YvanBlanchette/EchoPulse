import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Function to update server settings in db
export async function PATCH(request: Request, { params }: { params: { serverId: string } }) {
	try {
		// Get the current user's profile
		const profile = await currentProfile();
		// Extract the new name and imageUrl from the request
		const { name, imageUrl } = await request.json();

		// If there is no profile...
		if (!profile) {
			// return an access denied response with a 401 status code
			return new NextResponse("Accès refusé", { status: 401 });
		}

		// Update the server...
		const server = await db.server.update({
			// Find the server with its id...
			where: {
				id: params.serverId,
				// make sure the profile is an admin...
				profileId: profile.id,
			},
			// Set the new data.
			data: {
				name: name,
				imageUrl: imageUrl,
			},
		});

		// Return the new server response
		return NextResponse.json(server);

		// If there is an error...
	} catch (error) {
		// log the error...
		console.error("[SERVER_ID_PATCH]", error);
		// and return an internal error response with a 500 status code
		return new NextResponse("Erreur Interne", { status: 500 });
	}
}

// Function to delete server in db
export async function DELETE(request: Request, { params }: { params: { serverId: string } }) {
	try {
		// Get the current user's profile
		const profile = await currentProfile();

		// If there is no profile...
		if (!profile) {
			// return an access denied response with a 401 status code
			return new NextResponse("Accès refusé", { status: 401 });
		}

		// Delete the server...
		const server = await db.server.delete({
			// Find the server with its id...
			where: {
				id: params.serverId,
				// make sure the profile is the admin...
				profileId: profile.id,
			},
		});

		// Return the new server response
		return NextResponse.json(server);

		// If there is an error...
	} catch (error) {
		// log the error...
		console.error("[SERVER_ID_DELETE]", error);
		// and return an internal error response with a 500 status code
		return new NextResponse("Erreur Interne", { status: 500 });
	}
}
