"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ActionTooltip from "@/components/action-tooltip";

export const NavigationAction = () => {
	return (
		<div>
			<ActionTooltip side="right" align="center" label="Ajouter un serveur">
				<button className="group flex items-center">
					<div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-[#23A559]">
						<Plus className="group-hover:text-white transition text-[#23A559]" size={30} />
					</div>
				</button>
			</ActionTooltip>
		</div>
	);
};
