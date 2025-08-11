// components/Nav.tsx
"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Nav() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Type-safe way to get the role
  const role = session?.user?.role;
  const isLoading = status === "loading";

  const handleSignOut = () => {
    signOut({ callbackUrl: "/auth/signin" });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (isLoading) {
    return (
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-darkBrown">
            VU Timetable
          </Link>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-20"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl text-darkBrown hover:text-lightBrown transition-colors">
            VU Timetable
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/dashboard" 
              className="text-darkBrown hover:text-lightBrown transition-colors font-medium"
            >
              Dashboard
            </Link>

            {/* Role-based Navigation */}
            {role === "admin" && (
              <Link 
                href="/dashboard/admin" 
                className="text-darkBrown hover:text-lightBrown transition-colors font-medium"
              >
                Admin Panel
              </Link>
            )}
            {role === "coordinator" && (
              <Link 
                href="/dashboard/coordinator" 
                className="text-darkBrown hover:text-lightBrown transition-colors font-medium"
              >
                Coordinator
              </Link>
            )}
            {role === "faculty" && (
              <Link 
                href="/dashboard/faculty" 
                className="text-darkBrown hover:text-lightBrown transition-colors font-medium"
              >
                Faculty
              </Link>
            )}
            {role === "student" && (
              <Link 
                href="/dashboard/student" 
                className="text-darkBrown hover:text-lightBrown transition-colors font-medium"
              >
                Student
              </Link>
            )}

            {/* User Section */}
            {session?.user ? (
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="text-gray-600">Welcome, </span>
                  <span className="font-semibold text-darkBrown">
                    {session.user.name || session.user.email}
                  </span>
                  {role && (
                    <span className="ml-2 px-2 py-1 bg-lightBrown text-white text-xs rounded-full">
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </span>
                  )}
                </div>
                <button 
                  onClick={handleSignOut}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link 
                href="/auth/signin" 
                className="bg-lightBrown hover:bg-lightBrownHover text-white px-4 py-2 rounded-md transition-colors text-sm font-medium"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex flex-col gap-1 p-2"
            aria-label="Toggle mobile menu"
          >
            <span className={`w-6 h-0.5 bg-darkBrown transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-darkBrown transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-darkBrown transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col gap-3 pt-4">
              <Link 
                href="/dashboard" 
                className="text-darkBrown hover:text-lightBrown transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>

              {/* Role-based Mobile Navigation */}
              {role === "admin" && (
                <Link 
                  href="/dashboard/admin" 
                  className="text-darkBrown hover:text-lightBrown transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
              {role === "coordinator" && (
                <Link 
                  href="/dashboard/coordinator" 
                  className="text-darkBrown hover:text-lightBrown transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Coordinator
                </Link>
              )}
              {role === "faculty" && (
                <Link 
                  href="/dashboard/faculty" 
                  className="text-darkBrown hover:text-lightBrown transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Faculty
                </Link>
              )}
              {role === "student" && (
                <Link 
                  href="/dashboard/student" 
                  className="text-darkBrown hover:text-lightBrown transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Student
                </Link>
              )}

              {/* Mobile User Section */}
              {session?.user ? (
                <div className="border-t border-gray-200 pt-3 mt-2">
                  <div className="text-sm mb-3">
                    <span className="text-gray-600">Signed in as: </span>
                    <span className="font-semibold text-darkBrown block">
                      {session.user.name || session.user.email}
                    </span>
                    {role && (
                      <span className="inline-block mt-1 px-2 py-1 bg-lightBrown text-white text-xs rounded-full">
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={handleSignOut}
                    className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors text-sm font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-3 mt-2">
                  <Link 
                    href="/auth/signin" 
                    className="block w-full bg-lightBrown hover:bg-lightBrownHover text-white px-4 py-2 rounded-md transition-colors text-sm font-medium text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}