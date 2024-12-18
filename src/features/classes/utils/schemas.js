import * as z from "zod"

export const createClassSchema = z.object({
  name: z.string().nonempty("Le nom de la classe est requis"),
  schoolYearId: z.string().nonempty("L'année scolaire est requise"),
  professorId: z.string().nonempty("Le professeur est requis"),
})
