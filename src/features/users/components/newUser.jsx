"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { userSchema } from "@/features/users/utils/shemas"

export default function NewUser({ setUsersList, onSubmitValid }) {
  const [error, setError] = useState(null)

  const form = useForm({
    defaultValues: {
      username: "edu_",
      name: "",
      role: "PROFESSOR",
    },
    resolver: zodResolver(userSchema),
  })
  const { control, handleSubmit } = form

  const createUser = async (data) => {
    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error("Erreur lors de la création de l'utilisateur")
    }
    return response.json()
  }

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: (newUser) => {
      setError(null)
      setUsersList((prevUsersList) => [...prevUsersList, newUser])
      toast({
        title: "Utilisateur créé avec succès",
        description: `L'utilisateur ${newUser.username} a été ajouté. Veuillez noter le mot de passe généré: ${newUser.password} et le fournir à l'utilisateur. Il ne sera pas possible de le récupérer ultérieurement.`,
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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="username">Nom d'utilisateur</FormLabel>
              <FormControl>
                <Input id="username" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="name">Nom</FormLabel>
              <FormControl>
                <Input id="name" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="role">Rôle</FormLabel>
              <FormControl>
                <select
                  id="role"
                  {...field}
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="MAYOR">MAYOR</option>
                  <option value="DIRECTOR">DIRECTOR</option>
                  <option value="PROFESSOR">PROFESSOR</option>
                </select>
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
