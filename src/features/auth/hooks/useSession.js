"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useSessionStore } from "../stores/useSessionStore"

export function useSession() {
  const { session, setSession } = useSessionStore()
  const router = useRouter()

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/session")

        if (!res.ok) {
          setSession(null)
          return
        }

        const data = await res.json()
        setSession(data)
      } catch (err) {
        setSession(null)
      }
    }

    fetchSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const signin = async (credentials) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      })

      const data = await res.json()

      if (data.error) {
        return {
          error: data.error,
        }
      }

      setSession(data)

      return {
        session: data,
      }
    } catch (err) {
      console.error("Erreur lors de la connexion", err)
      setSession(null)
    }
  }

  const signout = async () => {
    const res = await fetch("/api/auth/logout", {
      method: "GET",
    })

    if (!res.ok) {
      console.error("Erreur lors de la déconnexion")
      return
    }

    setSession(null)
    router.push("/")
  }

  return { session, signin, signout }
}
