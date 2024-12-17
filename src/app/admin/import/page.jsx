"use client"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select"

export default function Import() {
  const [file, setFile] = useState(null)
  const [error, setError] = useState("")
  const [importType, setImportType] = useState("students_teachers")
  const [statusMessage, setStatusMessage] = useState("")

  const mutation = useMutation({
    mutationFn: async (fileData) => {
      const formData = new FormData()
      formData.append("file", fileData)
      formData.append("importType", importType)

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
    onSuccess: () => {
      setStatusMessage("Fichier envoyé avec succès !")
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

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="file">Importer des élèves, enseignants</Label>
        <Input id="file" type="file" onChange={handleFileChange} />
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div>
          <Label htmlFor="importType">Sélectionner le type d'importation</Label>
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
                <SelectItem value="students">Uniquement les élèves</SelectItem>
                <SelectItem value="teachers">
                  Uniquement les enseignants
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {file && (
          <Button onClick={handleUpload} disabled={mutation.isLoading}>
            {mutation.isLoading ? "Envoi en cours..." : "Envoyer le fichier"}
          </Button>
        )}

        {statusMessage && (
          <p className="text-green-500 text-sm mt-2">{statusMessage}</p>
        )}
      </div>
    </div>
  )
}
