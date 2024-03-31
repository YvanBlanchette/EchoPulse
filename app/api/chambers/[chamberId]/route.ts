import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

// Function to delete an EchoChamber
export async function DELETE(request: Request, { params }: { params: { chamberId: string } }) {
	try {
		// Get current user's profile
		const profile = await currentProfile();

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

		// If no chamberId
		if (!params.chamberId) {
			// return missing ID response with a status code 400
			return new NextResponse("ID EchoChambre Manquant", { status: 400 });
		}

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
					delete: {
						id: params.chamberId,
						name: {
							not: "général",
						},
					},
				},
			},
		});

		return NextResponse.json(server);
	} catch (error) {
		console.error("[CHAMBER_ID_DELETE]", error);
		return new NextResponse("Erreur Interne", { status: 500 });
	}
}

// Function to update EchoChamber details
export async function PATCH(request: Request, { params }: { params: { chamberId: string } }) {
	try {
		// Get current user's profile
		const profile = await currentProfile();

		// Get chamber name and type from the request
		const { name, type } = await request.json();

		// Extract searchParams function
		const { searchParams } = new URL(request.url);

		// Extract the serverId form the searchParams fuction
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

		// If no chamberId
		if (!params.chamberId) {
			// return missing ID response with a status code 400
			return new NextResponse("ID EchoChambre Manquant", { status: 400 });
		}

		// If the EchoChamber's name is général...
		if (name === "général") {
			// return request denied with a status code 400
			return new NextResponse("Désolé, le nom 'general' est un nom réservé. SVP choisir un autre nom.", { status: 400 });
		}

		// Update the EchoChamber's details in the db
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
					update: {
						where: {
							id: params.chamberId,
							NOT: {
								name: "general",
							},
						},
						data: {
							name,
							type,
						},
					},
				},
			},
		});

		return NextResponse.json(server);
	} catch (error) {
		console.log("[ID_CHAMBER_PATCH]", error);
		return new NextResponse("Erreur Interne", { status: 500 });
	}
}
