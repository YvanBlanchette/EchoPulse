import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ServerIdPageProps {
	params: {
		serverId: string;
	};
}

const ServerIdPage = async ({ params }: ServerIdPageProps) => {
	const profile = await currentProfile();

	// If there is no profile, refuse access
	if (!profile) {
		return redirectToSignIn();
	}

	const server = await db.server.findUnique({
		where: {
			id: params.serverId,
			members: {
				some: {
					profileId: profile.id,
				},
			},
		},
		include: {
			chambers: {
				where: {
					name: "général",
				},
				orderBy: {
					createdAt: "asc",
				},
			},
		},
	});

	const initialChamber = server?.chambers[0];

	if (initialChamber?.name !== "général") {
		return null;
	}

	return redirect(`/servers/${params.serverId}/chambers/${initialChamber?.id}`);
};
export default ServerIdPage;
