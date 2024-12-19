"use client"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { toast } from "@/components/hooks/use-toast"
import { studentSchema } from "@/features/students/utils/shemas"

export default function NewStudent({ setStudentsList, onSubmitValid }) {
  const [error, setError] = useState(null)

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
    },
    resolver: zodResolver(studentSchema),
  })
  const { control, handleSubmit } = form

  const createStudent = async (data) => {
    const response = await fetch("/api/admin/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error("Erreur lors de la création de l'étudiant")
    }
    return response.json()
  }

  const mutation = useMutation({
    mutationFn: createStudent,
    onSuccess: (newStudent) => {
      setError(null)
      setStudentsList((prevStudentsList) => [...prevStudentsList, newStudent])
      console.log("newStudent", newStudent)
      toast({
        title: "Étudiant créé avec succès",
        description: `L'étudiant ${newStudent.firstName} ${newStudent.lastName} a été ajouté.`,
      })
      onSubmitValid()
    },
    onError: (error) => {
      const message =
        error.message || "Une erreur est survenue lors de la création."
      setError(message)

      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      })
    },
  })

  const onSubmit = (data) => {
    setError(null)
    mutation.mutate(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="firstName">Prénom</FormLabel>
              <FormControl>
                <Input id="firstName" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="lastName">Nom</FormLabel>
              <FormControl>
                <Input id="lastName" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <p className="text-destructive">{error}</p>}
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={mutation.isLoading}>
            {mutation.isLoading ? "Création en cours..." : "Créer"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
