"use client";
import { logout } from "@/action/logout";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
	const pathName = usePathname();
	return (
		<nav className="bg-[#2A273A] flex justify-between items-center p-4 w-[600px] shadow-sm rounded-lg">
			<div className="flex items-center gap-x-2">
				<Link href="/server">
					<button
						className={`px-4 shadow-lg py-2 rounded-lg ${
							pathName == "/server"
								? "bg-[#3A364D] text-white"
								: "bg-white text-black"
						} leading-tight tracking-tight`}>
						Server
					</button>
				</Link>
				<Link href="/client">
					<button
						className={`px-4 shadow-lg py-2 rounded-lg ${
							pathName == "/client"
								? "bg-[#3A364D] text-white"
								: "bg-white text-black"
						} leading-tight tracking-tight`}>
						Client
					</button>
				</Link>
				<Link href="/admin">
					<button
						className={`px-4 shadow-lg py-2 rounded-lg ${
							pathName == "/admin"
								? "bg-[#3A364D] text-white"
								: "bg-white text-black"
						} leading-tight tracking-tight`}>
						Admin
					</button>
				</Link>
				<Link href="/setting">
					<button
						className={`px-4 shadow-lg py-2 rounded-lg ${
							pathName == "/setting"
								? "bg-[#3A364D] text-white"
								: "bg-white text-black"
						} leading-tight tracking-tight`}>
						Setings
					</button>
				</Link>
			</div>
			<div>
				<button
					onClick={() => logout()}
					className="px-4 py-2 rounded-lg bg-white text-black leading-tight tracking-tight">
					Log Out
				</button>
			</div>
		</nav>
	);
}
