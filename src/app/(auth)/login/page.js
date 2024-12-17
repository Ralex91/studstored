"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useSession } from "@/features/auth/hooks/useSession"
import { loginSchema } from "@/features/auth/utils/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"

const LoginPage = () => {
  const router = useRouter()
  const { signin } = useSession()
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  })

  const [error, setError] = useState(null)

  const { control, handleSubmit } = form

  const onSubmit = async (data) => {
    setError(null)

    const { error } = await signin({
      username: data.username,
      password: data.password,
    })

    if (error) {
      setError(error)

      return
    }

    router.push("/")
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
        <CardDescription>Connectez-vous à votre compte</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom d&apos;utilisateur</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <p className="text-destructive">{error}</p>

            <div className="flex justify-end pt-4">
              <Button type="submit">Connexion</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default LoginPage
