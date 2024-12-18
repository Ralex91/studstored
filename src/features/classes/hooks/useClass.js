import { useQuery } from "@tanstack/react-query"

export const useClass = (id) =>
  useQuery({
    queryKey: ["classes", id],
    queryFn: async () => {
      const response = await fetch(`/api/classes/${id}`)
      if (!response.ok) {
        throw new Error("Une erreur est survenue")
      }
      return response.json()
    },
  })
