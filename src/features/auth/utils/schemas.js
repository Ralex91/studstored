import * as z from "zod"

export const loginSchema = z.object({
  username: z.string().nonempty("Le nom d'utilisateur est requis"),
  password: z.string().nonempty("Le mot de passe est requis"),
})
