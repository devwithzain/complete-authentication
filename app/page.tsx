"use client";
import { useState } from "react";
import { LoginForm, RegisterForm } from "@/components";

export default function App() {
	const [toggle, setToggle] = useState(true);
	return (
		<div className="w-full h-screen flex justify-center items-center p-5">
			<RegisterForm
				toggle={toggle}
				setToggle={setToggle}
			/>
			<LoginForm
				toggle={toggle}
				setToggle={setToggle}
			/>
		</div>
	);
}
