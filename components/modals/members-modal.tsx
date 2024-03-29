"use client";

import { useState } from "react";
import { BiSolidCrown, BiSolidShield, BiSolidUser } from "react-icons/bi";
import { useModal } from "@/hooks/useModalStore";
import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Logo from "@/components/Logo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/user-avatar";
import qs from "query-string";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuTrigger,
	DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, Loader2, MoreVertical, ShieldQuestion } from "lucide-react";
import { FaGavel } from "react-icons/fa";

const roleIconMap = {
	GUEST: null,
	MODERATOR: <BiSolidShield title="Modérateur" className="h-4 w-4 ml-2 text-secondary" />,
	ADMIN: <BiSolidCrown title="Administrateur" className="h-4 w-4 ml-2 text-secondary" />,
};

export const MembersModal = () => {
	const router = useRouter();
	const { onOpen, isOpen, onClose, type, data } = useModal();
	const [loadingId, setLoadingId] = useState("");

	const isModalOpen = isOpen && type === "members";
	const { server } = data as { server: ServerWithMembersWithProfiles };

	const onRoleChange = async (memberId: string, role: MemberRole) => {
		try {
			setLoadingId(memberId);
			const url = qs.stringifyUrl({
				url: `/api/members/${memberId}`,
				query: {
					serverId: server?.id,
				},
			});

			const response = await axios.patch(url, { role });
			router.refresh();
			onOpen("members", { server: response.data });
		} catch (error) {
			console.error(error);
		} finally {
			setLoadingId("");
		}
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white text-black overflow-hidden">
				<DialogHeader className="pt-8 flex flex-col items-center">
					<Logo width={300} height={60} variant="light" />
					<DialogTitle className="text-secondary text-center text-2xl font-semibold pt-3">Gestionnaire des Utilisateurs</DialogTitle>
					<DialogDescription className="text-center text-md font-medium text-zinc-500">{server?.members?.length} Utilisateurs</DialogDescription>
				</DialogHeader>
				<ScrollArea className="pb-6 mt-8 max-h-[420px] pr-6">
					{server?.members?.map((member) => (
						<div key={member.id} className="flex items-center gap-x-2 mb-6">
							<UserAvatar src={member.profile.imageUrl} />
							<div className="flex flex-col">
								<div className="text-md font-semibold flex items-center">
									{member.profile.name}
									{roleIconMap[member.role]}
								</div>
								<p className="text-xs text-zinc-500">{member.profile.email}</p>
							</div>
							{server.profileId !== member.profileId && loadingId !== member.id && (
								<div className="ml-auto">
									<DropdownMenu>
										<DropdownMenuTrigger>
											<MoreVertical className="h-5 w-5 text-zinc-500 hover:text-gray-900 transition duration-200 focus:outline-0" />
										</DropdownMenuTrigger>
										<DropdownMenuContent side="left">
											<DropdownMenuSub>
												<DropdownMenuSubTrigger className="flex items-center">
													<ShieldQuestion className="w-4 h-4 mr-2" />
													<span>Rôle</span>
												</DropdownMenuSubTrigger>
												<DropdownMenuPortal>
													<DropdownMenuSubContent>
														<DropdownMenuItem onClick={() => onRoleChange(member.id, "GUEST")}>
															<BiSolidUser className="h-4 w-4 mr-2 text-secondary" />
															Utilisateur
															{member.role === "GUEST" && <Check className="h-4 w-4 ml-3" />}
														</DropdownMenuItem>
														<DropdownMenuItem onClick={() => onRoleChange(member.id, "MODERATOR")}>
															<BiSolidShield className="h-4 w-4 mr-2 text-secondary" />
															Modérateur
															{member.role === "MODERATOR" && <Check className="h-4 w-4 ml-2" />}
														</DropdownMenuItem>
													</DropdownMenuSubContent>
												</DropdownMenuPortal>
											</DropdownMenuSub>
											<DropdownMenuSeparator />
											<DropdownMenuItem>
												<FaGavel className="h4 w-4 mr-2" />
												Expulser
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							)}
							{loadingId === member.id && <Loader2 className="animate-spin text-zinc-500 ml-autow-4 h-4" />}
						</div>
					))}
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};
