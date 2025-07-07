"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import {
  Menu,
  X,
  Trophy,
  Users,
  User as UserIcon,
  LogIn,
  LogOut,
  QrCode,
  Shield,
  Shirt,
  Bike,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AuthModal from "./AuthModal";
import { formatUserName } from "@/lib/utils";
import { Session } from "@supabase/supabase-js";
import { User } from "@/types";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const supabase = createClient();

  const [userData, setUserData] = useState<User | null>(null);
  const [userError, setUserError] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) {
        setUserData(null);
        setUserError(null);
        return;
      }
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();
      setUserData(
        data
          ? {
              ...data,
              firstname: data.firstname ?? "",
              lastname: data.lastname ?? "",
              displayname: data.displayname ?? "",
              emoji: data.emoji ?? "",
              role: data.role ?? "",
              avatar_url: data.avatar_url ?? "",
              created_at: data.created_at ?? "",
              updated_at: data.updated_at ?? "",
              is_admin: data.is_admin ?? false,
            }
          : null
      );
      setUserError(error);
    };
    fetchUserData();
  }, [user?.id, supabase]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">(
    "login"
  );

  const isLoggedIn = !!user;
  const isAdmin = userData?.is_admin ?? false;
  const userName = userData ? formatUserName(userData) : "Not logged in";
  const avatarUrl = userData?.avatar_url || null;

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);
  const openAuthModal = (tab: "login" | "register") => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
    router.push("/"); // immediate redirect
    router.refresh(); // triggers layout reload (gets fresh server session)
  };

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    router.refresh(); // re-fetch server components (including layout)
  };

  // Optional: redirect logged-in user away from /login
  useEffect(() => {
    if (pathname === "/login" && isLoggedIn) {
      router.push("/");
    }
  }, [pathname, isLoggedIn, router]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo */}
            <Link href="/" className="flex items-center space-x-3">
              {/* <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-lg">U</span>
              </div>
              <div className="hidden sm:block truncate">
                <span className="text-2xl font-black text-white tracking-tight">
                  UGE 30
                </span>
                <p className="text-xs text-cyan-300 font-medium -mt-1">
                  Festival Battle
                </p>
              </div> */}
              {/* <div className="h-12 w-auto bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg"> */}
              <div className="p-2 rounded-2xl bg-gradient-to-br from-cyan-500 via-fuchsia-500 to-yellow-300 shadow-lg">
                <img
                  src="/app-logo-white.webp"
                  alt="UGE30 Logo"
                  className="h-8 w-auto"
                />
              </div>

              {/* </div> */}
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/">
                <Button
                  variant="ghost"
                  className="text-white hover:text-cyan-300"
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  Standings
                </Button>
              </Link>
              <Link href="/social">
                <Button
                  variant="ghost"
                  className="text-white hover:text-cyan-300"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Social
                </Button>
              </Link>
              <Link href="/stages">
                <Button
                  variant="ghost"
                  className="text-white hover:text-cyan-300"
                >
                  <Bike className="h-4 w-4 mr-2" />
                  Etaper
                </Button>
              </Link>

              {isAdmin && (
                <>
                  {/* <Link href="/add-points">
                    <Button
                      variant="ghost"
                      className="text-green-400 hover:text-green-300"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Add Points
                    </Button>
                  </Link>
                  <Link href="/jerseys/edit">
                    <Button
                      variant="ghost"
                      className="text-green-400 hover:text-green-300"
                    >
                      Edit Jerseys
                    </Button>
                  </Link> */}
                  <Link href="/admin/stages">
                    <Button
                      variant="ghost"
                      className="text-green-400 hover:text-green-300"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Administrer Etaper
                    </Button>
                  </Link>
                </>
              )}

              <Button
                className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-6 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
                onClick={() => router.push("/scan")}
              >
                <QrCode className="h-4 w-4 mr-2" />
                Scan
              </Button>

              {/* User Menu */}
              {isLoggedIn ? (
                <>
                  <Link href="/my" onClick={closeMenu}>
                    <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 hover:bg-white/20 transition-colors">
                      <div className="flex items-center space-x-2">
                        {/* <div className="w-8 h-8 bg-gradient-to-w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full mr-3 flex items-center justify-centerr from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-white" />
                      </div> */}
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt="User Avatar"
                            className="w-8 h-8 rounded-full object-cover mr-3"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full mr-3 flex items-center justify-center">
                            <UserIcon className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <span className="text-white font-medium truncate">
                          {userName || "User"}
                        </span>
                        <Badge className="bg-cyan-500 text-white font-semibold">
                          {isAdmin ? "Admin" : "User"}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 hover:text-red-300 transition-colors p-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-white/10"
                    onClick={() => openAuthModal("login")}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                    onClick={() => openAuthModal("register")}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Register
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white hover:bg-white/10"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-black/30 backdrop-blur-md border-t border-white/10 animate-fade-in">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link href="/scan" onClick={closeMenu}>
                  <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white">
                    <QrCode className="h-4 w-4 mr-2" />
                    Vis/Scan QR-Kode
                  </Button>
                </Link>
                <Link href="/" onClick={closeMenu}>
                  <Button variant="ghost" className="w-full text-white">
                    <Trophy className="h-4 w-4 mr-2" />
                    Standings
                  </Button>
                </Link>
                <Link href="/social" onClick={closeMenu}>
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-white/10 hover:text-cyan-300 transition-colors w-full"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Social
                  </Button>
                </Link>
                <Link href="/stages" onClick={closeMenu}>
                  <Button variant="ghost" className="w-full text-white">
                    <Bike className="h-4 w-4 mr-2" />
                    Etaper
                  </Button>
                </Link>

                {isAdmin && (
                  <>
                    {/* <Link href="/add-points" onClick={closeMenu}>
                      <Button variant="ghost" className="w-full text-green-300">
                        Add Points
                      </Button>
                    </Link> */}
                    {/* <Link href="/jerseys/edit" onClick={closeMenu}>
                      <Button variant="ghost" className="w-full text-green-300">
                        Edit Jerseys
                      </Button>
                    </Link> */}
                    <Link href="/admin/stages" onClick={closeMenu}>
                      <Button variant="ghost" className="w-full text-green-300">
                        <Shield className="h-4 w-4 mr-2" />
                        Administrer Etaper
                      </Button>
                    </Link>
                  </>
                )}

                <div className="border-t border-white/10 pt-3 mt-3">
                  {/* {isLoggedIn ? (
                    <>
                      <div className="flex items-center px-3 py-2 text-white">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt="User Avatar"
                            className="w-8 h-8 rounded-full object-cover mr-3"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full mr-3 flex items-center justify-center">
                            <UserIcon className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <span className="text-white font-medium">
                          {userName || "User"}
                        </span>
                        <Badge className="ml-2 bg-cyan-500 text-white font-semibold">
                          {isAdmin ? "Admin" : "User"}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-400 hover:bg-red-900/20"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-white hover:bg-white/10"
                        onClick={() => openAuthModal("login")}
                      >
                        <LogIn className="h-4 w-4 mr-3" />
                        Login
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-white hover:bg-white/10"
                        onClick={() => openAuthModal("register")}
                      >
                        <Users className="h-4 w-4 mr-3" />
                        Register
                      </Button>
                    </>
                  )} */}
                  {/* User Menu */}
                  {isLoggedIn ? (
                    <>
                      <Link href="/my" onClick={closeMenu}>
                        <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                          <div className="flex items-center space-x-2">
                            {/* <div className="w-8 h-8 bg-gradient-to-w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full mr-3 flex items-center justify-centerr from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-white" />
                      </div> */}
                            {avatarUrl ? (
                              <img
                                src={avatarUrl}
                                alt="User Avatar"
                                className="w-8 h-8 rounded-full object-cover mr-3"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full mr-3 flex items-center justify-center">
                                <UserIcon className="h-4 w-4 text-white" />
                              </div>
                            )}
                            <span className="text-white font-medium truncate">
                              {userName || "User"}
                            </span>
                            <Badge className="bg-cyan-500 text-white font-semibold">
                              {isAdmin ? "Admin" : "User"}
                            </Badge>
                          </div>
                        </div>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-400 hover:bg-red-900/20"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-white hover:bg-white/10"
                        onClick={() => openAuthModal("login")}
                      >
                        <LogIn className="h-4 w-4 mr-3" />
                        Login
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-white hover:bg-white/10"
                        onClick={() => openAuthModal("register")}
                      >
                        <Users className="h-4 w-4 mr-3" />
                        Register
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalTab}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
}