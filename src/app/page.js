import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 bg-white text-gray-900">
      <div className="text-center space-y-6">
        <h1 className="text-5xl md:text-6xl font-bold">
          Bienvenue sur{" "}
          <span className="font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-800">
            StudStored
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Simplifiez la gestion de vos étudiants avec une interface intuitive et
          des outils modernes pour faire l&apos;appel en ligne.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link href="/login">
          <Button size="lg">
            Se connecter <User />
          </Button>
        </Link>
      </div>

      <div className="mt-16 text-sm text-gray-500 justify-self-end">
        <p>
          &copy; {new Date().getFullYear()} StudStored. Tous droits réservés.
        </p>
      </div>
    </div>
  )
}
