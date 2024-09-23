import Navbar from "./_components/navbar";

export default function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="w-full h-screen flex flex-col gap-5 items-center justify-center bg-[#2A273A]">
			<Navbar />
			{children}
		</div>
	);
}
