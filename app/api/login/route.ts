import bcrypt from 'bcryptjs';
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { loginFormSchema } from "@/schemas";

export async function POST(request: Request) {
   try {
      const body = await request.json();

      // Validate input data
      const validatedFields = loginFormSchema.safeParse(body);
      if (!validatedFields.success) {
         return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
      }

      const { email, password } = validatedFields.data;

      // Check if the user exists by email
      const user = await prisma.user.findUnique({
         where: { email },
      });

      if (!user || !user.password) {
         return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Verify the password
      const passwordsMatch = await bcrypt.compare(password, user.password);

      if (!passwordsMatch) {
         return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
      }

      // Return the user data if the password matches
      return NextResponse.json(user, { status: 200 });

   } catch (error) {
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
   }
}
