"use client"

import { useEffect } from "react"
import { useSessionStore } from "../stores/useSessionStore"

export function useSession() {
  const { session, setSession } = useSessionStore()

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

  const signout = () => {
    setSession(null)
  }

  return { session, signin, signout }
}
