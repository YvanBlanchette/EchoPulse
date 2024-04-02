"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
	const { setTheme } = useTheme();
	const [mode, setMode] = useState("dark");

	return (
		<>
			{mode === "dark" ? (
				<Button
					onClick={() => {
						setTheme("light");
						setMode("light");
					}}
					variant="transparent"
					size="icon"
					className="text-stone-500 hover:text-stone-100 transition duration-300"
				>
					<Moon className="h-[1.75rem] w-[1.75rem]" />
				</Button>
			) : (
				<Button
					onClick={() => {
						setTheme("dark");
						setMode("dark");
					}}
					variant="transparent"
					size="icon"
					className="text-zinc-500 hover:text-secondary"
				>
					<Sun className="h-[1.75rem] w-[1.75rem]" />
				</Button>
			)}
		</>
	);
}
