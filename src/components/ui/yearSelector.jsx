"use client"
import { Label } from "@/components/ui/label"
import { useQuery } from "@tanstack/react-query"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function YearSelector({ yearId, setYearId }) {
  const {
    data: years,
    error: yearError,
    isLoading,
  } = useQuery({
    queryKey: ["years"],
    queryFn: async () => {
      const response = await fetch("/api/years")
      if (!response.ok) {
        throw new Error("Une erreur est survenue")
      }
      return response.json()
    },
  })

  return (
    <div>
      <Label htmlFor="yearId">Sélectionner l'année scolaire</Label>
      <Select id="yearId" value={yearId} onValueChange={setYearId}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner l'année scolaire" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {years?.map((year) => (
              <SelectItem key={year.id} value={year.id}>
                {year.year}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
