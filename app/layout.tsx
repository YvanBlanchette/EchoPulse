import { ClerkProvider } from "@clerk/nextjs";

import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "EchoPulse",
	description: "Social platform to work and socialize with like minded people!",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html lang="fr-ca" suppressHydrationWarning>
				<body className={cn(font.className, "bg-white dark:bg-[#313338]")}>
					<ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="echopulse">
						{children}
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
