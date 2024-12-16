import { useEffect, useState } from "react"

export function useSession() {
  const [session, setSession] = useState(null)

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
  }, [])

  return { session }
}
