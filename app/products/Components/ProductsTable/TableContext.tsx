"use client"

import * as React from 'react'
import { ProductList } from '@/fetch/getProductList/getProductListService'
import { ProductTableColumn } from '@/app/products/Components/ProductsTable/ProductTableColumn'
import { filterFns } from '@/utils/filters'
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    Table as TableType,
    SortingState,
    ColumnFiltersState,
} from '@tanstack/react-table'

type TableContextType = {
    table: TableType<ProductList['products'][number]>
    globalFilter: string
    setGlobalFilter: (v: string) => void
    sorting: SortingState
    setSorting: (s: SortingState) => void
    columnFilters: ColumnFiltersState
    setColumnFilters: (c: ColumnFiltersState) => void
    columnVisibility: Record<string, boolean>
    setColumnVisibility: (v: Record<string, boolean>) => void
    rowSelection: Record<string, boolean>
    setRowSelection: (r: Record<string, boolean>) => void
}

const TableContext = React.createContext<TableContextType | undefined>(undefined)

export function TableProvider({ products, children }: { products: ProductList; children: React.ReactNode }) {
    const [globalFilter, setGlobalFilter] = React.useState('')
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({})
    const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})

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

    const value: TableContextType = {
        table,
        globalFilter,
        setGlobalFilter,
        sorting,
        setSorting,
        columnFilters,
        setColumnFilters,
        columnVisibility,
        setColumnVisibility,
        rowSelection,
        setRowSelection,
    }

    return <TableContext.Provider value={value}>{children}</TableContext.Provider>
}

export function useTableContext() {
    const ctx = React.useContext(TableContext)
    if (!ctx) throw new Error('useTableContext must be used within TableProvider')
    return ctx
}
