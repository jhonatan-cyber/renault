"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus, Edit2, Trash2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Column {
  key: string
  label: string
  render?: (value: any, row: any) => React.ReactNode
}

interface DataTableProps {
  columns: Column[]
  data: any[]
  onAdd?: () => void
  onEdit?: (row: any) => void
  onDelete?: (row: any) => void
  searchFields?: string[]
}

export function DataTable({ columns, data, onAdd, onEdit, onDelete, searchFields = [] }: DataTableProps) {
  const [page, setPage] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")

  const itemsPerPage = 10

  const filteredData = searchTerm
    ? data.filter((row) =>
        searchFields.some((field) =>
          String(row[field] || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
        ),
      )
    : data

  const paginatedData = filteredData.slice(page * itemsPerPage, (page + 1) * itemsPerPage)

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        {searchFields.length > 0 && (
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setPage(0)
              }}
              className="pl-9"
            />
          </div>
        )}
        {onAdd && (
          <Button onClick={onAdd} size="sm">
            <Plus size={16} className="mr-2" />
            Agregar
          </Button>
        )}
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
              {(onEdit || onDelete) && <TableHead className="text-right">Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <TableRow key={idx}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>{col.render ? col.render(row[col.key], row) : row[col.key]}</TableCell>
                  ))}
                  {(onEdit || onDelete) && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {onEdit && (
                          <Button variant="ghost" size="sm" onClick={() => onEdit(row)}>
                            <Edit2 size={16} />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(row)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center py-4 text-muted-foreground">
                  No hay datos disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Página {page + 1} de {totalPages}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page === totalPages - 1}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
