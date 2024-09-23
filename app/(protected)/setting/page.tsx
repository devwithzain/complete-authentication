"use client";
import { logout } from "@/action/logout";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function Setting() {
	const user = useCurrentUser();

	if (!user) {
		return (
			<div className="w-full h-screen flex items-center justify-center text-lg uppercase font-bold font-mono">
				Not Authenticated!
			</div>
		);
	}

	return (
		<div>
			<button
				className="px-4 shadow-lg py-2 rounded-lg bg-white text-black leading-tight tracking-tight"
				type="submit"
				onClick={() => logout()}>
				Sign Out
			</button>
		</div>
	);
}
