"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm, { RegisterFormData } from "./RegisterForm";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth"; // updated to use context
import { createClient } from "@/lib/supabaseClient"; // ensure supabase client is imported

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
  const { signIn, signUp } = useAuth(); // from context
  const supabase = createClient(); // ensure supabase client is created

  const handleLoginSubmit = async (data: {
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    const { error } = await signIn(data.email, data.password);
    setIsLoading(false);

    if (error) {
      toast.error("Login failed: " + error.message);
      return;
    }

    toast.success("Welcome back!");
    onAuthSuccess?.();
    onClose();
    window.location.reload();
  };

  const handleRegisterSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    const nameParts = data.name.trim().split(" ").filter(Boolean);
    if (nameParts.length === 0) {
      toast.error("Please enter your full name.");
      setIsLoading(false);
      return;
    }

    const firstname = nameParts[0];
    const lastname = nameParts.slice(1).join(" ") || "-";

    const clean = (s: string) => s.replace(/[^a-z]/gi, "").toUpperCase();
    const first = clean(firstname);
    const last = clean(lastname);

    const generateCandidates = (first: string, last: string): string[] => {
      return [
        first,
        `${first}${last.charAt(0)}`,
        `${first}${last}`,
        `${first.charAt(0)}${last}`,
      ].filter(Boolean);
    };

    const candidates = generateCandidates(first, last);
    let displayname: string | null = null;

    for (const name of candidates) {
      if (!supabase) {
        toast.error("Supabase client is not initialized.");
        setIsLoading(false);
        return;
      }

      const { data: existing, error } = await supabase
        .from("users")
        .select("id")
        .eq("displayname", name)
        .limit(1);
      if (error) {
        toast.error("Displayname check failed.");
        setIsLoading(false);
        return;
      }
      if (!existing?.length) {
        displayname = name;
        break;
      }
    }

    if (!displayname) {
      toast.error("Could not generate unique displayname.");
      setIsLoading(false);
      return;
    }

    // Use `signUp` from context
    const { error: signUpError } = await signUp(data.email, data.password, {
      profileComplete: false,
      firstname,
      lastname,
      displayname,
    });

    if (signUpError) {
      toast.error("Signup failed: " + signUpError.message);
      setIsLoading(false);
      return;
    }

    toast.success("Account created!");
    onAuthSuccess?.();
    onClose();
    window.location.reload();
  };

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-full my-2 p-0 bg-transparent border-0 shadow-none">
        <DialogTitle className="sr-only">
          {activeTab === "login" ? "Log ind" : "Opret Rytter"}
        </DialogTitle>

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
                Log ind
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
                Opret Rytter
              </Button>
            </div>
          </div>

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
