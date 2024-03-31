import { Menu, Mic, Text, Video } from "lucide-react";
import { MobileToggle } from "@/components/mobile-toggle";

interface ChatHeaderProps {
	serverId: string;
	name: string;
	type: "chamber" | "conversation";
	imageUrl?: string;
}

export const ChatHeader = ({ serverId, name, type, imageUrl }: ChatHeaderProps) => {
	return (
		<div className="text-md font-semibold px-4 flex items-center h-12 border-b-2 border-neutral-200 dark:border-neutral-800">
			{type === "chamber" && (
				<div>
					<Text className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
				</div>
			)}
			<p className="capitalize font-semibold text-md text-black dark:text-white">{name}</p>
			<MobileToggle serverId={serverId} />
		</div>
	);
};
