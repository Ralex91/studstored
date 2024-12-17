import { Button } from "@/components/ui/button"
import { Undo2 } from "lucide-react"
import Link from "next/link"

const NotFoundPage = () => (
  <div className="flex-1 flex items-center justify-center flex-col">
    <h1 className="text-7xl font-bold text-primary">404</h1>
    <p className="text-2xl font-semibold">Page introuvable</p>
    <Link href="/">
      <Button className="mt-4">
        Retourner à l&apos;accueil <Undo2 />
      </Button>
    </Link>
  </div>
)

export default NotFoundPage
