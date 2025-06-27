// app/layout.tsx
import "./globals.css";
import NotificationManager from "../components/NotificationManager";
import Navbar from "../components/Navbar";
import PwaInit from "../components/PwaInit";
import SplashScreen from "@/components/SplashScreen";

export const metadata = {
  title: "UGE 30",
  description: "Classement for UGE 30",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="da">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/Uge30Blaa.png" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900">
        <PwaInit />
        <NotificationManager />
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
