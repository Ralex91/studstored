"use client"

import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import StudentsList from "@/features/students/components/studentsList"
import CreateNewStudent from "@/features/students/components/createNewStudent"

export default function Students() {
  const {
    data: initialStudentsList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const response = await fetch("/api/admin/students")
      if (!response.ok) {
        throw new Error("Failed to fetch students")
      }
      return response.json()
    },
  })

  const [studentsList, setStudentsList] = useState()

  useEffect(() => {
    if (initialStudentsList) {
      setStudentsList(initialStudentsList)
    }
  }, [initialStudentsList])

  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl mb-4 font-semibold">Liste des étudiants</h1>
        <CreateNewStudent setStudentsList={setStudentsList} />
      </div>
      <StudentsList students={studentsList} />
    </div>
  )
}
