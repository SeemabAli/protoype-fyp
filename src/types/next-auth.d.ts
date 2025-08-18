import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "admin" | "coordinator" | "faculty" | "student";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "admin" | "coordinator" | "faculty" | "student";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "admin" | "coordinator" | "faculty" | "student";
  }
}
