import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CustomWagmiProvider } from "@/config/lifi";
import { Geist, Geist_Mono } from "next/font/google";
import type React from "react";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem={false}
					disableTransitionOnChange
				>
					<CustomWagmiProvider>{children}</CustomWagmiProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
