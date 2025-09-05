'use client'

import { ProductList } from '@/fetch/getProductList/getProductListService'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import React from 'react'
import { flexRender } from '@tanstack/react-table'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ProductTableColumn } from '@/app/products/Components/ProductsTable/ProductTableColumn'

export default function ProductsTable({ products }: { products: ProductList }) {
    const table = useReactTable({
        columns: ProductTableColumn(),
        data: products.products,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="rounded-md border h-full">
            {/* The scroll container */}
            <Table className="w-full h-full relative max-h-[400px] overflow-y-auto">
                <TableHeader className="sticky top-0 z-10">
                    {table.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <TableHead
                                    key={header.id}

                                >
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
                <TableBody className=''>
                    {table.getRowModel().rows.map(row => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <TableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
