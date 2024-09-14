import { userLogInSchema } from "@repo/common/types/zodTypes";
import Credentials from "next-auth/providers/credentials";
import prisma from "../db";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          placeholder: "Enter your email",
          type: "text",
        },
        password: {
          label: "Password",
          placeholder: "Enter your password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const userCredentials = {
          email: credentials?.email,
          password: credentials?.password,
        };
        const parsedData = userLogInSchema.safeParse(userCredentials);
        if (!parsedData.success) return null;
        const user = await prisma.user.findUnique({
          where: {
            email: parsedData.data.email,
          },
        });
        if (!user) return null;
        const isPasswordCorrect = await bcrypt.compare(
          parsedData.data.password,
          user.password
        );
        if (!isPasswordCorrect) return null;
        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "secret",
  callbacks: {
    async session({ session, token }: any) {
      session.user.id = token.sub;
      return session;
    },
  },
};
