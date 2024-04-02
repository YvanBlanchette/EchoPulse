import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { ChamberType } from "@prisma/client";
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
			{chamber.type === ChamberType.TEXT && (
				<>
					<ChatMessages
						member={member}
						name={chamber.name}
						chatId={chamber.id}
						type="chamber"
						apiUrl="/api/messages"
						socketUrl="/api/socket/messages"
						socketQuery={{ chamberId: chamber.id, serverId: chamber.serverId }}
						paramKey="chamberId"
						paramValue={chamber.id}
					/>
					<ChatInput name={chamber.name} type="chamber" apiUrl="/api/socket/messages" query={{ chamberId: chamber.id, serverId: chamber.serverId }} />
				</>
			)}
			{chamber.type === ChamberType.AUDIO && <MediaRoom chatId={chamber.id} video={false} audio={true} />}
			{chamber.type === ChamberType.VIDEO && <MediaRoom chatId={chamber.id} video={true} audio={true} />}
		</div>
	);
};

export default ChamberIdPage;
