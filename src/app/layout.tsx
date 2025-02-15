import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import AppKitProvider from "@/context/AppKitProvider";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import type React from "react";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const headersObj = await headers();
	const cookies = headersObj.get("cookie");

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
					<AppKitProvider cookies={cookies}>
						{/* <CustomWagmiProvider> */}
						{children}
						{/* </CustomWagmiProvider> */}
					</AppKitProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
