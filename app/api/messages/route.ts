import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Message } from "@prisma/client";
import { NextResponse } from "next/server";

const MESSAGES_BATCH = 10;

export async function GET(request: Request) {
	try {
		// Get the current user's profile
		const profile = await currentProfile();

		const { searchParams } = new URL(request.url);

		const cursor = searchParams.get("cursor");
		const chamberId = searchParams.get("chamberId");

		// If there is no profile...
		if (!profile) {
			// return access denied response with a status code 401
			return new NextResponse("Accès Refusé", { status: 401 });
		}

		// If there is no chamber id...
		if (!chamberId) {
			// return EchoChamber Id Missing response with a status code 400
			return new NextResponse("ID EchoChambre manquant", { status: 400 });
		}

		let messages: Message[] = [];

		if (cursor) {
			messages = await db.message.findMany({
				take: MESSAGES_BATCH,
				skip: 1,
				cursor: {
					id: cursor,
				},
				where: {
					chamberId: chamberId,
				},
				include: {
					member: {
						include: {
							profile: true,
						},
					},
				},
				orderBy: {
					createdAt: "desc",
				},
			});
		} else {
			messages = await db.message.findMany({
				take: MESSAGES_BATCH,
				where: {
					chamberId: chamberId,
				},
				include: {
					member: {
						include: {
							profile: true,
						},
					},
				},
				orderBy: {
					createdAt: "desc",
				},
			});
		}

		let nextCursor = null;

		if (messages.length === MESSAGES_BATCH) {
			nextCursor = messages[MESSAGES_BATCH - 1].id;
		}

		return NextResponse.json({ items: messages, nextCursor });
	} catch (error) {
		console.error("[MESSAGES_GET]", error);
		return new NextResponse("Erreur Interne", { status: 500 });
	}
}
