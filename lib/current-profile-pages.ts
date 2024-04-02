import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextApiRequest } from "next";

// Function to fetch the current user's profile
export const currentProfilePages = async (request: NextApiRequest) => {
	// Extract the userId from auth()
	const { userId } = getAuth(request);

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
