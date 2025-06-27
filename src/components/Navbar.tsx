"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  Trophy,
  Users,
  User,
  LogIn,
  LogOut,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState("User");

  const router = useRouter();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const sessionUser = data.session?.user;
      setIsLoggedIn(!!sessionUser);

      if (sessionUser) {
        const { data: userProfile } = await supabase
          .from("users")
          .select("is_admin")
          .eq("id", sessionUser.id)
          .single();

        setIsAdmin(userProfile?.is_admin || false);
        setUserName(sessionUser.user_metadata?.name || "User");
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    router.push("/");
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-lg">U</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-2xl font-black text-white tracking-tight">
                UGE 30
              </span>
              <p className="text-xs text-cyan-300 font-medium -mt-1">
                Festival Battle
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 hover:text-cyan-300 transition-colors"
            >
              <Trophy className="h-4 w-4 mr-2" />
              Standings
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 hover:text-cyan-300 transition-colors"
            >
              <Badge className="mr-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white border-0">
                8
              </Badge>
              Jerseys
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 hover:text-cyan-300 transition-colors"
            >
              <User className="h-4 w-4 mr-2" />
              My Profile
            </Button>
            {isAdmin && (
              <>
                <Link href="/add-points">
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-white/10 hover:text-green-300 transition-colors"
                  >
                    Add Points
                  </Button>
                </Link>
                <Link href="/jerseys/edit">
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-white/10 hover:text-green-300 transition-colors"
                  >
                    Edit Jerseys
                  </Button>
                </Link>
              </>
            )}
            {/* Scan Button - Primary Action */}
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold px-6 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200">
              <QrCode className="h-4 w-4 mr-2" />
              Scan
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full mr-2 flex items-center justify-center">
                    <User className="h-3 w-3 text-white" />
                  </div>
                  {userName}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-900/95 backdrop-blur-md border-gray-700 text-white">
                {isLoggedIn ? (
                  <>
                    <DropdownMenuItem className="hover:bg-gray-800">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem className="hover:bg-gray-800 text-red-400">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem className="hover:bg-gray-800">
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-800">
                      <Users className="h-4 w-4 mr-2" />
                      Register
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
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
              <Button className="w-full justify-center bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 rounded-lg shadow-lg mb-4">
                <QrCode className="h-5 w-5 mr-2" />
                Scan QR Code
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-white/10 hover:text-cyan-300"
              >
                <Trophy className="h-4 w-4 mr-3" />
                Standings
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-white/10 hover:text-cyan-300"
              >
                <Badge className="mr-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white border-0">
                  8
                </Badge>
                Jerseys
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-white/10 hover:text-cyan-300"
              >
                <User className="h-4 w-4 mr-3" />
                My Profile
              </Button>
              {isAdmin && (
                <>
                  <Link href="/add-points">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-white/10 hover:text-green-300"
                    >
                      Add Points
                    </Button>
                  </Link>
                  <Link href="/jerseys/edit">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-white/10 hover:text-green-300"
                    >
                      Edit Jerseys
                    </Button>
                  </Link>
                </>
              )}
              <div className="border-t border-white/10 pt-3 mt-3">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center px-3 py-2 text-white">
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full mr-3 flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      {userName}
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-400 hover:bg-red-900/20"
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
                    >
                      <LogIn className="h-4 w-4 mr-3" />
                      Login
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-white/10"
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
  );
}
