"use client"

import { useSession } from "@/features/auth/hooks/useSession"
import { LogOut, User } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

export default function Header() {
  const { session, signout } = useSession()

  return (
    <header className="bg-background p-2 border border-input outline-gray-800">
      <div className="mx-auto max-w-6xl flex justify-between items-center">
        <Link
          href="/"
          className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-800"
        >
          StudStored
        </Link>

        <div className="space-x-2">
          <Link href="/admin">
            <Button variant="ghost">Admin</Button>
          </Link>
          <Link href="/admin/classes">
            <Button variant="ghost">Classes</Button>
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
            <Button>
              Se connecter <User />
            </Button>
          </Link>
        )}
      </div>
    </header>
  )
}
