import { Menu, Mic, Text, Video } from "lucide-react";
import { MobileToggle } from "@/components/mobile-toggle";
import { UserAvatar } from "@/components/user-avatar";
import { SocketIndicator } from "@/components/socket-indicator";
import { ChatVideoButton } from "@/components/chat/chat-video-button";

interface ChatHeaderProps {
	serverId: string;
	name: string;
	type: "chamber" | "conversation";
	imageUrl?: string;
}

export const ChatHeader = ({ serverId, name, type, imageUrl }: ChatHeaderProps) => {
	return (
		<div className="text-md font-semibold px-4 flex items-center h-16 border-b-2 border-neutral-200 dark:border-neutral-800">
			{type === "chamber" && (
				<div>
					<Text className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
				</div>
			)}
			{type === "conversation" && <UserAvatar src={imageUrl} className="" />}
			<p className="capitalize font-semibold text-lg text-black dark:text-white ml-2">{name}</p>
			<div className="ml-auto flex items-center">
				{type === "conversation" && <ChatVideoButton />}
				<SocketIndicator />
				<MobileToggle serverId={serverId} />
			</div>
		</div>
	);
};
