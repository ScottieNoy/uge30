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
  description: "Klassement for UGE 30",
  icons: {
    icon: "/android/android-launchericon-192-192.png",
    apple: "/ios/180.png",
    shortcut: "/android/android-launchericon-192-192.png",
  },
  appleWebApp: {
    capable: true,
    title: "UGE 30",
    statusBarStyle: "default",
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
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash/apple-splash-1170x2532.png"
          media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash/apple-splash-1284x2778.png"
          media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash/apple-splash-828x1792.png"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash/apple-splash-1125x2436.png"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash/apple-splash-1242x2688.png"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)"
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
