import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// Function to update the server
export async function PATCH(request: Request, { params }: { params: { serverId: string } }) {
	try {
		// Fetch the current user's profile
		const profile = await currentProfile();

		// If there is no profile...
		if (!profile) {
			// Return response: Access denied 401
			return new NextResponse("Accès Refusé", { status: 401 });
		}

		// If the server request dosent have parameters...
		if (!params.serverId) {
			// Return response: Missing server id 400
			return new NextResponse("Id de Serveur manquant", { status: 400 });
		}

		// Update the server
		const server = await db.server.update({
			where: {
				id: params.serverId,
				profileId: profile.id,
			},
			data: {
				inviteCode: uuidv4(),
			},
		});

		// Return new server data
		return NextResponse.json(server);

		// If an error occurs...
	} catch (error) {
		// log the error...
		console.error("[SERVER_ID] Une erreur est survenue: ", error);
		// and return a response: Internal server error 500
		return new NextResponse("Erreur interne", { status: 500 });
	}
}
