import { auth, signOut } from "@/auth";

export default async function Setting() {
	const session = await auth();

	if (!session?.user) {
		return (
			<div className="w-full h-screen flex items-center justify-center text-lg uppercase font-bold font-mono">
				Not Authenticated!
			</div>
		);
	}

	return (
		<div>
			<h1>Settings</h1>
			<p>Email: {session.user.email}</p>
			<p>Session: {JSON.stringify(session)}</p>
			<form
				action={async () => {
					"use server";
					await signOut();
				}}>
				<button type="submit">Sign Out</button>
			</form>
		</div>
	);
}
