"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "@/features/auth/hooks/useSession"
import { useClass } from "@/features/classes/hooks/useClass"
import { Role } from "@prisma/client"
import { Ellipsis, Info, RotateCcw, Trash2 } from "lucide-react"
import { use } from "react"

const ClassPage = ({ params }) => {
  const paramsList = use(params)
  const classId = paramsList.id
  const { session } = useSession()
  const { data: classData, isLoading } = useClass(classId)

  return (
    <div className="flex flex-1 flex-col md:flex-row gap-4">
      <div className="md:flex-[0.5] pr-4 relative">
        <div className="sticky top-2 left-0 flex flex-col gap-4">
          <Card className="p-4 space-y-2">
            <h2 className="text-lg font-semibold mb-2 flex gap-2 items-center">
              <Info className="w-5 h-5" /> Informations de la classe
            </h2>
            <div>
              <p className="text-sm text-muted-foreground">Classe:</p>
              {isLoading ? (
                <Skeleton className="h-7" />
              ) : (
                <h2 className="text-2xl font-semibold mb-2">
                  {classData?.name}
                </h2>
              )}
            </div>

            <div>
              <p className="text-sm text-muted-foreground ">Professeur:</p>
              {isLoading ? (
                <Skeleton className="h-6 w-1/2" />
              ) : (
                <h2 className="text-xl font-semibold">
                  {classData?.professor.firstName}{" "}
                  {classData?.professor.lastName}
                </h2>
              )}
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Année:</p>
              {isLoading ? (
                <Skeleton className="h-6 w-1/2" />
              ) : (
                <h2 className="text-xl font-semibold">
                  {classData?.schoolYear.year}
                </h2>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Nombre d&apos;étudiants:
              </p>
              {isLoading ? (
                <Skeleton className="h-6 w-1/2" />
              ) : (
                <h2 className="text-xl font-semibold">
                  {classData?.students.length}
                </h2>
              )}
            </div>
          </Card>
          {session && [Role.ADMIN, Role.DIRECTOR].includes(session.role) && (
            <Card className="sticky top-2 left-0 p-4 space-y-2">
              <h2 className="text-lg font-semibold mb-2 flex gap-2 items-center">
                Ajouter un étudiant
              </h2>
              <p className="text-sm text-muted-foreground">
                Ajoutez un nouvel étudiant à la classe.
              </p>
            </Card>
          )}
        </div>
      </div>
      <div className="md:flex-1">
        <h2 className="text-2xl font-semibold mb-2">Liste des étudiants</h2>
        <div className="flex flex-col gap-2">
          {isLoading &&
            Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} className="h-10 rounded-lg" />
            ))}

          {!isLoading &&
            classData?.students.map((registration, index) => {
              const student = registration.student
              return (
                <Card
                  key={index}
                  className="px-4 py-2 grid grid-cols-[1fr_1fr_auto] items-center group hover:bg-accent/20"
                >
                  <p>
                    {student.firstName} {student.lastName}
                  </p>
                  <div>
                    <Badge
                      variant={
                        registration.redoubler ? "destructive" : "secondary"
                      }
                    >
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
                        {registration.redoubler
                          ? "Ne redouble plus"
                          : "Redoubler"}
                      </DropdownMenuItem>
                      {session &&
                        [Role.ADMIN, Role.DIRECTOR].includes(session?.role) && (
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 />
                            Supprimer
                          </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Card>
              )
            })}
        </div>
      </div>
    </div>
  )
}

export default ClassPage
