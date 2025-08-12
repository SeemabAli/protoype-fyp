/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";
import { connectDB } from "@/lib/mongoose";

// Extend the built-in session types
declare module "next-auth" {
  interface User {
    role?: string | null;
    id?: string | null;
  }
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
      id?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}

interface UserDocument {
  _id: string;
  email: string;
  password: string;
  role: string;
  name?: string;
}

interface CustomUser extends NextAuthUser {
  role: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<CustomUser | null> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectDB();
          
          const user = await User.findOne({ 
            email: credentials.email 
          }).lean() as UserDocument | null;
          
          if (!user) {
            console.log("No user found with email:", credentials.email);
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isValid) {
            console.log("Invalid password for user:", credentials.email);
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name || user.email,
            role: user.role
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: 
      { 
        token: JWT; 
        user?: NextAuthUser | null; 
        account?: any; 
        profile?: any; 
        trigger?: "signIn" | "signUp" | "update"; 
        isNewUser?: boolean; 
        session?: any; 
      }
    ): Promise<JWT> {
      if (user) {
        // Assign role if present, otherwise fallback to undefined
        token.role = (user as any).role ?? undefined;
        token.id = (user as any).id ?? undefined;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
      if (token) {
        if (!session.user) {
          session.user = {};
        }
        session.user.role = token.role;
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/auth/error"
  },
  debug: process.env.NODE_ENV === "development"
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };