import { Text } from "lucide-react";
import { capitalize } from "@/lib/utils";

interface ChatWelcomeProps {
	name: string;
	type: "chamber" | "conversation";
}

export const ChatWelcome = ({ name, type }: ChatWelcomeProps) => {
	return (
		<div className="px-4 mb-4 flex gap-3 items-center">
			<div>
				<Text className="h-14 w-14 text-black dark:text-white" />
			</div>
			<div className="flex flex-col">
				<p className="text-xl md:text-3xl font-bold">
					{type === "chamber" ? "Bienvenue dans #" : ""}
					{capitalize(name)}
				</p>
				<p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">
					{type === "chamber"
						? `Ceci est le début de la discussion dans l'EchoChambre #${capitalize(name)}.`
						: `Ceci est le début de votre conversation avec ${capitalize(name)}`}
				</p>
			</div>
		</div>
	);
};
