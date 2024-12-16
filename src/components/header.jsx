import Link from "next/link"

export default function Header() {
  return (
    <header className="bg-blue-500 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-3xl font-bold">StudStored</h1>

        <div className="space-x-4">
          <Link
            href="/admin"
            className="text-white hover:text-gray-300 transition-colors"
          >
            Admin
          </Link>
          <Link
            href="/admin/import"
            className="text-white hover:text-gray-300 transition-colors"
          >
            Import
          </Link>
        </div>

        <div>
          <Link
            href="/auth/login"
            className="text-white hover:text-gray-300 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  )
}
