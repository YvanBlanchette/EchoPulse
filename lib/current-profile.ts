import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

// Function to fetch the current user's profile
export const currentProfile = async () => {
	// Extract the userId from auth()
	const { userId } = auth();

	// If there is no userId, return null
	if (!userId) {
		return null;
	}

	// Otherwise, use the userId to fetch the profile from the database...
	const profile = await db.profile.findUnique({
		where: {
			userId,
		},
	});

	// and return the profile.
	return profile;
};
