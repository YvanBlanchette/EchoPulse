"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

interface ServerSearchProps {
	data: {
		label: string;
		type: "chamber" | "member";
		data:
			| {
					icon: React.ReactNode;
					name: string;
					id: string;
			  }[]
			| undefined;
	}[];
}

export const ServerSearch = ({ data }: ServerSearchProps) => {
	const [open, setOpen] = useState(false);
	const router = useRouter();
	const params = useParams();

	// Event listener for ctrl + K
	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	// Function for click events
	const onClick = ({ id, type }: { id: string; type: "chamber" | "member" }) => {
		setOpen(false);

		// If the user clicks a member's name...
		if (type === "member") {
			// redirect to the conversation
			return router.push(`/servers/${params?.serverId}/conversations/${id}`);
		}

		// If the user clicks on a chamber's name...
		if (type === "chamber") {
			// redirect to the chamber
			return router.push(`/servers/${params?.serverId}/chambers/${id}`);
		}
	};

	return (
		<>
			<button
				onClick={() => setOpen(true)}
				className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
			>
				<Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
				<p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">Recherche</p>
				<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
					<span className="text-xs">Ctrl</span>+ K
				</kbd>
			</button>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Recherche parmis les Membres et EchoChambres" />
				<CommandList>
					<CommandEmpty>Aucuns résultats trouvés...</CommandEmpty>
					{data.map(({ label, type, data }) => {
						if (!data?.length) return null;

						return (
							<CommandGroup key={label} heading={label}>
								{data?.map(({ id, icon, name }) => {
									return (
										<CommandItem key={id} onSelect={() => onClick({ id, type })}>
											{icon}
											<span>{name}</span>
										</CommandItem>
									);
								})}
							</CommandGroup>
						);
					})}
				</CommandList>
			</CommandDialog>
		</>
	);
};
