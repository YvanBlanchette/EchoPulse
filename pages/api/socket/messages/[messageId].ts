import { NextApiRequest } from "next";
import { MemberRole } from "@prisma/client";

import { NextApiResponseServerIo } from "@/types";
import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";

// Function to update/delete a message
export default async function handler(request: NextApiRequest, response: NextApiResponseServerIo) {
	// Limit the request methods
	if (request.method !== "DELETE" && request.method !== "PATCH") {
		return response.status(405).json({ error: "Méthode refusée" });
	}

	try {
		// Get the current user's profile
		const profile = await currentProfilePages(request);

		// Extract the Ids form the request
		const { messageId, serverId, chamberId } = request.query;

		// Extract the message content from the request body
		const { content } = request.body;

		// If there is no profile...
		if (!profile) {
			// return a access denied (401) response
			return response.status(401).json({ error: "Accès refusé" });
		}

		// If there is no server id...
		if (!serverId) {
			// return a server id missing (400) response
			return response.status(400).json({ error: "Id Serveur manquant" });
		}

		// If there is no chamber id...
		if (!chamberId) {
			// return a chamber id missing (400) response
			return response.status(400).json({ error: "Id Chambre manquant" });
		}

		// Get the server from the servers in the db
		const server = await db.server.findFirst({
			where: {
				id: serverId as string,
				members: {
					some: {
						profileId: profile.id,
					},
				},
			},
			include: {
				members: true,
			},
		});

		// If there is no server...
		if (!server) {
			// return a server not found (404) response
			return response.status(404).json({ error: "Serveur introuvable" });
		}

		// Get the EchoChamber form the chambers in the db
		const chamber = await db.chamber.findFirst({
			where: {
				id: chamberId as string,
				serverId: serverId as string,
			},
		});

		// If there is no chamber...
		if (!chamber) {
			// return a chamber not found (404) response
			return response.status(404).json({ error: "EchoChambre introuvable" });
		}

		// Get the current member form the members in the db
		const member = server.members.find((member) => member.profileId === profile.id);

		// If there is no member...
		if (!member) {
			// return a member not found (404) response
			return response.status(404).json({ error: "Utilisateur introuvable" });
		}

		// Get the message from the messages in the db
		let message = await db.message.findFirst({
			where: {
				id: messageId as string,
				chamberId: chamberId as string,
			},
			include: {
				member: {
					include: {
						profile: true,
					},
				},
			},
		});

		// If there is no message...
		if (!message || message.deleted) {
			// return a message not found (404) response
			return response.status(404).json({ error: "Message introuvable" });
		}

		//Creating some constants
		const isMessageOwner = message.memberId === member.id;
		const isAdmin = member.role === MemberRole.ADMIN;
		const isModerator = member.role === MemberRole.MODERATOR;
		const canModify = isMessageOwner || isAdmin || isModerator;

		// If modifying is not allowed for the user...
		if (!canModify) {
			// return a access denied (401) response
			return response.status(401).json({ error: "Accès Refusé" });
		}

		// If request method is delete...
		if (request.method === "DELETE") {
			// Delete the message
			message = await db.message.update({
				where: {
					id: messageId as string,
				},
				data: {
					fileUrl: null,
					content: "Ce message à été supprimé...",
					deleted: true,
				},
				include: {
					member: {
						include: {
							profile: true,
						},
					},
				},
			});
		}

		// If request method is patch
		if (request.method === "PATCH") {
			// If not the message owner...
			if (!isMessageOwner) {
				// return a access denied (401) response
				return response.status(401).json({ error: "Accès Refusé" });
			}

			// Modify the message
			message = await db.message.update({
				where: {
					id: messageId as string,
				},
				data: {
					content,
				},
				include: {
					member: {
						include: {
							profile: true,
						},
					},
				},
			});
		}

		// Create update key
		const updateKey = `chat:${chamberId}:messages:update`;

		// Update the socket
		response?.socket?.server?.io?.emit(updateKey, message);

		// Return message
		return response.status(200).json(message);

		// If an error occurs...
	} catch (error) {
		// log the error...
		console.error("[MESSAGE_ID_PAGES]", error);
		// and return an internal error (500) response
		return response.status(500).json({ error: "Erreur Interne" });
	}
}
