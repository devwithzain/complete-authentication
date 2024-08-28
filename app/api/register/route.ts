import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
import { registerFormSchema } from "@/schemas";

export async function POST(request: Request) {
   try {
      const body = await request.json();

      // Validate input data
      const validatedFields = registerFormSchema.safeParse(body);
      if (!validatedFields.success) {
         return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
      }

      const { firstName, lastName, email, password } = validatedFields.data;

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create the user in the database
      const user = await prisma.user.create({
         data: {
            firstName,
            lastName,
            email,
            password: hashedPassword,
         }
      });

      return NextResponse.json(user, { status: 201 });
   } catch (error) {
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
   }
}
