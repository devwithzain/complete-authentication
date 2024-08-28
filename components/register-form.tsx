"use client";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { fromImage } from "@/public";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerFormSchema, TregisterFormData } from "@/schemas";

export default function RegisterForm() {
	const {
		register,
		reset,
		handleSubmit,
		formState: { isSubmitting, errors },
	} = useForm<TregisterFormData>({
		resolver: zodResolver(registerFormSchema),
	});

	const onSubmits = async (data: TregisterFormData) => {
		try {
			await axios.post("/api/register", data);
		} catch (error: any) {
			toast.error("Error", error);
		} finally {
			toast.success("Account Created!");
			reset();
		}
	};
	return (
		<div className="w-[70%] bg-[#2A273A] p-5 rounded-lg">
			<div className="w-full flex justify-between items-center gap-2">
				<div className="w-1/2 pointer-events-none">
					<Image
						src={fromImage}
						alt="fromImage"
						className="w-full object-cover rounded-lg"
						width={650}
						height={500}
						priority
					/>
				</div>
				<div className="w-1/2 flex items-center justify-center">
					<div className="w-full px-10 flex justify-center flex-col gap-8">
						<div className="flex flex-col gap-4">
							<h1 className="text-[40px] text-white font-medium leading-tight tracking-tight">
								Create an account
							</h1>
							<div className="flex items-center gap-2">
								<button className="text-[16px] text-[#ADABB8] font-normal leading-tight tracking-tight">
									Already have an account?
								</button>
								<Link
									className="text-[16px] text-[#6C54B6] font-normal leading-tight tracking-tight underline"
									href="/login">
									LogIn
								</Link>
							</div>
						</div>
						<form
							onSubmit={handleSubmit(onSubmits)}
							className="flex flex-col gap-5">
							<div className="flex items-center justify-between gap-5">
								<div className="w-full flex flex-col gap-2">
									<input
										{...register("firstName")}
										type="text"
										placeholder="First Name"
										className={`bg-[#3A364D] text-white placeholder:text-[#6D6980] rounded-lg p-4 ${
											errors.firstName && "border-red-500 border-[1px]"
										}`}
									/>
									{errors.firstName && (
										<span className="text-red-500">
											{errors.firstName.message}
										</span>
									)}
								</div>
								<div className="w-full flex flex-col gap-2">
									<input
										type="text"
										{...register("lastName")}
										placeholder="Last Name"
										className={`bg-[#3A364D] text-white placeholder:text-[#6D6980] rounded-lg p-4 ${
											errors.lastName && "border-red-500 border-[1px]"
										}`}
									/>
									{errors.lastName && (
										<span className="text-red-500">
											{errors.lastName.message}
										</span>
									)}
								</div>
							</div>
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
							<div className="flex items-center gap-2">
								<input
									type="checkbox"
									className="w-5 h-5 outline-none border-none"
								/>
								<p className="text-[16px] text-[#ADABB8] font-normal leading-tight tracking-tight">
									I agrree to the
								</p>
								<Link
									className="text-[16px] text-[#6C54B6] font-normal leading-tight tracking-tight underline"
									href="/terms-and-conditions">
									Terms & Conditions
								</Link>
							</div>
							<input
								type="submit"
								value={`${isSubmitting ? "Loading..." : "Create account"}`}
								className="w-full bg-[#6C54B6] rounded-lg p-4 text-[16px] text-white font-normal text-center leading-tight tracking-tight cursor-pointer"
								disabled={isSubmitting}
							/>
						</form>
						<div className="flex flex-col gap-5">
							<div className="flex items-center gap-4">
								<span className="w-full h-[2px] bg-[#6D6980]/30 rounded-lg" />
								<div className="min-w-fit">
									<p className="text-[#6D6980] text-sm">Or register with</p>
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
		</div>
	);
}
