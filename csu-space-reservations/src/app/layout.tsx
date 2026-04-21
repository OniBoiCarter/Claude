import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Providers } from "@/components/Providers"
import { Navbar } from "@/components/Navbar"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CSU Space Reservations – Office of Meetings & Events",
  description: "Chicago State University space reservation and room scheduling system",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" className={geist.className}>
      <body className="min-h-screen bg-gray-50 flex flex-col">
        <Providers session={session}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="bg-gray-800 text-gray-400 text-xs text-center py-3">
            Chicago State University · Office of Meetings &amp; Events · 9501 South King Drive, Room 2304 · (773) 821-2183
          </footer>
        </Providers>
      </body>
    </html>
  )
}
