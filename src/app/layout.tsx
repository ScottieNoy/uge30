// app/layout.tsx
import "./globals.css";
import Navbar from "../components/Navbar";
import PwaInit from "../components/PwaInit";
import SplashScreen from "@/components/SplashScreen";
import { Toaster } from "@/components/ui/sonner";
import { createClient } from "@/lib/supabaseServer";
import NotificationGate from "@/components/NotificationGate";
import ClientRoot from "@/components/ClientRoot";
import { AuthProvider } from "@/hooks/useAuth";

export const metadata = {
  title: "UGE 30",
  description: "Classement for UGE 30",
  icons: {
    icon: "/uge30gul-192.jpg",
    apple: "/uge30gul-180.png",
    shortcut: "/uge30gul-192.jpg",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="da">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/uge30gul-180.png" />
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no"
        />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900">
        <AuthProvider>
          <PwaInit />
          {/* <NotificationManager /> */}
          <NotificationGate />
          <Navbar />
          <ClientRoot />

          <main>{children}</main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}