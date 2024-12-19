"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import NewTeacher from "@/features/teachers/components/newTeacher"
import { useState } from "react"

export default function CreateNewTeacher({ setTeachersList }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Créer un nouveau professeur</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un nouveau professeur</DialogTitle>
        </DialogHeader>
        <NewTeacher
          setTeachersList={setTeachersList}
          onSubmitValid={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
