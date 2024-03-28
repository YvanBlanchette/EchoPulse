import { currentUser, redirectToSignIn } from "@clerk/nextjs";

import { db } from "@/lib/db";

export const initialProfile = async () => {
	// Fetch the user.
	const user = await currentUser();

	//If the user is not Signed in...
	if (!user) {
		// redirect to the SignIn page
		return redirectToSignIn();
	}

	// Fetch the user's profile from the db
	const profile = await db.profile.findUnique({
		where: {
			userId: user.id,
		},
	});

	// If a profile is found...
	if (profile) {
		//return that profile.
		return profile;
	}

	// Otherwise create a new profile
	const newProfile = await db.profile.create({
		data: {
			userId: user.id,
			name: `${user.firstName} ${user.lastName}`,
			imageUrl: user.imageUrl,
			email: user.emailAddresses[0].emailAddress,
		},
	});
};
