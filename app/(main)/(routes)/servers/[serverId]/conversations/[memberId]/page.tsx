import { ChatHeader } from "@/components/chat/chat-header";
import { getOrCreateConversation } from "@/lib/conversations";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
	params: {
		serverId: string;
		memberId: string;
	};
}

const MemberIdPage = async ({ params }: MemberIdPageProps) => {
	const profile = await currentProfile();

	// If there is no profile, refuse access
	if (!profile) {
		return redirectToSignIn();
	}

	const currentMember = await db.member.findFirst({
		where: {
			serverId: params.serverId,
			profileId: profile.id,
		},
		include: {
			profile: true,
		},
	});

	if (!currentMember) {
		return redirect("/");
	}

	const conversation = await getOrCreateConversation(currentMember.id, params.memberId);

	// If there is no conversation, redirect the user to the server page
	if (!conversation) {
		return redirect(`/servers/${params.serverId}`);
	}

	// Extracting the members'profile from the confersation
	const { memberOne, memberTwo } = conversation;

	// Assigning otherMember to the user that is not the current member
	const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

	return (
		<div className="bg-white dark:bg-[#313338] flex flex-col h-full">
			<ChatHeader imageUrl={otherMember.profile.imageUrl} name={otherMember.profile.name} serverId={params.serverId} type="conversation" />
		</div>
	);
};
export default MemberIdPage;
