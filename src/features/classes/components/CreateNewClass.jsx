"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useCreateClass } from "../hooks/useCreateClass"
import { createClassSchema } from "../utils/schemas"

const CreateNewClass = ({ years, professors }) => {
  const router = useRouter()
  const { mutate: createClass, data, isSuccess, error } = useCreateClass()
  const form = useForm({
    defaultValues: {
      name: "",
      schoolYearId: "",
      professorId: "",
    },
    resolver: zodResolver(createClassSchema),
  })

  const { control, handleSubmit } = form

  useEffect(() => {
    if (isSuccess) {
      router.push(`/admin/classes/${data.id}`)
    }
  }, [isSuccess])

  const onSubmit = (data) => createClass(data)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Créer une nouvelle classe</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer une nouvelle classe</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de la classe</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="schoolYearId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Annee scolaire</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectionner une annee scolaire" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year.id} value={year.id}>
                          {year.year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="professorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professeur</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectionner un professeur" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {professors.map((professor) => (
                        <SelectItem key={professor.id} value={professor.id}>
                          {professor.firstName} {professor.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <p className="text-destructive">{error}</p>

            <div className="flex justify-end pt-4">
              <Button type="submit">Créer la classe</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateNewClass
