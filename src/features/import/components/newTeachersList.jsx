"use client"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/hooks/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Copy } from "lucide-react"

export function NewTeachersList({ teachers }) {
  const { toast } = useToast()

  const columns = [
    {
      accessorKey: "firstName",
      header: "Prénom",
      cell: ({ row }) => <div>{row.getValue("firstName")}</div>,
    },
    {
      accessorKey: "lastName",
      header: "Nom",
      cell: ({ row }) => <div>{row.getValue("lastName")}</div>,
    },
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <span>{row.getValue("username")}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => copieToClipboard(row.getValue("username"))}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
    {
      accessorKey: "plainPassword",
      header: "Password",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <span>{row.getValue("plainPassword")}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => copieToClipboard(row.getValue("plainPassword"))}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const copieToClipboard = (value) => {
    navigator.clipboard.writeText(value)
    toast({
      title: "Copié",
      description: "La valeur a été copiée dans le presse-papier.",
    })
  }

  const table = useReactTable({
    data: teachers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="w-full flex flex-col justify-center  items-center">
      <div className="text-center mb-4 w-3/4">
        <h1 className="text-lg font-bold">
          Voici la liste des enseignants importés.
        </h1>
        <p>
          Veuillez copier les informations de connexion des utilisateurs créés.
          Ils ne seront plus accessibles en claire après cette étape.
        </p>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  Aucun résultat trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
