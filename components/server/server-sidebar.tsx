import { ChamberType } from "@prisma/client";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ServerHeader } from "@/components/server/server-header";

interface ServerSidebarProps {
	serverId: string;
}

export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
	// Fetch the current user's profile
	const profile = await currentProfile();

	// If there is no profile...
	if (!profile) {
		// redirect to login screen
		return redirect("/");
	}

	// Fetch server by  serverId
	const server = await db.server.findUnique({
		where: {
			id: serverId,
		},
		// Include chambers (ordered by creation date ascending)
		include: {
			chambers: {
				orderBy: {
					createdAt: "asc",
				},
			},
			// and members profiles (ordered by role ascending)
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

	// Filtering the chambers by types and putting them in seperate variables
	const textChambers = server?.chambers.filter((chamber) => chamber.type === ChamberType.TEXT);
	const audioChambers = server?.chambers.filter((chamber) => chamber.type === ChamberType.AUDIO);
	const videoChambers = server?.chambers.filter((chamber) => chamber.type === ChamberType.VIDEO);

	// Filter out the current user from the members list
	const members = server?.members.filter((member) => member.profileId !== profile.id);

	if (!server) {
		return redirect("/");
	}

	const role = server.members.find((member) => member.profileId === profile.id)?.role;

	return (
		<div className="flex flex-col h-full w-full text-primary dark:bg-[#2b2b31] bg-[#f2f3f5]">
			<ServerHeader server={server} role={role} />
		</div>
	);
};
