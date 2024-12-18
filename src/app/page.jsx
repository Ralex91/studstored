import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900">
      <div className="text-center space-y-6">
        <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
          Bienvenue sur StudStored
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Simplifiez la gestion de vos étudiants avec une interface intuitive et
          des outils modernes pour faire l&apos;appel en ligne.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link href="/login">
          <Button className="px-6 py-3 rounded-lg bg-gradient-to-r via-purple-500 from-blue-600 to-pink-500 text-white text-lg font-medium shadow-lg transition-all">
            Se connecter
          </Button>
        </Link>
      </div>

      <div className="mt-16 text-sm text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} StudStored. Tous droits réservés.
        </p>
      </div>
    </div>
  )
}
