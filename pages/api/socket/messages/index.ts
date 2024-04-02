import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(request: NextApiRequest, response: NextApiResponseServerIo) {
	if (request.method !== "POST") {
		return response.status(405).json({ message: "Méthode Refusée" });
	}

	try {
		const profile = await currentProfilePages(request);
		const { content, fileUrl } = request.body;
		const { serverId, chamberId } = request.query;

		if (!profile) {
			return response.status(401).json({ message: "Accès Refusé" });
		}

		if (!serverId) {
			return response.status(400).json({ message: "ID de Serveur manquant" });
		}

		if (!chamberId) {
			return response.status(400).json({ message: "ID EchoChambre manquant" });
		}

		if (!content) {
			return response.status(400).json({ message: "Contenu Echo manquant" });
		}

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

		if (!server) {
			return response.status(404).json({ message: "Serveur Introuvable" });
		}

		const chamber = await db.chamber.findFirst({
			where: {
				id: chamberId as string,
				serverId: serverId as string,
			},
		});

		if (!chamber) {
			return response.status(404).json({ message: "EchoChambre Introuvable" });
		}

		const member = server.members.find((member) => member.profileId === profile.id);

		if (!member) {
			return response.status(404).json({ message: "Utilisateur Introuvable" });
		}

		const message = await db.message.create({
			data: {
				content,
				fileUrl,
				chamberId: chamberId as string,
				memberId: member.id,
			},
			include: {
				member: {
					include: {
						profile: true,
					},
				},
			},
		});

		const chamberKey = `chat:${chamberId}:messages`;

		response?.socket.server?.io?.emit(chamberKey, message);

		return response.status(200).json(message);
	} catch (error) {
		console.error("[MESSAGES_POST]", error);
		return response.status(500).json({ message: "Erreur Interne" });
	}
}
