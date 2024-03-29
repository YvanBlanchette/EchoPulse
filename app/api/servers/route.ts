import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// Function to create a new server
export async function POST(request: Request) {
	try {
		// Extract the name and image from the request
		const { name, imageUrl } = await request.json();
		// Get the User's profile
		const profile = await currentProfile();

		// If there is no profile, refuse access
		if (!profile) {
			return new NextResponse("Accès Refusé", { status: 401 });
		}

		// Create server in db
		const server = await db.server.create({
			data: {
				profileId: profile.id,
				name: name,
				imageUrl: imageUrl,
				inviteCode: uuidv4(),
				chambers: {
					create: [{ name: "général", profileId: profile.id }],
				},
				members: {
					create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
				},
			},
		});

		// Returnthe server response
		return NextResponse.json(server);

		//If there is an error...
	} catch (error) {
		// log the error...
		console.error("[SERVERS_POST]", error);
		// and throw a new error response
		return new NextResponse("Erreur Interne", { status: 500 });
	}
}
