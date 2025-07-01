"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { createClient } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UpdatePasswordForm() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    const handlePKCESession = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");

      if (code) {
        console.log("🔐 Found PKCE code, exchanging...");
        const { data, error } = await supabase.auth.exchangeCodeForSession(
          code
        );
        if (error) {
          console.error("❌ PKCE session exchange failed:", error.message);
          setMessage("Password reset link is invalid or expired.");
          return;
        }
        console.log("✅ PKCE session exchange successful");
      }

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      console.log("📦 Session data after PKCE:", session);
      if (session) {
        setSessionReady(true);
      } else {
        setMessage("You must use the password reset link from your email.");
      }

      if (sessionError) {
        setMessage("Error fetching session: " + sessionError.message);
      }
    };

    handlePKCESession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🔧 Starting password update flow...");

    setMessage(null);
    setLoading(true);

    try {
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters.");
      }

      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        throw new Error(
          "Password must contain at least one uppercase, one lowercase, and one number."
        );
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match.");
      }

      if (!sessionReady) {
        throw new Error(
          "Session not ready. Please use the reset link from your email."
        );
      }

      console.log("🚀 Attempting to update password...");
      await supabase.auth.updateUser({ password });
      setMessage("✅ Password updated! Redirecting...");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => router.push("/"), 2500);

      console.log("🎉 Password updated successfully.");
      setMessage("✅ Password updated! Redirecting...");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => router.push("/"), 2500);
    } catch (err: any) {
      console.error("❌ Error during password reset:", err);
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
      console.log("🟢 Loading state reset");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-md border border-white/20 shadow-xl mt-12">
      <CardHeader className="text-center pb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
          <KeyRound className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-800">
          Set New Password
        </CardTitle>
        <p className="text-gray-600 text-sm">
          Choose a secure new password for your account
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-medium">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-gray-700 font-medium"
            >
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {message && (
            <p
              className={`text-sm font-medium ${
                message.startsWith("✅") ? "text-green-600" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading || !sessionReady || message?.startsWith("✅")}
            className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold py-2 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
