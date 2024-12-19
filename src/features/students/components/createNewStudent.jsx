"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import NewStudent from "@/features/students/components/newStudent"
import { useState } from "react"

export default function CreateNewStudent({ setStudentsList }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Créer un nouvel étudiant</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un nouvel étudiant</DialogTitle>
        </DialogHeader>
        <NewStudent
          setStudentsList={setStudentsList}
          onSubmitValid={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
