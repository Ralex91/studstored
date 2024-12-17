import Link from "next/link"
import { Button } from "./ui/button"

export default function Header() {
  return (
    <header className="bg-background p-2 border border-input outline-gray-800">
      <div className="container mx-auto max-w-6xl flex justify-between items-center">
        <h1 className="text-xl font-bold">
          Stud
          <span className="text-primary italic font-black">Stored</span>
        </h1>

        <div className="space-x-2">
          <Link href="/admin">
            <Button variant="ghost">Admin</Button>
          </Link>
          <Link href="/admin/import">
            <Button variant="ghost">Import</Button>
          </Link>
        </div>

        <div>
          <Link
            href="/auth/login"
            className="text-white hover:text-gray-300 transition-colors"
          >
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
