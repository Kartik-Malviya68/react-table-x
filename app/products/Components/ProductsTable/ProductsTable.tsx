"use client"

import { ProductList } from '@/fetch/getProductList/getProductListService'
import { flexRender } from '@tanstack/react-table'
import * as React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Pagination from '@/components/Table/Pagination/Pagination'
// ...existing code...
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, ArrowUpDown } from "lucide-react"
import { TableProvider, useTableContext } from './TableContext'
import ProductsTableToolbar from './ProductsTableToolbar'
import { ProductTableColumn } from './ProductTableColumn'

function TableInner() {
    const { table } = useTableContext()

    return (
        <div className="flex flex-col gap-2 p-2">
            <ProductsTableToolbar />
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

export default function ProductsTable({ products }: { products: ProductList }) {
    const memo = React.useMemo(() => ProductTableColumn(), [])
    return (
        <TableProvider products={products} cols={memo}>
            <TableInner />
        </TableProvider>
    )
}
