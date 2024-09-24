"use client";
import Link from "next/link";
import { logout } from "@/action/logout";
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
								? "bg-[#6C54B6] text-white"
								: "bg-[#9887c9] text-white"
						} leading-tight tracking-tight`}>
						Server
					</button>
				</Link>
				<Link href="/client">
					<button
						className={`px-4 shadow-lg py-2 rounded-lg ${
							pathName == "/client"
								? "bg-[#6C54B6] text-white"
								: "bg-[#9887c9] text-white"
						} leading-tight tracking-tight`}>
						Client
					</button>
				</Link>
				<Link href="/admin">
					<button
						className={`px-4 shadow-lg py-2 rounded-lg ${
							pathName == "/admin"
								? "bg-[#6C54B6] text-white"
								: "bg-[#9887c9] text-white"
						} leading-tight tracking-tight`}>
						Admin
					</button>
				</Link>
				<Link href="/setting">
					<button
						className={`px-4 shadow-lg py-2 rounded-lg ${
							pathName == "/setting"
								? "bg-[#6C54B6] text-white"
								: "bg-[#9887c9] text-white"
						} leading-tight tracking-tight`}>
						Setings
					</button>
				</Link>
			</div>
			<div>
				<button
					onClick={() => logout()}
					className="px-4 py-2 rounded-lg bg-[#9887c9] text-white leading-tight tracking-tight">
					Log Out
				</button>
			</div>
		</nav>
	);
}
