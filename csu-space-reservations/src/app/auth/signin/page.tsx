import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SignInButton } from "./SignInButton"

export default async function SignInPage() {
  const session = await getServerSession(authOptions)
  if (session) redirect("/dashboard")

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-[#006633] px-8 py-6 text-center text-white">
          <div className="text-2xl font-bold tracking-wide">CHICAGO STATE UNIVERSITY</div>
          <div className="text-green-200 text-sm mt-1 font-medium">Office of Meetings &amp; Events</div>
          <div className="mt-3 text-base font-semibold">Space Reservation System</div>
        </div>

        <div className="px-8 py-8">
          <div className="text-center mb-6">
            <p className="text-gray-600 text-sm">
              Sign in with your CSU Microsoft account to access the space reservation system.
            </p>
          </div>

          <SignInButton />

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-400">
              Use your <span className="font-medium">@csu.edu</span> email address
            </p>
            <p className="text-xs text-gray-400 mt-1">
              For access issues, contact the Office of Meetings &amp; Events at (773) 821-2183
            </p>
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-3 text-center">
          <p className="text-xs text-gray-400">
            ONE EVENT · ONE DATE · ONE LOCATION per form
          </p>
        </div>
      </div>
    </div>
  )
}
