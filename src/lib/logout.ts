"use client";

import { signOut } from "next-auth/react";

export const logout = async () => {
  try {
    await signOut({
      redirect: true,
      callbackUrl: "/auth/signin", // ✅ send user to home page after logout
    });
  } catch (error) {
    console.error("Logout error:", error);
  }
};
