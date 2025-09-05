'use client'

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProductList } from '@/fetch/getProductList/getProductListService'
import {
    getCoreRowModel,
    useReactTable,
    flexRender,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    ColumnFiltersState,
} from '@tanstack/react-table'
import * as React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ProductTableColumn } from '@/app/products/Components/ProductsTable/ProductTableColumn'
import Pagination from '@/components/Table/Pagination/Pagination'
import { Input } from '@/components/ui/input'
import { filterFns } from '@/utils/filters'
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, ArrowUpDown } from "lucide-react"

export default function ProductsTable({ products }: { products: ProductList }) {
    const [globalFilter, setGlobalFilter] = React.useState('')
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data: products.products,
        columns: ProductTableColumn(),
        filterFns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        // keep only ASC<->DESC (no "unsorted" on 3rd click)
        enableSortingRemoval: false,
        // allow Shift+click to multi-sort (optional)
        enableMultiSort: true,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
    })

    return (
        <div className="flex flex-col gap-2 p-2">
            <div className="flex items-center gap-2 py-4">
                <Input
                    className="max-w-sm"
                    placeholder="Search products..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className="ml-1 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Table
                containerClassName="max-h-[400px] overflow-y-auto"
                className="border-separate border-spacing-0"
            >
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                const canSort = header.column.getCanSort()
                                const sort = header.column.getIsSorted() as false | 'asc' | 'desc'
                                const ariaSort =
                                    sort === 'asc' ? 'ascending' : sort === 'desc' ? 'descending' : 'none'

                                return (
                                    <TableHead
                                        key={header.id}
                                        className="sticky top-0 z-20 bg-background after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-border"
                                        aria-sort={ariaSort}
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div className="flex items-center">
                                                {canSort ? (
                                                    <Button
                                                        variant="ghost"
                                                        className="h-8 px-2 -ml-2 inline-flex items-center gap-1"
                                                        onClick={header.column.getToggleSortingHandler()}
                                                    >
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                        {sort === 'asc' ? (
                                                            <ChevronUp className="h-4 w-4" />
                                                        ) : sort === 'desc' ? (
                                                            <ChevronDown className="h-4 w-4" />
                                                        ) : (
                                                            <ArrowUpDown className="h-4 w-4 opacity-50" />
                                                        )}
                                                    </Button>
                                                ) : (
                                                    flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && 'selected'}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={ProductTableColumn().length}
                                className="h-24 text-center"
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <Pagination table={table} />
        </div>
    )
}
