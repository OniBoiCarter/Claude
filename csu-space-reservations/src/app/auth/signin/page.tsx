import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SignInButton } from "./SignInButton"
import { DemoLoginForm } from "./DemoLoginForm"

export default async function SignInPage() {
  const session = await getServerSession(authOptions)
  if (session) redirect("/dashboard")

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#006633] px-8 py-6 text-center text-white">
          <div className="text-2xl font-bold tracking-wide">CHICAGO STATE UNIVERSITY</div>
          <div className="text-green-200 text-sm mt-1 font-medium">Office of Meetings &amp; Events</div>
          <div className="mt-3 text-base font-semibold">Space Reservation System</div>
        </div>

        <div className="px-8 py-6">
          {/* Microsoft login */}
          <p className="text-gray-600 text-sm text-center mb-4">
            Sign in with your CSU Microsoft account:
          </p>
          <SignInButton />

          {/* Demo divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Demo Accounts</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Demo accounts */}
          <p className="text-xs text-gray-500 text-center mb-4">
            Click any role below to instantly sign in and explore that workflow:
          </p>
          <DemoLoginForm />
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
