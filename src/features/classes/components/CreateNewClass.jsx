"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useCreateClass } from "../hooks/useCreateClass"
import { createClassSchema } from "../utils/schemas"
import ClassForm from "./forms/ClassForm"

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
        <ClassForm
          years={years}
          professors={professors}
          form={form}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}

export default CreateNewClass
