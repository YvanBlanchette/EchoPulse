import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: { memberId: string } }) {
	try {
		// Get the current user's profile
		const profile = await currentProfile();

		// Extract the serach params function
		const { searchParams } = new URL(request.url);

		// Get the role form the request
		const { role } = await request.json();

		// Get the serverId from the params
		const serverId = searchParams.get("serverId");

		// If there is no profile...
		if (!profile) {
			//return a access denied response with a status code 401
			return new NextResponse("Accès Refusé", { status: 401 });
		}

		// If there is no serverId...
		if (!serverId) {
			// return a missing id response with a status code 400
			return new NextResponse("Id Serveur Manquant", { status: 400 });
		}

		//If there is no memberId...
		if (!params.memberId) {
			// return a missing id response with a status code 400
			return new NextResponse("Id Utilisateur Manquant", { status: 400 });
		}

		// Update the server in the db
		const server = await db.server.update({
			where: {
				id: serverId,
				profileId: profile.id,
			},
			data: {
				members: {
					update: {
						where: {
							id: params.memberId,
							profileId: {
								not: profile.id,
							},
						},
						data: {
							role,
						},
					},
				},
			},
			include: {
				members: {
					include: {
						profile: true,
					},
					orderBy: {
						role: "asc",
					},
				},
			},
		});

		// return a  response with the updated server data
		return NextResponse.json(server);

		// If there is an error...
	} catch (error) {
		// log the error...
		console.error("[MEMBERS_ID_PATCH]", error);
		// and return a internal error response with a status code 500.
		return new NextResponse("Erreur Interne", { status: 500 });
	}
}

// Function to kick a member from a server
export async function DELETE(request: Request, { params }: { params: { memberId: string } }) {
	try {
		// Get current user's profile
		const profile = await currentProfile();

		// Extract the serach params function
		const { searchParams } = new URL(request.url);

		// Get the serverId from the params
		const serverId = searchParams.get("serverId");

		// If there is no profile...
		if (!profile) {
			//return a access denied response with a status code 401
			return new NextResponse("Accès Refusé", { status: 401 });
		}

		// If there is no serverId...
		if (!serverId) {
			// return a missing id response with a status code 400
			return new NextResponse("Id Serveur Manquant", { status: 400 });
		}

		//If there is no memberId...
		if (!params.memberId) {
			// return a missing id response with a status code 400
			return new NextResponse("Id Utilisateur Manquant", { status: 400 });
		}

		// Delete the user from the server in the db
		const server = await db.server.update({
			where: {
				id: serverId,
				profileId: profile.id,
			},
			data: {
				members: {
					deleteMany: {
						id: params.memberId,
						profileId: {
							not: profile.id,
						},
					},
				},
			},
			include: {
				members: {
					include: {
						profile: true,
					},
					orderBy: {
						role: "asc",
					},
				},
			},
		});

		// return a  response with the updated server data
		return NextResponse.json(server);
		// If there is an error...
	} catch (error) {
		// log the error...
		console.error("[MEMBER_ID_DELETE]", error);
		// and return a internal error response with a status code 500.
		return new NextResponse("Erreur Interne", { status: 500 });
	}
}
