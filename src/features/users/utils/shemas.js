import * as z from "zod"

export const userSchema = z.object({
  name: z.string().nonempty("Le nom est requis"),
  username: z.string().regex(/^edu_[a-zA-Z0-9]{4,}$/, {
    message:
      "Le nom d'utilisateur doit commencer par edu_ et contenir au moins 4 caractères",
  }),
  role: z.string().nonempty("Le rôle est requis"),
})
