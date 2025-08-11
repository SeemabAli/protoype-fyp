"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", { redirect: false, email, password });
    setLoading(false);

    if (!res?.error) {
      if (email === "admin@gmail.com") router.push("/dashboard/admin");
      else if (email === "coordinator@gmail.com") router.push("/dashboard/coordinator");
      else if (email === "teacher@gmail.com") router.push("/dashboard/faculty");
      else if (email === "student@gmail.com") router.push("/dashboard/student");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-lightBrown w-full max-w-md">
        <h1 className="text-2xl font-semibold text-darkBrown mb-6 text-center">Sign In</h1>
        <label className="block mb-4 text-sm font-medium text-darkBrown">
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-lightBrown" />
        </label>
        <label className="block mb-6 text-sm font-medium text-darkBrown">
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-lightBrown" />
        </label>
        <button disabled={loading}
          className="w-full py-2 bg-lightBrown hover:bg-lightBrownHover text-white font-medium rounded-md shadow transition">
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <div className="mt-6 text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
          <p className="font-semibold text-darkBrown mb-1">Hardcoded logins:</p>
          <ul className="space-y-1">
            <li>admin@gmail.com / Admin@123</li>
            <li>coordinator@gmail.com / Coordinator@123</li>
            <li>teacher@gmail.com / Teacher@123</li>
            <li>student@gmail.com / Student@123</li>
          </ul>
        </div>
      </form>
    </div>
  );
}
