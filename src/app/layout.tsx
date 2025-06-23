// app/layout.tsx
import "./globals.css"
import Navbar from "./components/Navbar"

export const metadata = {
  title: "UGE 30",
  description: "Classement for UGE 30",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
