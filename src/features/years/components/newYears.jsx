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
import { yearSchema } from "@/features/years/utils/schemas"

export default function NewYears({ setYearsList }) {
  const [error, setError] = useState(null)

  const form = useForm({
    defaultValues: {
      year: "",
      isActive: false,
    },
    resolver: zodResolver(yearSchema),
  })
  const { control, handleSubmit } = form

  const createYear = async (data) => {
    const response = await fetch("/api/years", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error("Erreur lors de la création de l'année scolaire")
    }
    return response.json()
  }

  const mutation = useMutation({
    mutationFn: createYear,
    onSuccess: (newYear) => {
      setError(null)
      setYearsList((prevYearsList) => [...prevYearsList, newYear])

      toast({
        title: "Année créée avec succès",
        description: `L'année ${newYear.year} a été ajoutée.`,
      })
    },
    onError: (error) => {
      setError(error.message || "Une erreur est survenue lors de la création.")

      toast({
        title: "Erreur",
        description:
          error.message || "Une erreur est survenue lors de la création.",
        variant: "destructive",
      })
    },
  })

  const onSubmit = (data) => {
    setError(null)
    mutation.mutate(data)
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Nouvelle année</CardTitle>
        <CardDescription>Créer une nouvelle année scolaire</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="year">Année scolaire</FormLabel>
                  <FormControl>
                    <Input id="year" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="isActive">Active</FormLabel>
                  <FormControl>
                    <Input id="isActive" type="checkbox" {...field} />
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
      </CardContent>
    </Card>
  )
}
