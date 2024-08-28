"use client";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { fromImage } from "@/public";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema, TloginFormData } from "@/schemas";

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
		try {
			// await axios.post("/api/register", data);
			console.log("datata", data);
		} catch (error: any) {
			toast.error("Error", error);
		} finally {
			reset();
			toast.success("LogIn");
			router.push("/");
			router.refresh();
		}
	};
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.5, y: 300 }}
			whileInView={{ opacity: 1, scale: 1, y: 0 }}
			transition={{ duration: 0.5, ease: "easeInOut" }}
			viewport={{ once: true }}
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
								<button className="text-[16px] text-[#ADABB8] font-normal leading-tight tracking-tight">
									Don&apos;t have an account?
								</button>
								<Link
									className="text-[16px] text-[#6C54B6] font-normal leading-tight tracking-tight underline"
									href="/">
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
										<span className="text-red-500">{errors.email.message}</span>
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
										<span className="text-red-500">
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
						<div className="flex flex-col gap-5">
							<div className="flex items-center gap-4">
								<span className="w-full h-[2px] bg-[#6D6980]/30 rounded-lg" />
								<div className="min-w-fit">
									<p className="text-[#6D6980] text-sm">Or login with</p>
								</div>
								<span className="w-full h-[2px] bg-[#6D6980]/30 rounded-lg" />
							</div>
							<div className="flex items-center justify-between gap-5">
								<button className="w-full flex items-center gap-2 justify-center bg-[#3A364D] text-white text-lg tracking-tight leading-tight rounded-lg p-4">
									<FcGoogle size={22} />
									Google
								</button>
								<button className="w-full flex items-center gap-2 justify-center bg-[#3A364D] text-white text-lg tracking-tight leading-tight rounded-lg p-4">
									<FaGithub size={22} />
									Github
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
