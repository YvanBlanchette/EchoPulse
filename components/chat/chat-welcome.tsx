import { Text } from "lucide-react";
import { capitalize } from "@/lib/utils";

interface ChatWelcomeProps {
	name: string;
	type: "chamber" | "conversation";
}

export const ChatWelcome = ({ name, type }: ChatWelcomeProps) => {
	return (
		<div className="space-y-2 px-4 mb-4">
			{type === "chamber" && (
				<div className="h-[65px] w-[65px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center" title={`EchoChambre Texte`}>
					<Text className="h-8 w-8 text-white" />
				</div>
			)}
			<p className="text-xl md:text-3xl font-bold">
				{type === "chamber" ? "Bienvenue dans #" : ""}
				{capitalize(name)}
			</p>
			<p className="text-zinc-600 dark:text-zinc-400 text-sm">
				{type === "chamber"
					? `Ceci est le début de la discussion dans l'EchoChambre #${capitalize(name)}.`
					: `Ceci est le début de votre conversation avec ${capitalize(name)}`}
			</p>
		</div>
	);
};
