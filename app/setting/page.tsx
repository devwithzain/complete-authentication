"use client";
import { signOut } from "next-auth/react";

export default function Setting() {
	return (
		<div>
			Settings
			<button onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</button>
		</div>
	);
}
