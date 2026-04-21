import Link from "next/link"

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">Sign-in Error</h1>
        <p className="text-gray-600 text-sm mb-6">
          There was a problem signing you in. Make sure you are using your CSU Microsoft account.
        </p>
        <Link
          href="/auth/signin"
          className="inline-block bg-[#006633] text-white px-6 py-2 rounded-lg hover:bg-green-800 transition-colors"
        >
          Try Again
        </Link>
        <p className="text-xs text-gray-400 mt-4">
          Issues? Contact the Office of Meetings &amp; Events at (773) 821-2183
        </p>
      </div>
    </div>
  )
}
