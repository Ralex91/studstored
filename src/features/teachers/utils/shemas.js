import * as z from "zod"

export const teacherSchema = z.object({
  lastName: z.string().nonempty("Le nom de famille est requis"),
  firstName: z.string().nonempty("Le prénom est requis"),
})
