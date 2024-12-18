"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import NewUser from "@/features/users/components/newUser"
import { useState } from "react"

export default function CreateNewUser({ setUsersList }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Créer un nouvel utilisateur</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
        </DialogHeader>
        <NewUser
          setUsersList={setUsersList}
          onSubmitValid={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
