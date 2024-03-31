import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		// Get current user's profile
		const profile = await currentProfile();
		// Get the chamber name and type from request
		const { name, type } = await request.json();
		// Extract searchParams function
		const { searchParams } = new URL(request.url);

		// Use searchParams to get the serverId
		const serverId = searchParams.get("serverId");

		// If no profile...
		if (!profile) {
			// return access denied response with a status code 401
			return new NextResponse("Accès Refusé", { status: 401 });
		}

		// If no serverId
		if (!serverId) {
			// return missing ID response with a status code 400
			return new NextResponse("ID Serveur Manquant", { status: 400 });
		}

		// If name === general
		if (name === "general") {
			// return restricted name response with a status code 400
			return new NextResponse("Le nom 'general' est un nom réservé", { status: 400 });
		}

		// Update the server data in the db
		const server = await db.server.update({
			where: {
				id: serverId,
				members: {
					some: {
						profileId: profile.id,
						role: {
							in: [MemberRole.ADMIN, MemberRole.MODERATOR],
						},
					},
				},
			},
			data: {
				chambers: {
					create: {
						profileId: profile.id,
						name,
						type,
					},
				},
			},
		});

		//return new server data
		return NextResponse.json(server);

		// If there is an error...
	} catch (error) {
		// log the error...
		console.error("[CHAMBERS_POST]", error);
		// and return an internal error with status code 500
		return new NextResponse("Erreur Interne", { status: 500 });
	}
}
