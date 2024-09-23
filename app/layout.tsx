import "@/styles/globals.css";
import { auth } from "@/auth";
import type { Metadata } from "next";
import ToastProvider from "@/providers/toast-provider";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
	title: "Authentication ToolTip",
	description: "Authentication ToolTip by devwithzain",
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();
	return (
		<SessionProvider session={session}>
			<html lang="en">
				<body>
					<ToastProvider />
					{children}
				</body>
			</html>
		</SessionProvider>
	);
}
