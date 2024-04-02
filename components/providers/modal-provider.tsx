"use client";

import { CreateServerModal } from "@/components/modals/create-server-modal";
import { useEffect, useState } from "react";
import { InviteModal } from "@/components/modals/invite-modal";
import { ServerSettingsModal } from "@/components/modals/server-settings-modal";
import { MembersModal } from "@/components/modals/members-modal";
import { CreateEchoChamberModal } from "@/components/modals/create-echo-chamber-modal";
import { LeaveServerModal } from "@/components/modals/leave-server-modal";
import { DeleteServerModal } from "@/components/modals/delete-server-modal";
import { DeleteEchoChamberModal } from "@/components/modals/delete-echo-chamber-modal copy";
import { EditEchoChamberModal } from "@/components/modals/edit-echo-chamber-modal";
import { MessageFileModal } from "@/components/modals/message-file-modal";
import { DeleteMessageModal } from "@/components/modals/delete-message-modal";

export const ModalProvider = () => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		<>
			<CreateServerModal />
			<InviteModal />
			<ServerSettingsModal />
			<MembersModal />
			<LeaveServerModal />
			<DeleteServerModal />
			<CreateEchoChamberModal />
			<DeleteEchoChamberModal />
			<EditEchoChamberModal />
			<MessageFileModal />
			<DeleteMessageModal />
		</>
	);
};
