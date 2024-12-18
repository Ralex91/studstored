import * as z from "zod"

export const yearSchema = z.object({
  year: z.string().nonempty("L'année scolaire est requise"),
  isActive: z.boolean(),
})
