// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/mongoose";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

interface UserDocument {
  _id: unknown;
  email: string;
  password: string;
  role: string;
}

interface CustomUser {
  id: string;
  email: string;
  role: string;
}

interface CustomJWT extends JWT {
  role?: string;
}

interface CustomSession extends Session {
  user: {
    id?: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
    role?: string;
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<CustomUser | null> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectDB();
          const user = await User.findOne({ email: credentials.email }) as UserDocument | null;
          
          if (!user) return null;

          const isMatch = await bcrypt.compare(credentials.password, user.password);
          if (!isMatch) return null;

          return { 
            id: (user._id as string).toString(), 
            email: user.email, 
            role: user.role 
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }): Promise<CustomJWT> {
      if (user) {
        token.role = (user as CustomUser).role;
      }
      return token as CustomJWT;
    },
    async session({ session, token }): Promise<CustomSession> {
      if (token) {
        (session as CustomSession).user.role = (token as CustomJWT).role;
      }
      return session as CustomSession;
    },
  },
  pages: { 
    signIn: "/auth/signin" 
  },
  session: { 
    strategy: "jwt" as const
  },
  secret: process.env.NEXTAUTH_SECRET,
};