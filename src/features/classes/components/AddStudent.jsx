"use client"

import { z } from "zod"

import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"

const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
]

const FormSchema = z.object({
  language: z.string({
    required_error: "Please select a language.",
  }),
})

const AddStudent = () => {
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [addStudents, setAddStudents] = useState([])

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  const searchStudents = async () => {
    const res = await fetch("/api/students?search=" + search)
    const data = await res.json()

    setSearchResults(data)
  }

  useEffect(() => {
    if (search) {
      searchStudents(search)
    }
  }, [search])

  return (
    <div>
      <Input
        value={search}
        onChange={handleSearch}
        placeholder="Select a language a"
      />
      {searchResults.map((student) => (
        <div className="flex" key={student.id}>
          <p>{student.firstName}</p>
          <p>{student.lastName}</p>
        </div>
      ))}
    </div>
  )
}

export default AddStudent
