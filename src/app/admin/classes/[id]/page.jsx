"use client"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "@/features/auth/hooks/useSession"
import RegistrationRow from "@/features/classes/components/RegistrationRow"
import { useClass } from "@/features/classes/hooks/useClass"
import { Role } from "@prisma/client"
import { Info } from "lucide-react"
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
            classData?.students.map((registration, index) => (
              <RegistrationRow key={index} registration={registration} />
            ))}
        </div>
      </div>
    </div>
  )
}

export default ClassPage
