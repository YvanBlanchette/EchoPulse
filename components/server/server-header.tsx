"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, DoorOpen, LogOut, Settings, Trash2, UserRoundPlus, UsersRound } from "lucide-react";
import { useModal } from "@/hooks/useModalStore";

interface ServerHeaderProps {
	server: ServerWithMembersWithProfiles;
	role?: MemberRole;
}

export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
	const { onOpen } = useModal();

	const isAdmin = role === MemberRole.ADMIN;
	const isModerator = isAdmin || role === MemberRole.MODERATOR;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="focus:outline-none" asChild>
				<button className="w-full text-neutral-500 dark:text-neutral-300 text-md font-semibold px-3 flex items-center h-12 border-b-2 border-neutral-200 dark:border-neutral-800 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
					{server.name}
					<ChevronDown className="h-5 w-5 ml-auto" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
				{isAdmin && (
					<DropdownMenuItem onClick={() => onOpen("serverSettings", { server: server })} className="font-semibold px-3 py-2 text-sm cursor-pointer">
						Configurations Serveur
						<Settings className="ml-auto h-4 w-4" />
					</DropdownMenuItem>
				)}
				{isAdmin && (
					<DropdownMenuItem onClick={() => onOpen("members", { server: server })} className="font-semibold px-3 py-2 text-sm cursor-pointer hover:opacity-80">
						Gérer les utilisateurs
						<UsersRound className="ml-auto h-4 w-4" />
					</DropdownMenuItem>
				)}
				{isAdmin && (
					<DropdownMenuItem className="text-red-700 dark:text-red-600 font-semibold px-3 py-2 text-sm cursor-pointer hover:opacity-80">
						Supprimer le Serveur
						<Trash2 className="ml-auto h-4 w-4" />
					</DropdownMenuItem>
				)}
				{isAdmin && <DropdownMenuSeparator />}
				{isModerator && (
					<DropdownMenuItem
						onClick={() => onOpen("invite", { server: server })}
						className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer hover:opacity-80"
					>
						Inviter des utilisateurs
						<UserRoundPlus className="ml-auto h-4 w-4" />
					</DropdownMenuItem>
				)}
				{isModerator && (
					<DropdownMenuItem className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer hover:opacity-80">
						Ouvrir une EchoChamber
						<DoorOpen className="ml-auto h-4 w-4" />
					</DropdownMenuItem>
				)}
				{isModerator && <DropdownMenuSeparator />}
				{!isAdmin && (
					<DropdownMenuItem className="text-red-700 dark:text-red-500 px-3 py-2 text-sm cursor-pointer hover:opacity-80">
						Quitter le serveur
						<LogOut className="ml-auto h-4 w-4" />
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
