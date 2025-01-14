import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createToken } from "@/utils/makeToken";  

export async function POST(req) {
   const { email, password } = await req.json();

   try {
      if (!email || !password) {
         return NextResponse.json({ error: "Missing values" }, { status: 400 });
      }

      const user = await prisma.user.findUnique({
         where: { email },
      });

      if (!user) {
         return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
         return NextResponse.json({ error: "Invalid password" }, { status: 401 });
      }

      const token = await createToken(user.id);  

      const response = NextResponse.json({ message: "Login successful", token }, { status: 200 });
      
      response.cookies.set('authToken', token, { httpOnly: true, path: '/', secure: process.env.NODE_ENV === 'production'});

      return response;
   } catch (err) {
      console.error(err);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
   }
}
