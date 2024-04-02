"use client";

import { useSocket } from "@/components/providers/socket-provider";
import { Badge } from "@/components/ui/badge";

export const SocketIndicator = () => {
	const { isConnected } = useSocket();

	if (!isConnected) {
		return <Badge variant="outline" title="Connection en cours..." className="bg-yellow-600 text-white border-none p-1 md:p-1.5 animate-pulse"></Badge>;
	}

	return <Badge variant="outline" title="Connecté: réponses en temps-réel..." className="bg-emerald-500 text-white border-none p-1 md:p-1.5"></Badge>;
};
