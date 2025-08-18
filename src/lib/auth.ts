/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/mongoose";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

/**
 * Minimal local types we use inside this file.
 * We do NOT attempt to change NextAuth's global types here,
 * we only use local narrow types and safe casts where needed.
 */
interface CustomUser {
  id: string;
  email: string;
  role: "admin" | "coordinator" | "faculty" | "student";
}

interface CustomSession extends Session {
  user: {
    id: string;
    email: string;
    role: "admin" | "coordinator" | "faculty" | "student";
    name?: string | null;
    image?: string | null;
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
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          await connectDB();

          // keep the user doc as "any" to avoid strict _id typing issues here
          const userDoc: any = await User.findOne({
            email: credentials.email,
          });

          if (!userDoc) return null;

          const isMatch = await bcrypt.compare(
            credentials.password,
            userDoc.password
          );
          if (!isMatch) return null;

          // convert ObjectId -> string safely
          const id = userDoc._id?.toString?.() ?? "";

          const returnedUser: CustomUser = {
            id,
            email: userDoc.email,
            role: userDoc.role as CustomUser["role"],
          };

          return returnedUser;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    // jwt callback: attach id/role/email to the token (token is JWT)
    async jwt({ token, user }): Promise<JWT> {
      if (user) {
        const u = user as CustomUser;
        // use any casts to avoid strict mismatch with NextAuth's JWT type
        (token as any).id = u.id;
        (token as any).role = u.role;
        (token as any).email = u.email;
      }
      return token;
    },

    // session callback: build a session.user object with id/email/role
    async session({ session, token }): Promise<CustomSession> {
      const s = session as CustomSession;

      s.user = {
        id: (token as any).id ?? "",
        email: (token as any).email ?? "",
        role: (token as any).role ?? "student",
        name: session.user?.name ?? null,
        image: session.user?.image ?? null,
      };

      // debug line you had earlier (optional)
      // console.log("DEBUG session callback:", s);

      return s;
    },
  },

  pages: {
    signIn: "/auth/signin",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
