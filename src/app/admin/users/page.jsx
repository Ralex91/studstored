"use client"

import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import UsersList from "@/features/users/components/usersList"
import NewUser from "@/features/users/components/newUser"
import CreateNewUser from "@/features/users/components/createNewUser"

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

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl mb-4 font-semibold">Liste des utilisateurs</h1>
        <CreateNewUser setUsersList={setUsersList} />
      </div>
      <UsersList users={usersList} />
    </div>
  )
}
