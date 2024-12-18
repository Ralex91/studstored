import { useMutation } from "@tanstack/react-query"

export const useCreateClass = () =>
  useMutation({
    mutationFn: async (data) => {
      const response = await fetch("/api/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error("Une erreur est survenue")
      }
      return response.json()
    },
  })
