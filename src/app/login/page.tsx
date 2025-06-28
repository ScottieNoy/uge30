"use client";
import { useState } from "react";
import AuthModal from "@/components/AuthModal";

export default function LoginPage() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-pink-500">
      <button
        onClick={handleOpen}
        className="px-6 py-3 text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
      >
        Open Login Modal
      </button>
      <AuthModal isOpen={isOpen} onClose={handleClose} />
    </div>
  );
}
