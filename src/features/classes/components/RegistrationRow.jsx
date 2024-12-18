import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSessionStore } from "@/features/auth/stores/useSessionStore"
import { Role } from "@prisma/client"
import { Ellipsis, RotateCcw, Trash2 } from "lucide-react"

const RegistrationRow = ({ registration }) => {
  const { session } = useSessionStore()
  const student = registration.student

  return (
    <Card className="px-4 py-2 grid grid-cols-[1fr_1fr_auto] items-center group hover:bg-accent/20">
      <p>
        {student.firstName} {student.lastName}
      </p>
      <div>
        <Badge variant={registration.redoubler ? "destructive" : "secondary"}>
          {registration.redoubler ? "Redouble" : "Passe l'année"}
        </Badge>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          <Ellipsis className="w-5 h-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <RotateCcw />
            {registration.redoubler ? "Ne redouble plus" : "Redoubler"}
          </DropdownMenuItem>
          {session && [Role.ADMIN, Role.DIRECTOR].includes(session?.role) && (
            <DropdownMenuItem className="text-destructive">
              <Trash2 />
              Supprimer
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  )
}

export default RegistrationRow
