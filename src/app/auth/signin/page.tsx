"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    setLoading(false);

    if (!res?.error) {
      if (email === "admin@gmail.com") router.push("/admin/dashboard");
      else if (email === "coordinator@gmail.com")
        router.push("/coordinator/dashboard");
      else if (email === "teacher@gmail.com") router.push("/teacher/dashboard");
      else if (email === "student@gmail.com") router.push("/student/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div className="w-full max-w-md">
        {/* Header Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden"
              style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
            >
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/VU_Logo.png/960px-VU_Logo.png"
                alt="VU Logo"
                width={48}
                height={48}
                className="w-3/4 h-auto object-contain"
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
            <div>
              <h1
                className="text-xl font-semibold leading-tight"
                style={{ color: "#493737" }}
              >
                Automated Timetable System
              </h1>
            </div>
          </div>
        </div>

        {/* Sign In Form */}
        <div
          className="bg-white p-8 rounded-xl border-l-4"
          style={{
            borderLeftColor: "#d89860",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div className="mb-6">
            <h2
              className="text-2xl font-semibold mb-2"
              style={{ color: "#493737" }}
            >
              Welcome Back
            </h2>
            <p className="text-gray-600 text-sm">
              Sign in to access your dashboard
            </p>
          </div>

          <div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#493737" }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{
                  borderRadius: "8px",
                }}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-6">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#493737" }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{
                  borderRadius: "8px",
                }}
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-white font-medium rounded-lg shadow transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "#d89860",
                borderRadius: "8px",
              }}
              onClick={handleSubmit}
              onMouseEnter={(e) => {
                if (!loading)
                  (e.target as HTMLButtonElement).style.backgroundColor =
                    "#c08850";
              }}
              onMouseLeave={(e) => {
                if (!loading)
                  (e.target as HTMLButtonElement).style.backgroundColor =
                    "#d89860";
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </div>

          {/* Demo Credentials */}
          <div
            className="mt-6 p-4 rounded-lg"
            style={{ backgroundColor: "#f8f9fa", border: "1px solid #e9ecef" }}
          >
            <p
              className="font-semibold text-xs mb-3"
              style={{ color: "#493737" }}
            >
              🔐 Demo Login Credentials:
            </p>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <div
                className="flex justify-between items-center p-2 bg-white rounded border-l-2"
                style={{ borderLeftColor: "#d89860" }}
              >
                <span className="font-medium" style={{ color: "#493737" }}>
                  Admin:
                </span>
                <span className="text-gray-600">
                  admin@gmail.com / Admin@123
                </span>
              </div>
              <div
                className="flex justify-between items-center p-2 bg-white rounded border-l-2"
                style={{ borderLeftColor: "#d89860" }}
              >
                <span className="font-medium" style={{ color: "#493737" }}>
                  Coordinator:
                </span>
                <span className="text-gray-600">
                  coordinator@gmail.com / Coordinator@123
                </span>
              </div>
              <div
                className="flex justify-between items-center p-2 bg-white rounded border-l-2"
                style={{ borderLeftColor: "#d89860" }}
              >
                <span className="font-medium" style={{ color: "#493737" }}>
                  Faculty:
                </span>
                <span className="text-gray-600">
                  teacher@gmail.com / Teacher@123
                </span>
              </div>
              <div
                className="flex justify-between items-center p-2 bg-white rounded border-l-2"
                style={{ borderLeftColor: "#d89860" }}
              >
                <span className="font-medium" style={{ color: "#493737" }}>
                  Student:
                </span>
                <span className="text-gray-600">
                  student@gmail.com / Student@123
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            © 2024 Automated Timetable System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
