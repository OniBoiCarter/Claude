"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  if (!session) return null

  const role = session.user.role

  const links = [
    { href: "/dashboard", label: "Dashboard", roles: ["SUBMITTER", "ADVISOR", "DIRECTOR", "COORDINATOR", "POLICE", "ADMIN"] },
    { href: "/reservations/new", label: "New Request", roles: ["SUBMITTER", "ADMIN"] },
    { href: "/admin", label: "Admin", roles: ["ADMIN"] },
  ]

  return (
    <nav className="bg-[#006633] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="text-left">
                <div className="font-bold text-sm leading-tight">CHICAGO STATE UNIVERSITY</div>
                <div className="text-xs text-green-200 leading-tight">Office of Meetings &amp; Events</div>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {links
                .filter((l) => l.roles.includes(role))
                .map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname === link.href
                        ? "bg-green-800 text-white"
                        : "text-green-100 hover:bg-green-700"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium">{session.user.name}</div>
              <div className="text-xs text-green-200">{session.user.role.replace("_", " ")}</div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              className="text-sm text-green-200 hover:text-white transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
