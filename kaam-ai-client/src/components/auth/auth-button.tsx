                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      "use client"

import { signIn, signOut, useSession } from "next-auth/react"

export default function AuthButton() {
  const { data: session, status } = useSession()

  if (status === "loading") return <p>Loading...</p>

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <p>Signed in as {session.user?.email}</p>
        <button 
          onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Sign out
        </button>
      </div>
    )
  }
  
  return (
    <div className="flex gap-4">
      <button 
        onClick={() => signIn("google")}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Sign in with Google
      </button>
      <button 
        onClick={() => signIn("github")}
        className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
      >
        Sign in with GitHub
      </button>
    </div>
  )
}