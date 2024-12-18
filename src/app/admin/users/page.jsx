"use client"

import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import UsersList from "@/features/users/components/usersList"
import NewUser from "@/features/users/components/newUser"

export default function Users() {
  const {
    data: initialUsersList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("/api/admin/users")
      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }
      return response.json()
    },
  })

  const [usersList, setUsersList] = useState()

  useEffect(() => {
    if (initialUsersList) {
      setUsersList(initialUsersList)
    }
  }, [initialUsersList])

  if (error) return <div>Error: {error.message}</div>
  if (isLoading) return <div>Loading...</div>

  return (
    <div className="w-full flex justify-center items-center space-x-40 mt-12">
      <NewUser setUsersList={setUsersList} />
      {usersList?.length > 0 && <UsersList users={usersList} />}
    </div>
  )
}
