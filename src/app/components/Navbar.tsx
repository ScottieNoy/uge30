'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const sessionUser = data.session?.user
      setLoggedIn(!!sessionUser)

      if (sessionUser) {
        const { data: userProfile } = await supabase
          .from("users")
          .select("is_admin")
          .eq("id", sessionUser.id)
          .single()

        setIsAdmin(userProfile?.is_admin || false)
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setLoggedIn(!!session)
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setLoggedIn(false)
    router.push("/")
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <img
            src="/uge30-logo.png"
            alt="UGE 30 Logo"
            className="h-10 sm:h-12 w-auto"
          />
        </Link>

        {/* Hamburger toggle (mobile only) */}
        <button
          className="sm:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop nav */}
        <div className="hidden sm:flex gap-2 items-center">
          <NavItem href="/" label="Klassement" />
          <NavItem href="/jerseys" label="Trøjer" />
          <NavItem href="/my" label="Min side" />
          {isAdmin && (
            <>
              <NavItem href="/add-points" label="Add Points" subtle />
              <NavItem href="/jerseys/edit" label="Rediger Jerseys" subtle />
            </>
          )}
          {loggedIn ? (
            <button
              onClick={handleLogout}
              className="text-sm px-4 py-1 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
            >
              Log ud
            </button>
          ) : (
            <NavItem href="/login" label="Login" />
          )}
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <div className="sm:hidden flex flex-col gap-2 px-6 pb-4">
          <NavItem href="/" label="Klassement" onClick={closeMenu} />
          <NavItem href="/jerseys" label="Trøjer" onClick={closeMenu} />
          <NavItem href="/my" label="Min side" onClick={closeMenu} />
          {isAdmin && (
            <>
              <NavItem href="/add-points" label="Add Points" subtle onClick={closeMenu} />
              <NavItem href="/jerseys/edit" label="Rediger Jerseys" subtle onClick={closeMenu} />
            </>
          )}
          {loggedIn ? (
            <button
              onClick={() => {
                handleLogout()
                closeMenu()
              }}
              className="text-sm px-4 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition text-left"
            >
              Log ud
            </button>
          ) : (
            <NavItem href="/login" label="Login" onClick={closeMenu} />
          )}
        </div>
      )}
    </nav>
  )
}

function NavItem({
  href,
  label,
  subtle = false,
  onClick,
}: {
  href: string
  label: string
  subtle?: boolean
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`text-sm px-4 py-2 rounded-full transition block ${
        subtle
          ? 'text-gray-400 hover:text-gray-600'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {label}
    </Link>
  )
}
