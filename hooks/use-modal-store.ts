import { Chamber, ChamberType, Server } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
	| "createServer"
	| "invite"
	| "members"
	| "serverSettings"
	| "leaveServer"
	| "deleteServer"
	| "createEchoChamber"
	| "deleteEchoChamber"
	| "editEchoChamber"
	| "messageFile"
	| "deleteMessage";

interface ModalData {
	server?: Server;
	chamberType?: ChamberType;
	chamber?: Chamber;
	apiUrl?: string;
	query?: Record<string, any>;
}

interface ModalStore {
	type: ModalType | null;
	data: ModalData;
	isOpen: boolean;
	onOpen: (type: ModalType, data?: ModalData) => void;
	onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
	type: null,
	data: {},
	isOpen: false,
	onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
	onClose: () => set({ type: null, isOpen: false }),
}));
