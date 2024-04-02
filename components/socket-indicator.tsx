"use client";

import { useSocket } from "@/components/providers/socket-provider";
import { Badge } from "@/components/ui/badge";

export const SocketIndicator = () => {
	const { isConnected } = useSocket();

	if (!isConnected) {
		return <Badge variant="outline" title="Connection en cours..." className="bg-yellow-600 text-white border-none p-1 mr-2 animate-ping"></Badge>;
	}

	return <Badge variant="outline" title="Connecté: réponses en temps-réel..." className="bg-emerald-500 border-none p-1 mr-2 animate-pulse"></Badge>;
};
