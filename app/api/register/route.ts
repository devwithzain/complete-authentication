import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserByEmail } from "@/data/user";
import { registerFormSchema } from "@/schemas";

export async function POST(request: Request) {
   try {
      const body = await request.json();

      // Validate input data
      const validatedFields = registerFormSchema.safeParse(body);
      if (!validatedFields.success) {
         return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
      }

      const { email, password, firstName, lastName } = validatedFields.data;

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Check if the email is already in use
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
         return NextResponse.json({ error: "Email already exists!" }, { status: 400 });
      }

      // Create the user in the database
      const user = await prisma.user.create({
         data: {
            email,
            password: hashedPassword,
            firstName,
            lastName
         }
      });

      return NextResponse.json(user, { status: 201 });
   } catch (error) {
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
   }
}
