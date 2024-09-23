"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
	const pathName = usePathname();
	return (
		<nav className="bg-white/90 flex justify-between items-center p-4 w-[600px] shadow-sm rounded-lg">
			<div className="flex items-center gap-x-2">
				<Link href="/server">
					<button className="px-4 shadow-lg py-2 rounded-lg bg-white text-black leading-tight tracking-tight">
						Server
					</button>
				</Link>
				<Link href="/client">
					<button className="px-4 shadow-lg py-2 rounded-lg bg-white text-black leading-tight tracking-tight">
						Client
					</button>
				</Link>
				<Link href="/admin">
					<button className="px-4 shadow-lg py-2 rounded-lg bg-white text-black leading-tight tracking-tight">
						Admin
					</button>
				</Link>
				<Link href="/">
					<button
						className={`px-4 shadow-lg py-2 rounded-lg ${
							pathName == "/setting"
								? "bg-black text-white"
								: "bg-white text-black"
						} leading-tight tracking-tight`}>
						Setings
					</button>
				</Link>
			</div>
			<div>
				<button className="px-4 py-2 rounded-lg bg-white text-black leading-tight tracking-tight">
					User Button
				</button>
			</div>
		</nav>
	);
}
