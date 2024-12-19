"use client"

import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import TeachersList from "@/features/teachers/components/teachersList"
import CreateNewTeacher from "@/features/teachers/components/createNewTeacher"

export default function Teachers() {
  const {
    data: initialTeachersList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      const response = await fetch("/api/admin/teachers")
      if (!response.ok) {
        throw new Error("Failed to fetch teachers")
      }
      return response.json()
    },
  })

  const [teachersList, setTeachersList] = useState()

  useEffect(() => {
    if (initialTeachersList) {
      setTeachersList(initialTeachersList)
    }
  }, [initialTeachersList])

  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl mb-4 font-semibold">Liste des professeurs</h1>
        <CreateNewTeacher setTeachersList={setTeachersList} />
      </div>
      <TeachersList teachers={teachersList} />
    </div>
  )
}
