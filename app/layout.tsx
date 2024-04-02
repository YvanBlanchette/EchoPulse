import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ModalProvider } from "@/components/providers/modal-provider";
import { SocketProvider } from "@/components/providers/socket-provider";
import { QueryProvider } from "@/components/providers/query-provider";

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
					<SocketProvider>
						<ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="echopulse">
							<ModalProvider />
							<QueryProvider>{children}</QueryProvider>
						</ThemeProvider>
					</SocketProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
