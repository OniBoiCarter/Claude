"use client"

import { signIn } from "next-auth/react"

export function SignInButton() {
  return (
    <button
      onClick={() => signIn("azure-ad", { callbackUrl: "/dashboard" })}
      className="w-full flex items-center justify-center gap-3 bg-[#0078d4] hover:bg-[#106ebe] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
    >
      <svg width="20" height="20" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 0H0V11H11V0Z" fill="#F3F3F3"/>
        <path d="M23 0H12V11H23V0Z" fill="#F3F3F3"/>
        <path d="M11 12H0V23H11V12Z" fill="#F3F3F3"/>
        <path d="M23 12H12V23H23V12Z" fill="#F3F3F3"/>
        <path d="M10 1H1V10H10V1Z" fill="#F25022"/>
        <path d="M22 1H13V10H22V1Z" fill="#7FBA00"/>
        <path d="M10 13H1V22H10V13Z" fill="#00A4EF"/>
        <path d="M22 13H13V22H22V13Z" fill="#FFB900"/>
      </svg>
      Sign in with Microsoft
    </button>
  )
}
