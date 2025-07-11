"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Mail, X } from "lucide-react";
import { createClient } from "@/lib/supabaseClient";
import { toast } from "sonner"; // or from "react-hot-toast" depending on your setup

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal = ({ isOpen, onClose }: ForgotPasswordModalProps) => {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const FRONTEND_URL =
      process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${FRONTEND_URL}/update-password`,
    });

    if (error) {
      toast.error(`Fejl: ${error.message}`);
    } else {
      toast.success("🔗 E-mail sendt! Tjek din indbakke.");
      setEmail(""); // Optionally reset field
      onClose(); // Optionally close modal after success
    }

    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-full p-0 bg-transparent border-0 shadow-none">
        <DialogTitle className="sr-only">Glemt Kodeord</DialogTitle>

        {/* Top-right close button */}
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute right-2 -top-16 z-50 h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
        >
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </Button>

        <Card className="w-full bg-white/95 backdrop-blur-md border border-white/20 shadow-xl relative">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Glemt Kodeord
            </CardTitle>
            <p className="text-gray-600 text-sm">
              Vi sender dig et link til at nulstille dit kodeord.
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email
                </Label>
                <Input
                textColor="black"
                  id="email"
                  type="email"
                  placeholder="Indtast din email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-2 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                {loading ? "Sender..." : "Send Reset Link"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Bottom-close fallback */}
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-50 h-10 w-10 rounded-full bg-white/20 backdrop-blur border border-white/30 text-white hover:bg-white/30"
        >
          <X className="h-5 w-5" />
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordModal;
