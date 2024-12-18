import { useQuery } from "@tanstack/react-query"

export const useClasses = () =>
  useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const response = await fetch("/api/classes")
      if (!response.ok) {
        throw new Error("Une erreur est survenue")
      }
      return response.json()
    },
  })
