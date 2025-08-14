/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState({ email: false, password: false });
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  // Clear general error when user starts typing
  useEffect(() => {
    if (errors.general && (email || password)) {
      setErrors((prev) => ({ ...prev, general: undefined }));
    }
  }, [email, password, errors.general]);

  // Email validation
  const validateEmail = (email: string): string | undefined => {
    if (!email) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address";
    }
    return undefined;
  };

  // Password validation
  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Password is required";
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return undefined;
  };

  // Real-time validation
  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (touched.email) {
      const emailError = validateEmail(value);
      setErrors((prev) => ({ ...prev, email: emailError }));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (touched.password) {
      const passwordError = validatePassword(value);
      setErrors((prev) => ({ ...prev, password: passwordError }));
    }
  };

  // Handle input blur for validation
  const handleBlur = (field: "email" | "password") => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    if (field === "email") {
      const emailError = validateEmail(email);
      setErrors((prev) => ({ ...prev, email: emailError }));
    } else {
      const passwordError = validatePassword(password);
      setErrors((prev) => ({ ...prev, password: passwordError }));
    }
  };

  // Quick fill demo credentials
  const fillCredentials = (role: string) => {
    const credentials = {
      admin: { email: "admin@gmail.com", password: "Admin@123" },
      coordinator: {
        email: "coordinator@gmail.com",
        password: "Coordinator@123",
      },
      faculty: { email: "faculty@gmail.com", password: "faculty@123" },
      student: { email: "student@gmail.com", password: "Student@123" },
    };

    const cred = credentials[role as keyof typeof credentials];
    if (cred) {
      setEmail(cred.email);
      setPassword(cred.password);
      setErrors({});
      setTouched({ email: false, password: false });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
      });
      setTouched({ email: true, password: true });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (!res?.error) {
        // Role-based routing
        const routes = {
          "admin@gmail.com": "/admin/dashboard",
          "coordinator@gmail.com": "/coordinator/dashboard",
          "faculty@gmail.com": "/faculty/dashboard",
          "student@gmail.com": "/student/dashboard",
        };

        const redirectUrl =
          routes[email as keyof typeof routes] || callbackUrl || "/dashboard";
        router.push(redirectUrl);
        router.refresh();
      } else {
        setErrors({ general: "Invalid email or password. Please try again." });
      }
    } catch (error) {
      setErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
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

          {/* General Error Message */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
              <span className="text-red-700 text-sm">{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email Field */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
                style={{ color: "#493737" }}
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200"
                  }`}
                  style={{
                    borderRadius: "8px",
                  }}
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
                style={{ color: "#493737" }}
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onBlur={() => handleBlur("password")}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200"
                  }`}
                  style={{
                    borderRadius: "8px",
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-white font-medium rounded-lg shadow transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                backgroundColor: "#d89860",
                borderRadius: "8px",
              }}
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
          </form>

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
              {[
                {
                  role: "Admin",
                  email: "admin@gmail.com",
                  password: "Admin@123",
                  key: "admin",
                },
                {
                  role: "Coordinator",
                  email: "coordinator@gmail.com",
                  password: "Coordinator@123",
                  key: "coordinator",
                },
                {
                  role: "Faculty",
                  email: "faculty@gmail.com",
                  password: "faculty@123",
                  key: "faculty",
                },
                {
                  role: "Student",
                  email: "student@gmail.com",
                  password: "Student@123",
                  key: "student",
                },
              ].map((cred) => (
                <button
                  key={cred.key}
                  type="button"
                  onClick={() => fillCredentials(cred.key)}
                  className="flex justify-between items-center p-2 bg-white rounded border-l-2 hover:bg-gray-50 transition-colors cursor-pointer text-left"
                  style={{ borderLeftColor: "#d89860" }}
                >
                  <span className="font-medium" style={{ color: "#493737" }}>
                    {cred.role}:
                  </span>
                  <span className="text-gray-600">
                    {cred.email} / {cred.password}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Click on any credential to auto-fill the form
            </p>
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
