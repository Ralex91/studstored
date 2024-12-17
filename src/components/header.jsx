"use client"

import { useSession } from "@/features/auth/hooks/useSession"
import { LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

export default function Header() {
  const router = useRouter()
  const { session, signout } = useSession()

  return (
    <header className="bg-background p-2 border border-input outline-gray-800">
      <div className="mx-auto max-w-6xl flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Stud
          <span className="text-primary font-extrabold">Stored</span>
        </Link>

        <div className="space-x-2">
          <Link href="/admin">
            <Button variant="ghost">Admin</Button>
          </Link>
          <Link href="/admin/import">
            <Button variant="ghost">Import</Button>
          </Link>
        </div>

        {session ? (
          <Popover>
            <PopoverTrigger asChild>
              <p className="cursor-pointer">{session.name}</p>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-1">
              <Button variant="ghost" onClick={() => signout()}>
                Logout <LogOut />
              </Button>
            </PopoverContent>
          </Popover>
        ) : (
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </header>
  )
}
