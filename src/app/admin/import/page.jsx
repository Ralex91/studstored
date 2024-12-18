"use client"
import { NewStudentsList } from "@/features/import/components/newStudentsList"
import { NewTeachersList } from "@/features/import/components/newTeachersList"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import YearSelector from "@/features/import/components/yearSelector"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"

export default function Import() {
  const [file, setFile] = useState(null)
  const [error, setError] = useState("")
  const [importType, setImportType] = useState("students_teachers")
  const [yearId, setYearId] = useState(null)
  const [statusMessage, setStatusMessage] = useState("")
  const [students, setStudents] = useState([])
  const [teachers, setTeachers] = useState([])

  const mutation = useMutation({
    mutationFn: async (fileData) => {
      const formData = new FormData()
      formData.append("file", fileData)
      formData.append("importType", importType)
      formData.append("yearId", yearId)

      console.log("formData", formData)
      const response = await fetch("/api/admin/import", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("L'upload a échoué")
      }
      return response.json()
    },
    onSuccess: (response) => {
      setStatusMessage("Fichier envoyé avec succès !")
      setTeachers(response.createdProfessors)
      setStudents(response.createdStudents)
      setFile(null)
      setError("")
    },
    onError: (err) => {
      setError(err.message || "Erreur inconnue lors de l'envoi")
      setStatusMessage("")
    },
  })

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]

    if (
      selectedFile &&
      (selectedFile.type === "application/vnd.ms-excel" ||
        selectedFile.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        selectedFile.type === "text/csv" ||
        selectedFile.name.endsWith(".csv"))
    ) {
      setFile(selectedFile)
      setError("")
      setStatusMessage("")
    } else {
      setFile(null)
      setError(
        "Veuillez sélectionner un fichier Excel ou CSV valide (extensions .xls, .xlsx, .csv)"
      )
      setStatusMessage("")
    }
  }

  const handleUpload = () => {
    if (file) {
      mutation.mutate(file)
    }
  }

  const handleReset = () => {
    setFile(null)
    setError("")
    setStatusMessage("")
    setTeachers([])
    setStudents([])
  }

  return (
    <div className="flex justify-center items-center">
      <div>
        {(teachers.length < 1 || students.length < 1) && (
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="file">Importer des élèves, enseignants</Label>
            <Input id="file" type="file" onChange={handleFileChange} />
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div>
              <Label htmlFor="importType">
                Sélectionner le type d'importation
              </Label>
              <Select
                id="importType"
                value={importType}
                onValueChange={setImportType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type d'importation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="students_teachers">
                      Les élèves et les enseignants
                    </SelectItem>
                    <SelectItem value="students">
                      Uniquement les élèves
                    </SelectItem>
                    <SelectItem value="teachers">
                      Uniquement les enseignants
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <YearSelector yearId={yearId} setYearId={setYearId} />

            {file && yearId && (
              <Button onClick={handleUpload} disabled={mutation.isPending}>
                {mutation.isPending
                  ? "Envoi en cours..."
                  : "Envoyer le fichier"}
              </Button>
            )}

            {statusMessage && (
              <p className="text-green-500 text-sm mt-2">{statusMessage}</p>
            )}
          </div>
        )}
      </div>
      <div className="mt-10">
        <div className="text-center">
          {(teachers.length > 0 || students.length > 0) && (
            <Button onClick={handleReset}>
              Recommençer une nouvelle importation
            </Button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            {teachers.length > 0 && <NewTeachersList teachers={teachers} />}
          </div>
          <div>
            {students.length > 0 && <NewStudentsList students={students} />}
          </div>
        </div>
      </div>
    </div>
  )
}
