"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ActionTooltip from "./action-tooltip";

export function ModeToggle() {
	const { setTheme, theme } = useTheme();

	console.log(theme);

	return (
		<ActionTooltip side="right" align="center" label={theme === "light" ? "Passer au mode Sombre" : "Passer au mode Clair"}>
			{theme === "dark" ? (
				<Button onClick={() => setTheme("light")} variant="transparent" size="icon" className="text-stone-500 hover:text-stone-100 transition duration-300">
					<Moon className="h-[1.75rem] w-[1.75rem]" />
				</Button>
			) : (
				<Button onClick={() => setTheme("dark")} variant="transparent" size="icon">
					<Sun className="h-[1.75rem] w-[1.75rem]" />
				</Button>
			)}
		</ActionTooltip>
	);
}
