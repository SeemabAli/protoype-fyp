"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface Props {
  children: ReactNode;
  allowedRoles: string[];
}

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
};

type Session = {
  user?: SessionUser;
};

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { data: session, status } = useSession() as { data: Session | null, status: string };
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/auth/signin");
    else if (
      !session.user ||
      !session.user.role ||
      !allowedRoles.includes(session.user.role)
    ) router.push("/auth/signin");
  }, [session, status, router, allowedRoles]);

  if (status === "loading") return <p>Loading...</p>;

  return <>{children}</>;
}
