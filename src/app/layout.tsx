// app/layout.tsx
import "./globals.css"
import Navbar from "./components/Navbar"
import PwaInit from "./components/PwaInit"

export const metadata = {
  title: "UGE 30",
  description: "Classement for UGE 30",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/Uge30Blaa.png" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      </head>
      <body className="bg-gradient-to-b from-yellow-50 to-pink-100 min-h-screen text-gray-800 font-sans">
        <PwaInit />
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-6 space-y-8">
          {children}
        </main>
      </body>
    </html>
  )
}
