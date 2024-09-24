"use client";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { fromImage } from "@/public";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { newPassword } from "@/action/new-password";
import { zodResolver } from "@hookform/resolvers/zod";
import { newPasswordFormSchema, TnewPasswordFormData } from "@/schemas";

export default function NewPasswordForm() {
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { isSubmitting, errors },
	} = useForm<TnewPasswordFormData>({
		resolver: zodResolver(newPasswordFormSchema),
	});

	const onSubmits = async (data: TnewPasswordFormData) => {
		const response = await newPassword(data, token);
		if (response?.error) {
			toast.error(response.error);
		}
		if (response?.success) {
			toast.success(response.success);
			router.push("/sign-in");
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
					<div className="w-full px-10 flex justify-center flex-col gap-5">
						<div className="flex flex-col gap-4">
							<h1 className="text-[30px] text-white font-medium leading-tight tracking-tight">
								Enter new password
							</h1>
						</div>
						<form
							onSubmit={handleSubmit(onSubmits)}
							className="flex flex-col gap-5">
							<div className="flex flex-col gap-5">
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
								value={`${isSubmitting ? "Loading..." : "Reset password"}`}
								className="w-full bg-[#6C54B6] rounded-lg p-4 text-[16px] text-white font-normal text-center leading-tight tracking-tight cursor-pointer"
								disabled={isSubmitting}
							/>
						</form>
						<div>
							<Link
								href="/sign-in"
								className="text-sm text-[#ADABB8] font-normal leading-tight tracking-tight hover:underline">
								Back to LogIn
							</Link>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
