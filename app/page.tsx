import Link from "next/link";

export default function App() {
	return (
		<div className="w-full h-screen flex justify-center items-center p-5">
			<div className="flex items-center gap-2">
				<Link
					href="/sign-in"
					className="text-lg text-white bg-black px-5 py-3 rounded-lg leading-tight tracking-tight">
					SignIn
				</Link>
				<Link
					href="/sign-up"
					className="text-lg text-white bg-black px-5 py-3 rounded-lg leading-tight tracking-tight">
					SignUp
				</Link>
			</div>
		</div>
	);
}
