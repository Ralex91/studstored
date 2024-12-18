"use client"

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect } from "react"
import { toast } from "@/components/hooks/use-toast"
import { Copy } from "lucide-react"

const columns = [
  {
    accessorKey: "name",
    header: "Nom",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "username",
    header: "Nom d'utilisateur",
    cell: ({ row }) => <div>{row.getValue("username")}</div>,
  },
  {
    accessorKey: "role",
    header: "Rôle",
    cell: ({ row }) => <div>{row.getValue("role")}</div>,
  },
  {
    accessorKey: "password",
    header: "Mot de passe",
    cell: ({ row }) => {
      const password = row.getValue("password")
      const isNew = row.original.isNew

      const handleCopy = () => {
        navigator.clipboard.writeText(password)
        toast({
          title: "Mot de passe copié",
          description: `Le mot de passe "${password}" a été copié dans le presse-papiers.`,
        })
      }

      return (
        <div className="flex items-center">
          <span>{password}</span>
          {isNew && (
            <button
              onClick={handleCopy}
              className="ml-2 text-gray-500 hover:text-gray-800"
              aria-label="Copier le mot de passe"
            >
              <Copy className="h-5 w-5" />
            </button>
          )}
        </div>
      )
    },
  },
]

export default function UsersList({ users }) {
  const table = useReactTable({
    data: users || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="flex justify-center items-center space-x-40 mt-12 rounded-md border w-full">
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
