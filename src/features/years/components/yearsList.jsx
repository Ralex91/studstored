"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function YearsList({ yearsList, setYearsList }) {
  const toggleYearActiveState = async (yearId, isActive) => {
    try {
      const response = await fetch(`/api/years/${yearId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !isActive }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de l'année scolaire")
      }

      const updatedYear = await response.json()

      setYearsList((prevYears) =>
        prevYears.map((year) =>
          year.id === yearId ? { ...year, active: updatedYear.isActive } : year
        )
      )

      toast({
        title: "Mise à jour réussie",
        description: `L'année ${updatedYear.year} est maintenant ${
          updatedYear.isActive ? "active" : "cloturée"
        }.`,
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Liste des années scolaires</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {yearsList.map((year) => (
            <li
              key={year.id}
              className="flex items-center justify-between p-4 border rounded"
            >
              <div className="mr-10">
                <h3 className="text-lg font-semibold">{year.year}</h3>
                <p className="text-sm text-muted-foreground">
                  {year.isActive ? "Active" : "cloturée"}
                </p>
              </div>
              {year.isActive && (
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={() =>
                      toggleYearActiveState(year.id, year.isActive)
                    }
                  >
                    Cloturer
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
