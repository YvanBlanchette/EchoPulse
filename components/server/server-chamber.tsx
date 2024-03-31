"use client";

import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Chamber, ChamberType, MemberRole, Server } from "@prisma/client";
import { Lock, Mic, Settings, Text, Trash2, Video } from "lucide-react";
import { ActionTooltip } from "@/components/action-tooltip";
import { useModal } from "@/hooks/useModalStore";

interface ServerChamberProps {
	chamber: Chamber;
	server: Server;
	role?: MemberRole;
}

const iconMap = {
	[ChamberType.TEXT]: Text,
	[ChamberType.AUDIO]: Mic,
	[ChamberType.VIDEO]: Video,
};

export const ServerChamber = ({ chamber, server, role }: ServerChamberProps) => {
	const { onOpen } = useModal();
	const params = useParams();
	const router = useRouter();

	const Icon = iconMap[chamber.type];

	return (
		<button
			onClick={() => {}}
			className={cn(
				"group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
				params?.chamberId === chamber.id && "bg-zinc-700/20 dark:bg-zinc-700"
			)}
		>
			<Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
			<p
				className={cn(
					"line-clamp-1 font-semibold text-sm capitalize text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
					params?.chamberId === chamber.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
				)}
			>
				{chamber.name}
			</p>
			{chamber.name !== "général" && role !== MemberRole.GUEST && (
				<div className="ml-auto flex items-center gap-x-2">
					<ActionTooltip label="Modifier" side="top">
						<Settings
							onClick={() => onOpen("editEchoChamber", { server, chamber })}
							className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
						/>
					</ActionTooltip>
					<ActionTooltip label="Supprimer" side="top">
						<Trash2
							onClick={() => onOpen("deleteEchoChamber", { server, chamber })}
							className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
						/>
					</ActionTooltip>
				</div>
			)}
			{chamber.name === "général" && <Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400" />}
		</button>
	);
};
