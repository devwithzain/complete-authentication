"use client";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { fromImage } from "@/public";
import { login } from "@/action/user";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { TloginFormData } from "@/schemas";
import { Socials, loginFormSchema } from "@/export";
import { zodResolver } from "@hookform/resolvers/zod";

export default function LoginForm() {
	const router = useRouter();
	const {
		register,
		reset,
		handleSubmit,
		formState: { isSubmitting, errors },
	} = useForm<TloginFormData>({
		resolver: zodResolver(loginFormSchema),
	});

	const onSubmits = async (data: TloginFormData) => {
		const response = await login(data);
		if (response.error) {
			toast.error(response.error);
			reset();
		}
		if (response.success) {
			toast.success(response.success);
			router.push("/setting");
		}
	};

	return (
		<motion.div
			initial={{ y: "115%" }}
			animate={{ y: "0%" }}
			transition={{ duration: 1, ease: "easeInOut" }}
			className="w-[70%] bg-[#2A273A] py-5 rounded-lg">
			<div className="w-full flex justify-between items-center">
				<div className="w-1/2 pointer-events-none pl-5">
					<Image
						src={fromImage}
						alt="fromImage"
						className="w-full object-cover rounded-lg"
						width={800}
						height={400}
						priority
					/>
				</div>
				<div className="w-1/2 flex items-center justify-center">
					<div className="w-full px-10 flex justify-center flex-col gap-8">
						<div className="flex flex-col gap-4">
							<h1 className="text-[40px] text-white font-medium leading-tight tracking-tight">
								Welcome back
							</h1>
							<div className="flex items-center gap-2">
								<button className="text-sm text-[#ADABB8] font-normal leading-tight tracking-tight">
									Don&apos;t have an account?
								</button>
								<Link
									href="/sign-up"
									className="text-sm text-[#9887c9] font-normal leading-tight tracking-tight underline">
									Create
								</Link>
							</div>
						</div>
						<form
							onSubmit={handleSubmit(onSubmits)}
							className="flex flex-col gap-5">
							<div className="flex flex-col gap-5">
								<div className="flex flex-col gap-2">
									<input
										type="email"
										{...register("email")}
										placeholder="Email"
										className={`bg-[#3A364D] text-white placeholder:text-[#6D6980] rounded-lg p-4 ${
											errors.email && "border-red-500 border-[1px]"
										}`}
									/>
									{errors.email && (
										<span className="text-red-500 text-sm">
											{errors.email.message}
										</span>
									)}
								</div>
								<div className="flex flex-col gap-2">
									<input
										type="password"
										{...register("password")}
										placeholder="Enter your password"
										className={`bg-[#3A364D] text-white placeholder:text-[#6D6980] rounded-lg p-4 ${
											errors.password && "border-red-500 border-[1px]"
										}`}
									/>
									{errors.password && (
										<span className="text-red-500 text-sm">
											{errors.password.message}
										</span>
									)}
								</div>
							</div>
							<input
								type="submit"
								value={`${isSubmitting ? "Loading..." : "Log In"}`}
								className="w-full bg-[#6C54B6] rounded-lg p-4 text-[16px] text-white font-normal text-center leading-tight tracking-tight cursor-pointer"
								disabled={isSubmitting}
							/>
						</form>
						<Socials />
					</div>
				</div>
			</div>
		</motion.div>
	);
}
