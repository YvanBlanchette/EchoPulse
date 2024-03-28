import { InitialModal } from "@/components/modals/initial-modal";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

const SetupPage = async () => {
	// Fetch the user's profile
	const profile = await initialProfile();

	// fetch the servers from the user's profile
	const server = await db.server.findFirst({
		where: {
			members: {
				some: {
					profileId: profile.id,
				},
			},
		},
	});

	// If the profile is a member of a server...
	if (server) {
		//redirect to that server.
		return redirect(`/servers/${server.id}`);
	}

	// Otherwise, create a new server
	return <InitialModal />;
};

export default SetupPage;
