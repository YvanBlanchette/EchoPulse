import { ChamberType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { Mic, Text, Video } from "lucide-react";
import { BiSolidCrown, BiSolidShield } from "react-icons/bi";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { ServerHeader } from "@/components/server/server-header";
import { ServerSearch } from "@/components/server/server-search";
import { ServerSection } from "@/components/server/server-section";
import { ServerChamber } from "@/components/server/server-chamber";
import { ServerMember } from "./server-member";

interface ServerSidebarProps {
	serverId: string;
}

const iconMap = {
	[ChamberType.TEXT]: <Text className="mr-2 h-4 w-4" />,
	[ChamberType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
	[ChamberType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
	[MemberRole.GUEST]: null,
	[MemberRole.MODERATOR]: <BiSolidShield title="Modérateur" className="h-4 w-4 mr-2 text-[#eb9947]" />,
	[MemberRole.ADMIN]: <BiSolidCrown title="Administrateur" className="h-4 w-4 mr-2 text-[#eb9947]" />,
};

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
			<ScrollArea className="flex-1 px-3">
				<div className="mt-2">
					<ServerSearch
						data={[
							{
								label: "EchoChambres textes",
								type: "chamber",
								data: textChambers?.map((chamber) => ({
									id: chamber.id,
									name: chamber.name,
									icon: iconMap[chamber.type],
								})),
							},
							{
								label: "EchoChambres vocales",
								type: "chamber",
								data: audioChambers?.map((chamber) => ({
									id: chamber.id,
									name: chamber.name,
									icon: iconMap[chamber.type],
								})),
							},
							{
								label: "EchoChambres vidéos",
								type: "chamber",
								data: videoChambers?.map((chamber) => ({
									id: chamber.id,
									name: chamber.name,
									icon: iconMap[chamber.type],
								})),
							},
							{
								label: "Utilisateurs",
								type: "member",
								data: members?.map((member) => ({
									id: member.id,
									name: member.profile.name,
									icon: roleIconMap[member.role],
								})),
							},
						]}
					/>
				</div>
				<Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-mc my-2" />
				{/* !---> TEXT ECHOCHAMBERS <---! */}
				{!!textChambers?.length && (
					<div className="mb-2">
						<ServerSection sectionType="chambers" chamberType={ChamberType.TEXT} role={role} label="EchoChambres" />
						<div className="space-y-[2px]">
							{textChambers.map((chamber) => (
								<ServerChamber key={chamber.id} chamber={chamber} role={role} server={server} />
							))}
						</div>
					</div>
				)}
				{/* !---> AUDIO ECHOCHAMBERS <---! */}
				{!!audioChambers?.length && (
					<div className="mb-2">
						<div className="space-y-[2px]">
							{audioChambers.map((chamber) => (
								<ServerChamber key={chamber.id} chamber={chamber} role={role} server={server} />
							))}
						</div>
					</div>
				)}
				{/* !---> VIDEO ECHOCHAMBERS <---! */}
				{!!videoChambers?.length && (
					<div className="mb-2">
						<div className="space-y-[2px]">
							{videoChambers.map((chamber) => (
								<ServerChamber key={chamber.id} chamber={chamber} role={role} server={server} />
							))}
						</div>
					</div>
				)}
				{/* !---> MEMBERS <---! */}
				{!!members?.length && (
					<div className="mb-2">
						<ServerSection sectionType="members" role={role} label="Utilisateurs" server={server} />
						<div className="space-y-[2px]">
							{members.map((member) => (
								<ServerMember key={member.id} member={member} server={server} />
							))}
						</div>
					</div>
				)}
			</ScrollArea>
		</div>
	);
};
