import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { createToken } from '@/utils/makeToken';

export async function POST(req) {
   const { email, password, fullName } = await req.json();

   try {
      if (!email || !password || !fullName) {
         return NextResponse.json({ error: 'Missing values.' }, { status: 400 });
      }

      const existingUser = await prisma.user.findUnique({
         where: { email },
      });

      if (existingUser) {
         return NextResponse.json({ error: 'Email already exists.' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
         data: {
            fullName: fullName,
            email: email,
            password: hashedPassword,
         },
      });

      const token = await createToken(newUser.id);

      cookies().set('authToken', token, { httpOnly: true, path: '/', secure: process.env.NODE_ENV === 'production' });

      return NextResponse.json({ message: 'User created successfully', token }, { status: 201 });

   } catch (err) {
      console.error(err);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
   }
}
