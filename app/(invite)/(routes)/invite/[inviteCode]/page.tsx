import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface InviteCodePageProps {
	params: {
		inviteCode: string;
	};
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
	const profile = await currentProfile();

	if (!profile) {
		return redirectToSignIn();
	}

	if (!params.inviteCode) {
		return redirect("/");
	}

	// Function to verify if the user is already a member of the invited server.
	const existingServer = await db.server.findFirst({
		where: {
			inviteCode: params.inviteCode,
			members: {
				some: {
					profileId: profile.id,
				},
			},
		},
	});

	// If the user is already a member...
	if (existingServer) {
		// redirect the user to that existing server.
		return redirect(`/server/${existingServer.id}`);
	}

	const server = await db.server.update({
		where: {
			inviteCode: params.inviteCode,
		},
		data: {
			members: {
				create: [{ profileId: profile.id }],
			},
		},
	});

	return (
		<div>
			<h1>hello invite</h1>
		</div>
	);
};

export default InviteCodePage;
