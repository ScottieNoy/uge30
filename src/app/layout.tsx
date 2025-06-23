// app/layout.tsx
import "./globals.css"
import Navbar from "./components/Navbar"

export const metadata = {
  title: "UGE 30",
  description: "Classement for UGE 30",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da">
      <body className="bg-gradient-to-b from-yellow-50 to-pink-100 min-h-screen text-gray-800 font-sans">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-6 space-y-8">
          {children}
        </main>
      </body>
    </html>
  )
}
