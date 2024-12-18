"use client"

import NewYears from "@/features/years/components/newYears"
import YearsList from "@/features/years/components/yearsList"
import { useQuery } from "@tanstack/react-query"

export default function YearsPage() {
  const {
    data: yearsList = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["years"],
    queryFn: async () => {
      const response = await fetch("/api/years")
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des années scolaires")
      }
      return response.json()
    },
    initialData: [],
  })

  if (isLoading) {
    return <div>Chargement...</div>
  }

  return (
    <div className="flex mt-28 justify-center min-h-screen space-x-8">
      <div>
        {!yearsList?.find((year) => year.isActive === true) && (
          <NewYears setYearsList={refetch} />
        )}
      </div>
      <div>
        <YearsList yearsList={yearsList} setYearsList={refetch} />
      </div>
    </div>
  )
}
