// app/layout.tsx
import "./globals.css";
import NotificationManager from "../components/NotificationManager";
import Navbar from "../components/Navbar";
import PwaInit from "../components/PwaInit";
import SplashScreen from "@/components/SplashScreen";
import { Toaster } from "@/components/ui/sonner";
import { createClient } from "@/lib/supabaseServer";
import NotificationGate from "@/components/NotificationGate";

export const metadata = {
  title: "UGE 30",
  description: "Classement for UGE 30",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  let userData = null;

  if (session?.user) {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user.id)
      .single();

    userData = data;
  }

  return (
    <html lang="da">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/Uge30Blaa.png" />
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
        <PwaInit />
        {/* <NotificationManager /> */}
        <NotificationGate />
        <Navbar session={session} userData={userData} />
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
