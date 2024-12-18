import { Card } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

const ClassRow = ({ data }) => {
  return (
    <Link href={`/admin/classes/${data.id}`} className="hover:text-primary">
      <Card className="px-4 py-2 flex justify-between items-center group hover:bg-accent/20">
        <div>
          <p className="text-lg group-hover:text-primary">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            Année : {data.schoolYear.year}
          </p>
        </div>
        <ChevronRight className="group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </Card>
    </Link>
  )
}

export default ClassRow
