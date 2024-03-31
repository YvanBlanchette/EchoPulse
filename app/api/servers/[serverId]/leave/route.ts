import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: { serverId: string } }) {
	try {
		// Get current user's profile
		const profile = await currentProfile();

		// If no profile...
		if (!profile) {
			// return access denied response with a status code 401
			return new NextResponse("Accès Refusé", { status: 401 });
		}

		// If no serverId...
		if (!params.serverId) {
			// return missing ID response with a status code 400
			return new NextResponse("ID Serveur Manquant", { status: 400 });
		}

		const server = await db.server.update({
			where: {
				id: params.serverId,
				profileId: {
					not: profile.id,
				},
				members: {
					some: {
						profileId: profile.id,
					},
				},
			},
			data: {
				members: {
					deleteMany: {
						profileId: profile.id,
					},
				},
			},
		});

		return NextResponse.json(server);
	} catch (error) {
		console.error("[SERVER_ID_LEAVE]", error);
		return new NextResponse("Erreur interne", { status: 500 });
	}
}
