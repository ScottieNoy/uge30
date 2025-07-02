"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm, { RegisterFormData } from "./RegisterForm";
import { createClient } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { profile } from "console";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
  onAuthSuccess?: () => void;
}

const AuthModal = ({
  isOpen,
  onClose,
  defaultTab = "login",
  onAuthSuccess,
}: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">(defaultTab);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const handleLoginSubmit = async (data: { email: string; password: string; }) => {
  setIsLoading(true);
  console.log("Login data:", data);

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  setIsLoading(false);

  if (error) {
    console.error("Login failed:", error.message);
    return;
  }

  onAuthSuccess?.(); // Optional callback
  onClose(); // Close modal or drawer
  
  // Full page reload to apply changes
  window.location.reload();
};


  const handleRegisterSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    console.log("Register data:", data);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          profileComplete: false, // Initially set to false
        },
      },
    });

    if (authError) {
      console.error("Sign up error:", authError.message);
      setIsLoading(false);
      return;
    }

    const userId = authData.user?.id;
    if (!userId) {
      console.error("No user ID returned after sign up.");
      setIsLoading(false);
      return;
    }

    const [firstnameRaw, ...rest] = data.name.trim().split(" ");
    const firstname = firstnameRaw || "";
    const lastname = rest.join(" ") || "";

    const clean = (s: string) => s.replace(/[^a-z]/gi, "").toUpperCase();

    const first = clean(firstname);
    const last = clean(lastname);

    // Helper to try different combinations (e.g., JO+BR, J+OBR, etc.)
    const generateCandidates = (first: string, last: string): string[] => {
      const capitalize = (s: string) => s.toUpperCase();

      const capitalizedFirst = capitalize(first);
      const capitalizedLast = capitalize(last);

      const candidates = [
        capitalizedFirst,
        `${capitalizedFirst}${capitalizedLast.charAt(0)}`,
        `${capitalizedFirst}${capitalizedLast}`,
        `${capitalizedFirst.charAt(0)}${capitalizedLast}`,
      ];

      return candidates.filter((name) => name.length > 0);
    };

    const candidates = generateCandidates(first, last);

    let displayname = null;
    for (const name of candidates) {
      const { data: existing, error } = await supabase
        .from("users")
        .select("id")
        .eq("displayname", name)
        .limit(1);

      if (error) {
        console.error("Error checking displayname:", error.message);
        setIsLoading(false);
        return;
      }

      if (!existing || existing.length === 0) {
        displayname = name;
        break;
      }
    }

    if (!displayname) {
      console.error("Unable to generate unique displayname.");
      setIsLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("users").insert({
      id: userId,
      firstname,
      lastname,
      displayname,
      emoji: "👤",
    });

    if (insertError) {
      console.error("Failed to insert user profile:", insertError.message);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    toast.success("Account created successfully! Please check your email to verify your account.");
    onAuthSuccess?.();
    onClose?.();
  };

  // Reset tab when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-full my-2 p-0 bg-transparent border-0 shadow-none">
        <DialogTitle className="sr-only">
          {activeTab === "login" ? "Sign In" : "Sign Up"}
        </DialogTitle>
        {/* Custom close button - larger and easier to press on mobile */}
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute right-2 -top-16 z-50 h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:text-white focus:ring-2 focus:ring-white/50"
        >
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </Button>

        <div className="space-y-4">
          {/* Fixed height container to prevent vertical movement */}
          <div className="h-12 flex items-center">
            <div className="flex bg-white/20 backdrop-blur-md rounded-lg p-1 border border-white/20 w-full">
              <Button
                variant={activeTab === "login" ? "default" : "ghost"}
                className={`flex-1 h-10 ${
                  activeTab === "login"
                    ? "bg-white text-gray-800 shadow-md"
                    : "text-white hover:bg-white/10"
                }`}
                onClick={() => setActiveTab("login")}
              >
                Sign In
              </Button>
              <Button
                variant={activeTab === "register" ? "default" : "ghost"}
                className={`flex-1 h-10 ${
                  activeTab === "register"
                    ? "bg-white text-gray-800 shadow-md"
                    : "text-white hover:bg-white/10"
                }`}
                onClick={() => setActiveTab("register")}
              >
                Sign Up
              </Button>
            </div>
          </div>

          {/* Form container with fixed height to prevent movement */}
          <div className="h-[600px] flex items-start justify-center">
            {activeTab === "login" ? (
              <LoginForm onSubmit={handleLoginSubmit} isLoading={isLoading} />
            ) : (
              <RegisterForm
                onSubmit={handleRegisterSubmit}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
