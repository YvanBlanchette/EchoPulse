import { ChatHeader } from "@/components/chat/chat-header";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ChamberIdPageProps {
	params: {
		serverId: string;
		chamberId: string;
	};
}

const ChamberIdPage = async ({ params }: ChamberIdPageProps) => {
	const profile = await currentProfile();

	// If there is no profile, refuse access
	if (!profile) {
		return redirectToSignIn();
	}

	const chamber = await db.chamber.findUnique({
		where: {
			id: params.chamberId,
		},
	});

	const member = await db.member.findFirst({
		where: {
			serverId: params.serverId,
			profileId: profile.id,
		},
	});

	if (!chamber || !member) {
		redirect("/");
	}

	return (
		<div className="bg-white dark:bg-[#313338] flex flex-col h-full">
			<ChatHeader name={chamber.name} serverId={chamber.serverId} type="chamber" />
		</div>
	);
};

export default ChamberIdPage;
