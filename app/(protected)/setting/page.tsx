"use client";

import toast from "react-hot-toast";
import { UserRole } from "@prisma/client";
import { useForm } from "react-hook-form";
import { settings } from "@/action/setting";
import { zodResolver } from "@hookform/resolvers/zod";
import { settingSchema, TsettingData } from "@/schemas";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function Setting() {
	const user = useCurrentUser();
	const {
		register,
		handleSubmit,
		formState: { isSubmitting, errors },
	} = useForm<TsettingData>({
		resolver: zodResolver(settingSchema),
		defaultValues: {
			name: user?.name || undefined,
			email: user?.email || undefined,
			password: undefined,
			newPassword: undefined,
			role: user?.role || undefined,
			isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
		},
	});

	const onSubmits = async (data: TsettingData) => {
		const response = await settings(data);
		if (response?.error) {
			toast.error(response.error);
		}
		if (response?.success) {
			toast.success(response.success);
		}
	};
	return (
		<div className="w-[600px] bg-[#2A273A] rounded-lg shadow-md p-8 flex flex-col gap-5">
			<div className="w-full flex items-center justify-center">
				<p className="text-white text-2xl font-semibold text-center leading-tight tracking-tight">
					⚙️ Settings
				</p>
			</div>
			<form
				onSubmit={handleSubmit(onSubmits)}
				className="flex flex-col gap-5">
				<div className="flex flex-col gap-5">
					<div className="flex flex-col gap-2">
						<input
							type="text"
							{...register("name")}
							placeholder="Name"
							className={`bg-[#3A364D] text-white placeholder:text-[#6D6980] rounded-lg px-4 py-2 ${
								errors.name && "border-red-500 border-[1px]"
							}`}
						/>
						{errors.name && (
							<span className="text-red-500 text-sm">
								{errors.name.message}
							</span>
						)}
					</div>
					{user?.isOAuth === false && (
						<>
							<div className="flex flex-col gap-2">
								<input
									type="email"
									{...register("email")}
									placeholder="Email"
									className={`bg-[#3A364D] text-white placeholder:text-[#6D6980] rounded-lg px-4 py-2 ${
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
									{...register("password")}
									placeholder="Password"
									className={`bg-[#3A364D] text-white placeholder:text-[#6D6980] rounded-lg px-4 py-2 ${
										errors.password && "border-red-500 border-[1px]"
									}`}
								/>
								{errors.password && (
									<span className="text-red-500 text-sm">
										{errors.password.message}
									</span>
								)}
							</div>
							<div className="flex flex-col gap-2">
								<input
									{...register("newPassword")}
									placeholder="New Password"
									className={`bg-[#3A364D] text-white placeholder:text-[#6D6980] rounded-lg px-4 py-2 ${
										errors.newPassword && "border-red-500 border-[1px]"
									}`}
								/>
								{errors.newPassword && (
									<span className="text-red-500 text-sm">
										{errors.newPassword.message}
									</span>
								)}
							</div>
						</>
					)}
					<div className="flex flex-col gap-2">
						<select
							{...register("role")}
							className="bg-[#3A364D] text-white placeholder:text-[#6D6980] rounded-lg px-4 py-2"
							defaultValue={user?.role}>
							<option value={UserRole.ADMIN}>Admin</option>
							<option value={UserRole.USER}>User</option>
						</select>
					</div>
					{user?.isOAuth === false && (
						<div className="bg-[#3A364D] flex flex-row items-center justify-between px-4 py-2 shadow-md gap-2 rounded-lg">
							<div className="flex flex-col gap-1">
								<h1 className="text-white font-medium leading-tight tracking-tight text-sm">
									Two Factor Authentication
								</h1>
								<p className="text-white/80 font-medium leading-tight tracking-tight text-[12px]">
									Enable two factor authentication for your account.
								</p>
							</div>
							<div>
								<input
									type="checkbox"
									{...register("isTwoFactorEnabled")}
									className={`bg-[#3A364D] text-white placeholder:text-[#6D6980] rounded-lg px-4 py-2 ${
										errors.isTwoFactorEnabled && "border-red-500 border-[1px]"
									}`}
									defaultChecked={user?.isTwoFactorEnabled}
								/>
								{errors.isTwoFactorEnabled && (
									<span className="text-red-500 text-sm">
										{errors.isTwoFactorEnabled.message}
									</span>
								)}
							</div>
						</div>
					)}
				</div>
				<input
					type="submit"
					value={`${isSubmitting ? "Loading..." : "Save"}`}
					className={`w-fit px-4 shadow-lg py-2 rounded-lg bg-[#3A364D] text-white leading-tight tracking-tight cursor-pointer ${
						isSubmitting && "opacity-50 cursor-not-allowed"
					}`}
					disabled={isSubmitting}
				/>
			</form>
		</div>
	);
}
